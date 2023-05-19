<template>
    <div class="details">
        <h1>Search repo by name</h1>
    </div>
    <p>
        Repo name: <input type="text" v-model="repoName" @keypress="queryChanged" @keyup.delete="queryChanged" />
    </p>
    <p>
        <button type="button" @click="fetchRepoInfo()" :disabled="shouldDisable">
            Get Repo Info
        </button>
    </p>

    <div v-if="!apiErrorInfo.isError && !queryIsDirty">
        <p class="happy-text">Found repo with name: {{ repoName }}</p>
        <p>
            Repo Name: {{ repoData?.repoName }} <br />
            Repo URL: <a v-bind:href=repoData?.repoURL>{{ repoData?.repoURL }}</a><br />
            Repo Main Language: {{ repoData?.repoLanguage }} <br />
        </p>
    </div>

    <p class="error-text" v-if="apiErrorInfo.isError && !queryIsDirty"> Unable to find this repo, code = {{
        apiErrorInfo.errorCode }}</p>
</template>
    
<script lang="ts">
export default {
    name: 'SearchRepoPage',
};
</script>
    
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { RepoInterface, ErrorInterface } from './Interfaces';
import axios, { AxiosError } from 'axios';


const repoName = ref('')
let repoData = ref<RepoInterface | undefined>()
const apiErrorInfo = ref<ErrorInterface>({ isError: false, errorCode: 0, errorMessage: "" })
const queryIsDirty = ref(true)

const fetchRepoInfo = async () => {
    queryIsDirty.value = false
    let allRepoURI = `http://localhost:5000/repos/${repoName.value}`

    try {
        let repoResp = await axios.get<RepoInterface>(allRepoURI)

        if (repoResp.status == 200) {
            apiErrorInfo.value.isError = false;
            apiErrorInfo.value.errorCode = repoResp.status;
            apiErrorInfo.value.errorMessage = repoResp.statusText;
            repoData.value = repoResp.data
            console.log(repoData.value)
        } else {
            console.log("bad repo value")
        }
    } catch (err) {
        let e = err as AxiosError //convert to axios error type
        if (e.response) {
            apiErrorInfo.value.isError = true;
            apiErrorInfo.value.errorCode = e.response.status;
            apiErrorInfo.value.errorMessage = e.request.statusText;
            console.log("Got Error Code ", e.response.status)
        } else {
            // Anything else
        }
    }
}

const shouldDisable = computed(() => {
    return repoName.value.length > 0 ? false : true
})

const queryChanged = (e: Event) => {
    queryIsDirty.value = true;
    repoData.value = undefined;
}

</script>
    
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.emphasis-text{
    color: green;
}

.error-text{
    color:red;
}

.happy-text{
    color:green;
}

</style>