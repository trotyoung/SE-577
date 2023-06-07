<template>
    <div class="list">
        <h1>List all files in Gist</h1>
    </div>

    <div v-if="gistData.length > 0">
        <table>
            <tr>
                <th>No.</th>
                <th>File Name</th>
                <th>Language</th>
                <th>Size</th>
            </tr>
            <tr v-for="(gist, rowNum) in gistData">
                <td>{{ rowNum + 1 }}</td>
                <td>{{ gist.fileName }}</td>
                <td>{{ gist.fileLanguage }}</td>
                <td>{{ gist.fileSize }}</td>
            </tr>
        </table>
    </div>
    <div>
        <h2>The number of results is {{ gistData.length }}</h2>
    </div>
</template>

<script lang="ts">
export default {
    name: 'GistPage',
};

</script>

<script setup lang="ts">
import axios from 'axios';
import type { GistInterface } from './Interfaces';
import { ref, onMounted } from 'vue';

let gistData = ref<GistInterface[]>([]);

onMounted(async () => {
    let gistURI = 'http://localhost:5000/ghsecure/gists';
    let gistAPI = await axios.get<GistInterface[]>(gistURI);
    let tempData = ref<GistInterface[]>([]);
    if (gistAPI.status === 200) {
        tempData.value = gistAPI.request.response;
        let tempStr = JSON.parse(tempData.value);
        for (const property in tempStr) {
            console.log(`${property}: ${tempStr[property]}`);
            for (const file in tempStr[property].files) {
                const splitFileNames = tempStr[property].files[file].filename.split("|");
                let fileName = splitFileNames[splitFileNames.length - 1];
                gistData.value.push({ fileName: fileName, fileLanguage: tempStr[property].files[file].language, fileSize: tempStr[property].files[file].size });
            }
        }
    } else {
        console.log('Error: ' + gistAPI.status);
    }

});

</script>
    
    <!-- Add "scoped" attribute to limit CSS to this component only -->
    
<style scoped>
.emphasis-text {
    color: green;
}

.error-text {
    color: red;
}

.happy-text {
    color: green;
}
</style>

