// src/store/index.js
import { createStore } from 'vuex';
import auth from './modules/auth';
import sales from './modules/sales';

export default createStore({
  modules: {
    auth,
    sales
  }
});


