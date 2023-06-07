<template>
    <div class="list">
        <h1>Information about the user</h1>
    </div>
    <div v-if="userData.length > 0">
        <img v-bind:src="userData[0].userAvatarURL" alt="Avatar" style="width:100px">
        <p>User ID: {{ userData[0].userName }}</p>
        <p>User location: {{ userData[0].userLocation }} </p>
        <p>Number of public repos: {{ userData[0].userPublicRepos }} </p>
        <p>Number of followers: {{ userData[0].userFollowers }} </p>
    </div>
</template>

<script lang="ts">
export default {
    name: 'GistPage',
};

</script>

<script setup lang="ts">
import axios from 'axios';
import type { UserInterface } from './Interfaces';
import { ref, onMounted } from 'vue';

let userData = ref<UserInterface[]>([]);

onMounted(async () => {
    let userURI = 'http://localhost:5000/ghproxy/users/trotyoung';
    fetch(userURI)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            userData.value.push({ userName: data.login, userLocation: data.location, userAvatarURL: data.avatar_url, userPublicRepos: data.public_repos, userFollowers: data.followers });
        }
        );
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

