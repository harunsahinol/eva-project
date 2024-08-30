<!-- src/App.vue -->
<template>
  <div id="app" class="min-h-screen flex flex-col bg-gray-100">
    <nav
      v-if="isLoggedIn"
      class="bg-white shadow-md py-4 px-6 flex justify-between items-center"
    >
      <router-link
        to="/dashboard"
        class="text-blue-500 hover:text-blue-700 font-semibold"
        >Dashboard</router-link
      >
      <a
        href="#"
        @click.prevent="logout"
        class="text-red-500 hover:text-red-700 font-semibold"
        >Logout</a
      >
    </nav>
    <div class="flex-1 p-6">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

console.log("Stored token:", localStorage.getItem("token"));

export default {
  name: "App",
  setup() {
    const store = useStore();
    const router = useRouter();

    const isLoggedIn = computed(() => !!store.state.auth.token);

    const logout = () => {
      store.dispatch("auth/logout");
      router.push("/login");
    };

    onMounted(() => {
      store.dispatch("auth/checkAuth");
    });

    return {
      isLoggedIn,
      logout,
    };
  },
};
</script>

<style>
/* Your styles here */
</style>
