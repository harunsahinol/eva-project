// src/store/modules/auth.js
import api from "@/services/api";

export default {
  namespaced: true,
  state: {
    token: null,
    userInfo: null,
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },

    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo;
    },
    CLEAR_AUTH(state) {
      state.token = null;
      state.userInfo = null;
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    },
  },
  actions: {
    async login({ commit, dispatch }, credentials) {
      try {
        const response = await api.post("/oauth/token", {
          ...credentials,
          GrantType: "password",
          Scope: "amazon_data",
          ClientId: "C0001",
          ClientSecret: "SECRET0001",
          RedirectUri: "https://api.eva.guru",
        });
        const token = response.data.Data.AccessToken;
        commit("SET_TOKEN", token);
        await dispatch("getUserInfo");
        return true;
      } catch (error) {
        console.error("Login failed:", error);
        return false;
      }
    },
    async getUserInfo({ commit }) {
      try {
        const response = await api.post("/user/user-information",{
                    email: "homework@eva.guru"
                });
        commit("SET_USER_INFO", response.data);
      } catch (error) {
        console.error("Failed to get user info:", error);
        // If we get a 401 error, clear the auth state
        if (error.response && error.response.status === 401) {
          commit("CLEAR_AUTH");
        }
      }
    },
    logout({ commit }) {
      commit("CLEAR_AUTH");
    },
    checkAuth({ commit, dispatch }) {
      const token = localStorage.getItem("token");
      if (token) {
        commit("SET_TOKEN", token);
        dispatch("getUserInfo");
      }
    },
  },
};