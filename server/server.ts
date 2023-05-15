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

let mockData: { repoName: string; repoURL: string; repoLanguage: string }[] = [];

try {
    const yamlData = fs.readFileSync('./data.yaml', 'utf8');
    mockData = yaml.load(yamlData);
} catch (error) {
    console.log(error);
}

//setup CORS - this will be necessary for API requests from a VUE or any SPA app 
server.register(cors, {
    origin: "*"
})

server.get('/repos', async (request, reply) => {
    return mockData;
})

interface requestName extends RequestGenericInterface {
    Params: {
        name: string
    }
}

server.get<requestName>('/repos/:name', async (request, reply) => {
    const { name } = request.params;
    const repo = mockData.find(element => element.repoName == name);
    if (repo) {
        return repo;
    } else {
        let errObj = { error: `The repo with name: ${name} was not found.` };
        reply.code(404).send(errObj);
        return
    }
})

interface requestMulti extends RequestGenericInterface {
    Querystring: {
        name: string,
        language: string
    }
}

server.get<requestMulti>('/search', async (request, reply) => {
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