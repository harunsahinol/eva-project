// src/store/modules/sales.js
import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    salesData: [],
    skuData: [],
  },
  mutations: {
    SET_SALES_DATA(state, data) {
      state.salesData = data;
    },
    SET_SKU_DATA(state, data) {
      state.skuData = data;
    }
  },
  actions: {
    async fetchSalesData({ commit, rootState }, { days }) {
      try {
        const response = await api.post('/data/daily-sales-overview', {
            day: days,
            excludeYoYData: true,
            marketplace: rootState.auth.userInfo.Data.user.store[0].marketplaceName,
            requestStatus: 0,
            sellerId: rootState.auth.userInfo.Data.user.store[0].storeId
        });
        commit('SET_SALES_DATA', response.data);
      } catch (error) {
        console.error('Failed to fetch sales data:', error);
      }
    },
    async fetchSkuData({ commit, rootState }, params) {
      try {
        const response = await api.post('/data/daily-sales-sku-list', {
          params: {
            ...params,
            marketplace: rootState.auth.userInfo.Data.user.store[0].marketplaceName,
            sellerId: rootState.auth.userInfo.Data.user.store[0].storeId
          },
          headers: { Authorization: `Bearer ${rootState.auth.token}` }
        });
        commit('SET_SKU_DATA', response.data);
      } catch (error) {
        console.error('Failed to fetch SKU data:', error);
      }
    }
  }
};