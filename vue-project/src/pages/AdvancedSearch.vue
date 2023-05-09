<template>
    <div class="details">
        <h1>Search repo in multiple ways</h1>
    </div>
    <p>Search by following Criteria:</p>
    <input type="radio" id="repoName" name="repo" value="Repo Name" v-model="queryOption">
    <label for="repoName">Repo Name</label><br>
    <input type="radio" id="repoLanguage" name="repo" value="Repo Main Language" v-model="queryOption">
    <label for="css">Repo Main Language</label><br>

    <p>
        QueryVal: <input type="text" v-model="queryValue" @keypress="queryChanged" @keyup.delete="queryChanged" />
    </p>
    <p>
        <button type="button" @click="fetchRepoInfo()" :disabled="shouldDisable">
            Get Repo Info
        </button>
    </p>

    <div v-if="repoData.length > 0 && !queryIsDirty">
        <p class="happy-text">Found repo as follows:</p>

        <table>
            <tr>
                <th>Repo Name</th>
                <th>Repo URL</th>
                <th>Repo Main Language</th>
            </tr>
            <tr v-for="(repo, rowNum) in repoData">
                <td>{{ repo.repoName }}</td>
                <td><a v-bind:href=repo.repoURL>{{ repo.repoURL }}</a></td>
                <td>{{ repo.repoLanguage }}</td>
            </tr>
        </table>
    </div>

    <p class="error-text" v-if="apiErrorInfo.isError && !queryIsDirty"> Unable to find this repo, code = {{
        apiErrorInfo.errorCode }}</p>
</template>
    
<script lang="ts">
export default {
    name: 'AdvancedSearchPage',
};
</script>
    
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { RepoInterface, ErrorInterface } from './Interfaces';
import axios, { AxiosError } from 'axios';

const queryOption = ref("Repo Name");  //default option
const queryValue = ref("");
const queryIsDirty = ref(false);
const apiErrorInfo = ref<ErrorInterface>({ isError: false, errorCode: 0, errorMessage: "" })

let repoData = ref<RepoInterface[]>([])

const queryChanged = (e: Event) => {
    queryIsDirty.value = true;
    repoData.value = [];
}

const radioButtonChanged = watch(queryOption, () => {
    queryIsDirty.value = true;
    repoData.value = [];
})

const radioButtonChanged_NotUsed = watch(queryOption, (old: string, updated: string) => {
    console.log(`RADIO BUTTON CHANGED ${old} ${updated}`)
})


const shouldDisable = computed(() => {
    return queryValue.value.length > 0 ? false : true
})

let queryByRepoNamePrefix = `http://localhost:5000/search?name=`
let queryByRepoLanguagePrefix = `http://localhost:5000/search?language=`

const fetchRepoInfo = async () => {
    queryIsDirty.value = false;

    const apiPrefix = (queryOption.value == "Repo Name") ? queryByRepoNamePrefix : queryByRepoLanguagePrefix;
    const apiURL = apiPrefix + queryValue.value;
    console.log(apiURL);
    try {
        let repoAPI = await axios.get<RepoInterface[]>(apiURL)
        console.log(repoAPI);
        if (repoAPI.status == 200) {
            console.log(repoAPI)
            apiErrorInfo.value.isError = false;
            apiErrorInfo.value.errorCode = repoAPI.status;
            apiErrorInfo.value.errorMessage = repoAPI.statusText;
            repoData.value = repoAPI.data
            console.log(repoData.value)
        }
    } catch (err) {
        let e = err as AxiosError //convert to axios error type
        if (e.response) {
            apiErrorInfo.value.isError = true;
            apiErrorInfo.value.errorCode = e.response.status;
            apiErrorInfo.value.errorMessage = e.request.statusText;
            console.log("Got Error Code ", e.response.status)
        }
    }
}

</script>
    
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.error-text {
    color: red;
}

.happy-text {
    color: green;
}
</style>