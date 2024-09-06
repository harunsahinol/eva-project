<!-- src/components/SalesChart.vue -->
<template>
  <div class="relative">
    <select
      v-model="selectedDays"
      @change="updateChart"
      class="absolute z-10 top-0 right-0 bg-white border border-gray-300 rounded-lg p-2"
    >
      <option v-for="option in dayOptions" :key="option" :value="option">
        {{ option }} days
      </option>
    </select>
    <div ref="chartContainer" class="mt-6"></div>
    <SkuTable :selectedColumns="selectedColumns" />
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
import { useStore } from "vuex";
import Highcharts from "highcharts";
import SkuTable from "./SkuTable.vue";

export default {
  components: {
    SkuTable,
  },
  setup() {
    const store = useStore();
    const chartContainer = ref(null);
    const selectedDays = ref(30);
    const dayOptions = [7, 14, 30, 60];
    const selectedColumns = ref([]);

    const salesData = computed(() => store.state.sales.salesData);

    const updateChart = () => {
      store.dispatch("sales/fetchSalesData", { days: selectedDays.value });
    };

    const renderChart = () => {
      if (chartContainer.value && salesData.value?.Data?.item?.length > 0) {
        const chartData = salesData.value.Data.item.map((item) => ({
          y: item.profit,
          totalSales: item.fbaAmount + item.fbmAmount,
          fbaAmount: item.fbaAmount,
          fbmAmount: item.fbmAmount,
          profit: item.profit,
          sku: item.sku,
          date: item.date,
        }));

        Highcharts.chart(chartContainer.value, {
          chart: { type: "column" },
          title: { text: "Daily Sales Overview", align: "left" },
          xAxis: {
            categories: salesData.value.Data.item.map((item) => item.date),
            crosshair: true,
          },
          yAxis: { title: { text: "Amount" } },
          tooltip: {
            formatter: function () {
              return `<b>${this.x}</b><br/>
                Total Sales: ${this.point.totalSales}<br/>
                Profit: ${this.point.profit}<br/>
                FBA Sales: ${this.point.fbaAmount}<br/>
                FBM Sales: ${this.point.fbmAmount}`;
            },
          },
          plotOptions: {
            column: {
              stacking: "normal",
              cursor: "pointer",
              point: {
                events: {
                  click: function () {
                    const columnDate = this.category;

                    if (selectedColumns.value.length === 0) {
                      // If no columns are selected, add the clicked column
                      selectedColumns.value.push(columnDate);
                    } else if (selectedColumns.value.length === 1) {
                      // If one column is already selected
                      if (selectedColumns.value[0] < columnDate) {
                        // If the clicked column is later, add it as the end date
                        selectedColumns.value.push(columnDate);
                      } else if (selectedColumns.value[0] > columnDate) {
                        // If the clicked column is earlier, add it as the start date
                        selectedColumns.value.unshift(columnDate);
                      } else {
                        // If the same column is clicked again, deselect it
                        selectedColumns.value = [];
                      }
                    } else if (selectedColumns.value.length === 2) {
                      // If two columns are already selected
                      if (selectedColumns.value.includes(columnDate)) {
                        // If the clicked column is already selected, remove it
                        selectedColumns.value = selectedColumns.value.filter(
                          (date) => date !== columnDate
                        );
                      } else {
                        // If a new column is clicked, replace the range with the new selection
                        selectedColumns.value = [columnDate];
                      }
                    }

                    // Dispatch the updated selection to the store
                    store.dispatch(
                      "sales/updateSelectedColumns",
                      selectedColumns.value
                    );
                  },
                },
              },
            },
          },
          series: [
            { name: "Profit", data: chartData },
            {
              name: "FBA Amount",
              data: chartData.map((item) => ({ ...item, y: item.fbaAmount })),
            },
            {
              name: "FBM Amount",
              data: chartData.map((item) => ({ ...item, y: item.fbmAmount })),
            },
          ],
        });
      }
    };

    watch(salesData, renderChart);
    watch(selectedColumns, () => {
      store.dispatch("sales/updateSelectedColumns", selectedColumns.value);
    });

    onMounted(() => {
      updateChart();
    });

    return {
      chartContainer,
      selectedDays,
      dayOptions,
      updateChart,
      selectedColumns,
    };
  },
};
</script>
