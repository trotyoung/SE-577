import fastify, { RequestGenericInterface } from "fastify";
import cors from '@fastify/cors';
const fs = require('fs');
const yaml = require('js-yaml');
const server = fastify({
    logger: true,
});

import fastifyHttpProxy from "@fastify/http-proxy";
import dotenv from 'dotenv';
import {GetGHProxySecureOptions, GetGHProxyOptions } from "./proxy";

dotenv.config();

let proxyOptsSecure = GetGHProxySecureOptions(process.env.GITHUB_ACCESS_TOKEN)
server.register(fastifyHttpProxy, proxyOptsSecure)

let proxyOpts = GetGHProxyOptions()
server.register(fastifyHttpProxy, proxyOpts)

let rawData: object[] = [];

//setup CORS - this will be necessary for API requests from a VUE or any SPA app 
server.register(cors, { origin: '*' });

interface requestMulti extends RequestGenericInterface {
    Querystring: {
        name: string,
        language: string
    }
}

server.get<requestMulti>('/search', async (request, reply) => {

    const apiURL = 'http://localhost:5000/ghproxy/users/trotyoung/starred';
    const response = await fetch(apiURL);
    if (response.ok) {
        rawData = await response.json();
    } else {
        console.log(`Error: ${response.status}`);
    }

    let mockData: { repoName: string; repoURL: string; repoLanguage: string }[] = [];
    let jsonData = JSON.parse(JSON.stringify(rawData));
    for (let i = 0; i < jsonData.length; i++) {
        const element = jsonData[i];
        if (element.language == null) {
            element.language = "null";
        }
        mockData.push({
            repoName: element.name,
            repoURL: element.html_url,
            repoLanguage: element.language
        })
    }
    const { name, language } = request.query;

    if (name) {
        const repo = mockData.find(element => element.repoName.toLowerCase() == name.toLowerCase());
        if (repo) {
            return [repo];
        } else {
            let errObj = { error: `The repo with name: ${name} was not found.` };
            reply.code(404).send(errObj);
            return
        }
    } else if (language) {
        const repo = mockData.filter(element => element.repoLanguage.toLowerCase() == language.toLocaleLowerCase());
        if (repo.length > 0) {
            return repo;
        } else {
            let errObj = { error: `The repo with language: ${language} was not found.` };
            reply.code(404).send(errObj);
            return
        }
    } else {
        let errObj = { error: "The /search API requires a name or language parameter" };
        reply.code(400).send(errObj);
        return
    }
})

server.listen({ port: 5000, host: 'localhost' }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})