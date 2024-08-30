// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/LoginForm.vue';
import Dashboard from '../components/Dashboard.vue';
import store from '../store';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/dashboard'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.auth.token) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;