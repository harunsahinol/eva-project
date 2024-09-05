// src/store/modules/sales.js

import api from "@/services/api";

export default {
  namespaced: true,
  state: {
    salesData: [],
    skuData: [],
    skuRefundRates: [],
    selectedColumns: [],
  },
  mutations: {
    SET_SALES_DATA(state, data) {
      state.salesData = data;
    },
    SET_SKU_DATA(state, data) {
      state.skuData = data;
    },
    SET_SKU_REFUND_RATES(state, data) {
      state.skuRefundRates = data;
    },
    SET_SELECTED_COLUMNS(state, columns) {
      state.selectedColumns = columns;
    },
  },
  actions: {
    async fetchSalesData({ commit, rootState }, { days }) {
      try {
        const { marketplaceName, storeId } = rootState.auth.userInfo.Data.user.store[0];
        const response = await api.post("/data/daily-sales-overview", {
          day: days,
          excludeYoYData: true,
          marketplace: marketplaceName,
          requestStatus: 0,
          sellerId: storeId,
        });
        commit("SET_SALES_DATA", response.data);
      } catch (error) {
        console.error("Failed to fetch sales data:", error);
        throw error;
      }
    },
    async fetchSkuData({ commit, rootState }, params) {
      try {
        const { marketplaceName, storeId } = rootState.auth.userInfo.Data.user.store[0];
        const response = await api.post("/data/daily-sales-sku-list", {
          ...params,
          marketplace: marketplaceName,
          sellerId: storeId,
        });
        commit("SET_SKU_DATA", response.data);
      } catch (error) {
        console.error("Failed to fetch SKU data:", error);
        throw error;
      }
    },
    async fetchSkuRefundRates({ commit, rootState }, { skuList, requestedDay }) {
      try {
        const { marketplaceName, storeId } = rootState.auth.userInfo.Data.user.store[0];
        const response = await api.post("/data/get-sku-refund-rate", {
          skuList,
          marketplace: marketplaceName,
          sellerId: storeId,
          requestedDay,
        });
        commit("SET_SKU_REFUND_RATES", response.data);
      } catch (error) {
        console.error("Error fetching SKU refund rates:", error);
        throw error;
      }
    },
    updateSelectedColumns({ commit }, columns) {
      commit("SET_SELECTED_COLUMNS", columns);
    },
  },
};