<template>
    <div class="list">
        <h1>List all the repos</h1>
    </div>
    <div v-if="repoData.length > 0">
        <table>
            <tr>
                <th>No.</th>
                <th>Repo Name</th>
                <th>Repo URL</th>
                <th>Repo Main Language</th>
            </tr>
            <tr v-for="(repo, rowNum) in repoData">
                <td>{{ rowNum + 1 }}</td>
                <td>{{ repo.repoName }}</td>
                <td><a v-bind:href=repo.repoURL>{{ repo.repoURL }}</a></td>
                <td>{{ repo.repoLanguage }}</td>
            </tr>
        </table>
    </div>
   <div>
    <h2>The number of results is {{ repoData.length }}</h2>
   </div>
</template>

<script lang="ts">
export default {
    name: 'ListPage',
};

</script>

<script setup lang="ts">
import axios from 'axios';
import type { RepoInterface } from './Interfaces';
import { ref, onMounted } from 'vue';

let repoData = ref<RepoInterface[]>([]);

onMounted(async () => {
    const response = await axios.get('https://api.github.com/users/bradtraversy/repos');
    let reposURI = 'http://localhost:5000/repos';
    let reposAPI = await axios.get<RepoInterface[]>(reposURI);

    if (reposAPI.status === 200) {
        repoData.value = reposAPI.data;
    } else {
        console.log('Error: ' + reposAPI.status);
    }

});

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

