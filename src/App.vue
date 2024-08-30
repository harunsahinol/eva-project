<!-- src/App.vue -->
<template>
  <div id="app">
    <nav v-if="isLoggedIn">
      <router-link to="/dashboard">Dashboard</router-link>
      <a href="#" @click.prevent="logout">Logout</a>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

console.log('Stored token:', localStorage.getItem('token'));


export default {
  name: 'App',
  setup() {
    const store = useStore();
    const router = useRouter();

    const isLoggedIn = computed(() => !!store.state.auth.token);

    const logout = () => {
      store.dispatch('auth/logout');
      router.push('/login');
    };

    onMounted(() => {
      store.dispatch('auth/checkAuth');
    });

    return {
      isLoggedIn,
      logout
    };
  }
}
</script>

<style>
/* Your styles here */
</style>