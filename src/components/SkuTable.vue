<!-- src/components/SkuTable.vue -->
<template>
  <div v-if="paginatedSkuData.length > 0" class="p-6 bg-white rounded-lg shadow-md">
    <table class="min-w-full bg-white border border-gray-200 rounded-lg">
      <thead>
        <tr class="bg-gray-100">
          <th class="py-2 px-4 text-left text-gray-600 font-semibold">SKU</th>
          <th class="py-2 px-4 text-left text-gray-600 font-semibold">Product Name</th>
          <th class="py-2 px-4 text-left text-gray-600 font-semibold">Sales / Unit</th>
          <th class="py-2 px-4 text-left text-gray-600 font-semibold">SKU Refund Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedSkuData" :key="item.sku" class="border-t">
          <td class="py-2 px-4">{{ item.sku }}</td>
          <td class="py-2 px-4">{{ item.productName }}</td>
          <td class="py-2 px-4">{{ item.amount }} / {{ item.qty }}</td>
          <td class="py-2 px-4">{{ item.refundPercantage }}%</td>
        </tr>
      </tbody>
    </table>
    <div class="pagination-controls mt-4 flex justify-between items-center">
      <button @click="prevPage" :disabled="currentPage === 1" 
              class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
        Previous
      </button>
      <span class="text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" 
              class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
        Next
      </button>
    </div>
  </div>
  
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  props: {
    selectedColumns: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const store = useStore();
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const skuData = computed(() => store.state.sales.skuData);
    
    const totalPages = computed(() => {
      if (skuData.value && skuData.value.Data && skuData.value.Data.item) {
        return Math.ceil(skuData.value.Data.item.skuList.length / itemsPerPage);
      }
      return 0;
    });

    const paginatedSkuData = computed(() => {
      if (skuData.value && skuData.value.Data && skuData.value.Data.item) {
        const start = (currentPage.value - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return skuData.value.Data.item.skuList.slice(start, end);
      }
      return [];
    });

    const fetchSkuData = () => {
      if (props.selectedColumns.length > 0) {
        store.dispatch('sales/fetchSkuData', {
          isDaysCompare: props.selectedColumns.length === 2 ? 1 : 0,
          marketplace: store.state.user.userInfo.marketplaceName,
          pageNumber: Math.ceil(currentPage.value / 3),
          pageSize: 30,
          salesDate: props.selectedColumns[0],
          salesDate2: props.selectedColumns[1] || "0",
          sellerId: store.state.user.userInfo.storeId
        });
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        if (currentPage.value % 3 === 1) {
          fetchSkuData();
        }
      }
    };

    watch(() => props.selectedColumns, fetchSkuData, { immediate: true });

    return {
      skuData,
      paginatedSkuData,
      currentPage,
      totalPages,
      prevPage,
      nextPage
    };
  }
};
</script>


