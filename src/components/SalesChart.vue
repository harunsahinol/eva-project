<!-- src/components/SalesChart.vue -->
<template>
  <div>
    <select v-model="selectedDays" @change="updateChart">
      <option v-for="option in dayOptions" :key="option" :value="option">
        {{ option }} days
      </option>
    </select>
    <div ref="chartContainer"></div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
import { useStore } from "vuex";
import Highcharts from "highcharts";
import axios from "axios";

export default {
  setup() {
    const store = useStore();
    const chartContainer = ref(null);
    const selectedDays = ref(30);
    const dayOptions = [7, 14, 30, 60];

    const salesData = computed(() => store.state.sales.salesData);

    const updateChart = () => {
      console.log("Fetching data for", selectedDays.value, "days");
      store
        .dispatch("sales/fetchSalesData", { days: selectedDays.value })
        .then(() => console.log("Data fetched:", store.state.sales.salesData))
        .catch((error) => console.error("Error fetching data:", error));
    };

    const renderChart = () => {
      if (
        chartContainer.value &&
        salesData.value.Data &&
        salesData.value.Data.item.length > 0
      ) {
        const chartData = salesData.value.Data.item.map((item) => ({
          y: item.profit,
          totalSales: item.fbaAmount + item.fbmAmount,
          fbaShippingAmount: item.fbaShippingAmount,
          fbaAmount: item.fbaAmount,
          fbmAmount: item.fbmAmount,
          profit: item.profit,
          sku: item.sku, // Assuming SKU is available in sales data
        }));

        Highcharts.chart(chartContainer.value, {
          chart: { type: "column" },
          title: { text: "Daily Sales Overview" },
          xAxis: {
            categories: salesData.value.Data.item.map((item) => item.date),
            crosshair: true,
          },
          yAxis: { title: { text: "Amount" } },
          tooltip: {
            formatter: function () {
              return `<b>${this.x}</b><br/>
            Total Sales: ${this.point.totalSales}<br/>
            Shipping: ${this.point.fbaShippingAmount}<br/>
            Profit: ${this.point.profit}<br/>
            FBA Sales: ${this.point.fbaAmount}<br/>
            FBM Sales: ${this.point.fbmAmount}`;
            },
          },
          plotOptions: {
            column: {
              cursor: "pointer",
              point: {
                events: {
                  click: function () {
                    axios
                      .post(`${apiUrl}/data/daily-sales-sku-list`, postData, {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                      })
                      .then((response) => {
                        if (
                          response.data &&
                          response.data.Data &&
                          response.data.Data.item &&
                          response.data.Data.item.skuList
                        ) {
                          setSkuListData(response.data.Data.item.skuList);
                        } else {
                          console.log("skuListData is not available yet");
                        }
                      });
                  },
                },
              },
            },
          },
          series: [
            {
              name: "Profit",
              data: chartData,
            },
            {
              name: "FBA Amount",
              data: salesData.value.Data.item.map((item) => ({
                y: item.fbaAmount,
                totalSales: item.fbaAmount + item.fbmAmount,
                fbaShippingAmount: item.fbaShippingAmount,
                fbaAmount: item.fbaAmount,
                fbmAmount: item.fbmAmount,
                profit: item.profit,
                sku: item.sku,
              })),
            },
            {
              name: "FBM Amount",
              data: salesData.value.Data.item.map((item) => ({
                y: item.fbmAmount,
                totalSales: item.fbaAmount + item.fbmAmount,
                fbaShippingAmount: item.fbaShippingAmount,
                fbaAmount: item.fbaAmount,
                fbmAmount: item.fbmAmount,
                profit: item.profit,
                sku: item.sku,
              })),
            },
          ],
        });
      } else {
        console.error("No sales data available for chart rendering.");
      }
    };

    watch(salesData, renderChart);

    onMounted(() => {
      updateChart();
    });

    return {
      chartContainer,
      selectedDays,
      dayOptions,
      updateChart,
    };
  },
};
</script>
