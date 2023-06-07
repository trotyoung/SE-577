<template>
    <div class="list">
        <h1>List starring repos</h1>
    </div>
    <div>
      <table v-if="paginatedTableData.length > 0">
        <thead>
          <tr style="text-align: left;">
            <th>Repo Name</th>
            <th>Repo URL</th>
            <th>Repo Language</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedTableData" :key="item.repoName">
            <td>{{ item.repoName }}</td>
            <td><a v-bind:href=item.repoURL>{{ item.repoURL }}</a></td>
            <td>{{ item.repoLanguage }}</td>
          </tr>
        </tbody>
      </table>
  
      <div>
        <button @click="previousPage" style="margin-right: 10px;">Previous</button>
        <span>{{ currentPage }}</span>
        <button @click="nextPage" style="margin-left: 10px;">Next</button>
      </div>
    </div>
  </template>
  

<script lang="ts">
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import type { RepoInterface } from './Interfaces';
export default {
  name: 'ListPage',
  setup() {
    const tableData = ref([]); // Reactive reference for tableData

    const currentPage = ref(1);
    const itemsPerPage = 10;

    const paginatedTableData = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      return tableData.value.slice(startIndex, endIndex);
    });

    const totalPages = computed(() => {
      return Math.ceil(tableData.value.length / itemsPerPage);
    });

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    onMounted(async () => {
      let reposURI = 'http://localhost:5000/ghproxy/users/trotyoung/starred';
      let reposAPI = await axios.get<RepoInterface[]>(reposURI);
      if (reposAPI.status === 200) {
        let tempData = reposAPI.data;
        tableData.value = tempData.map((item: RepoInterface) => ({
          repoName: item.name,
          repoURL: item.html_url,
          repoLanguage: item.language
        }));
      } else {
        console.log('Error: ' + reposAPI.status);
      }
    });

    return {
      tableData,
      currentPage,
      itemsPerPage,
      paginatedTableData,
      totalPages,
      previousPage,
      nextPage
    };
  }
};
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

