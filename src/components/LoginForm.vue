<!-- src/components/LoginForm.vue -->
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Login
      </h2>
      <h3>email : homework@eva.guru --!!-- password : Homeworkeva1**</h3>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const email = ref("");
    const password = ref("");

    const handleSubmit = async () => {
      const success = await store.dispatch("auth/login", {
        Email: email.value,
        Password: password.value,
      });
      if (success) {
        router.push("/dashboard");
      } else {
        alert("Login failed. Please try again.");
      }
    };

    return {
      email,
      password,
      handleSubmit,
    };
  },
};
</script>

<style></style>
