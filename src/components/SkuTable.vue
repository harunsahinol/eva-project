<!-- src/components/SkuTable.vue -->

<template>
  <div v-if="skuData.length > 0">
    <table>
      <thead>
        <tr>
          <th>SKU</th>
          <th>ASIN</th>
          <th>Title</th>
          <th>Units Sold</th>
          <th>Sales</th>
          <th>SKU Refund Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedSkuData" :key="item.sku">
          <td>{{ item.sku }}</td>
          <td>{{ item.asin }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.unitsSold }}</td>
          <td>{{ item.sales }}</td>
          <td>{{ item.refundRate }}%</td>
        </tr>
      </tbody>
    </table>
    <div class="pagination-controls">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const currentPage = ref(1);
    const itemsPerPage = 10;

    const skuData = computed(() => store.state.sales.skuData);
    const totalPages = computed(() => Math.ceil(skuData.value.length / itemsPerPage));

    const paginatedSkuData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return skuData.value.slice(start, end);
    });

    const fetchSkuData = () => {
      store.dispatch('sales/fetchSkuData', {
        pageNumber: currentPage.value,
        pageSize: itemsPerPage,
        salesDate: new Date().toISOString().split('T')[0] // Today's date
      });
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        fetchSkuData();
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        fetchSkuData();
      }
    };

    watch(currentPage, (newPage, oldPage) => {
      if (Math.floor(newPage / itemsPerPage) !== Math.floor(oldPage / itemsPerPage)) {
        fetchSkuData();
      }
    });

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

<style scoped>
/* Add styles as needed */
.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
</style>
