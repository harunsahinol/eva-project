<!-- src/components/Dashboard.vue -->
<template>
  <div>
    <SalesChart />

  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import SalesChart from './SalesChart.vue';


export default {
  components: {
    SalesChart,

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