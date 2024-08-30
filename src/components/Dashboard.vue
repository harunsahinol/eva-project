<!-- src/components/Dashboard.vue -->
<template>
  <div>
    <h1 class="align-center text-3xl font-bold">Dashboard</h1>
    <SalesChart />
    <SkuTable />
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import SalesChart from './SalesChart.vue';
import SkuTable from './SkuTable.vue';

export default {
  components: {
    SalesChart,
    SkuTable,
  },
  setup() {
    const store = useStore();

    onMounted(() => {
      store.dispatch('sales/fetchSalesData', { days: 30 });
    });

    return {};
  },
};
</script>