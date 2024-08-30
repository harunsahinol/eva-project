// src/store/index.js
import { createStore } from 'vuex';
import auth from './modules/auth';
import sales from './modules/sales';
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  modules: {
    auth,
    sales
  },plugins: [
    createPersistedState({
      paths: ['auth.userInfo'] // Specify which part of the state to persist
    })
  ]
});
