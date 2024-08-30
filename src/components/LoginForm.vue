<!-- src/components/LoginForm.vue -->
<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleSubmit">
      <input v-model="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const email = ref('');
    const password = ref('');

    const handleSubmit = async () => {
      const success = await store.dispatch('auth/login', {
        Email: email.value,
        Password: password.value,
      });
      if (success) {
        router.push('/dashboard');
      } else {
        alert('Login failed. Please try again.');
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