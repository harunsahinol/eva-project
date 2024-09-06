<!-- src/components/SkuTable.vue -->
<template>
  <div
    v-if="paginatedSkuData.length > 0"
    class="mt-6 p-6 bg-white rounded-lg shadow-md"
  >
    <!-- Search input remains unchanged -->
    <table class="min-w-full bg-white border border-gray-200 rounded-lg">
      <thead>
        <tr class="bg-gray-100">
          <th
            v-for="header in tableHeaders"
            :key="header"
            class="py-2 px-4 text-left text-gray-600 font-bold"
            v-html="header"
          ></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedSkuData" :key="item.sku" class="border-t">
          <td class="py-2 px-4">{{ item.sku }}</td>
          <td class="py-2 px-4">{{ item.productName }}</td>
          <td class="py-2 px-4 salesunit">
            {{ formatSalesUnit(item.amount, item.qty) }} <br />
            ({{ item.qty ? (item.amount / item.qty).toFixed(2) : "N/A" }})
          </td>
          <td v-if="isDaysCompare" class="py-2 px-4 salesunit">
            {{ formatSalesUnit(item.amount2, item.qty2) }} <br />
            ({{ item.qty2 ? (item.amount2 / item.qty2).toFixed(2) : "N/A" }})
            <span v-if="isDaysCompare" class="ml-2">
              <span v-html="getSalesComparisonArrow(item.amount, item.amount2)"></span>
            </span>
          </td>
          <td class="py-2 px-4">{{ skuRefundRatesMap[item.sku] || 0 }}%</td>
        </tr>
      </tbody>
    </table>
    <div class="pagination-controls mt-4 flex justify-between items-center">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span class="text-gray-600"
        >Page {{ currentPage }} of {{ totalPages }}</span
      >
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const searchQuery = ref("");

    const selectedColumns = computed(() => store.state.sales.selectedColumns);
    const skuData = computed(() => store.state.sales.skuData);
    const skuRefundRates = computed(() => store.state.sales.skuRefundRates);

    const isDaysCompare = computed(() => selectedColumns.value.length > 1);

    const tableHeaders = computed(() => [
      "SKU",
      "Product Name",
      `Sales / Unit <br/>${selectedColumns.value[0] || ""}<br/>(Avg. Price)`,
      ...(isDaysCompare.value
        ? [`Sales / Unit <br/>${selectedColumns.value[1] || ""}<br/>(Avg. Price)`]
        : []),
      "SKU Refund Rate",
    ]);

    const filteredSkuData = computed(() => {
      const skuList = skuData.value?.Data?.item?.skuList || [];
      if (!searchQuery.value) return skuList;
      return skuList.filter(
        (item) =>
          item.productName &&
          item.productName
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase())
      );
    });

    const totalPages = computed(() => {
      const totalItems = filteredSkuData.value.length;
      return Math.ceil(totalItems / itemsPerPage);
    });

    const paginatedSkuData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredSkuData.value.slice(start, end);
    });

    const fetchSkuData = () => {
      if (selectedColumns.value && selectedColumns.value.length > 0) {
        store.dispatch("sales/fetchSkuData", {
          isDaysCompare: isDaysCompare.value ? 1 : 0,
          pageNumber: Math.ceil(currentPage.value / 3),
          pageSize: 30,
          salesDate: selectedColumns.value[0],
          salesDate2: selectedColumns.value[1] || "",
        });
      }
    };

    const skuRefundRatesMap = computed(() => {
      const data = skuRefundRates.value?.Data || [];
      return Array.isArray(data)
        ? data.reduce((acc, item) => {
            if (item.sku && item.refundRate !== undefined) {
              acc[item.sku] = item.refundRate;
            }
            return acc;
          }, {})
        : {};
    });

    const fetchSkuRefundRates = () => {
      const skuList = paginatedSkuData.value.map((item) => item.sku);
      store.dispatch("sales/fetchSkuRefundRates", {
        skuList,
        requestedDay: 30,
      });
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        fetchSkuRefundRates();
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        fetchSkuRefundRates();
      }
    };

    const formatSalesUnit = (amount, qty) => {
      if (amount === undefined || qty === undefined) {
        return "N/A";
      }
      return `${amount} / ${qty}`;
    };

    const getSalesComparisonArrow = (amount1, amount2) => {
      if (amount1 === undefined || amount2 === undefined) {
        return '';
      }
      if (amount2 > amount1) {
        return '<span class="text-green-500">&#9650;</span>'; // Green up arrow
      } else if (amount2 < amount1) {
        return '<span class="text-red-500">&#9660;</span>'; // Red down arrow
      }
      return ''; // Equal, no arrow
    };


    watch(selectedColumns, fetchSkuData, { immediate: true, deep: true });
    watch(paginatedSkuData, fetchSkuRefundRates, { immediate: true });
    watch(searchQuery, () => {
      currentPage.value = 1;
      fetchSkuRefundRates();
    });

    return {
      paginatedSkuData,
      currentPage,
      totalPages,
      prevPage,
      nextPage,
      skuRefundRatesMap,
      tableHeaders,
      isDaysCompare,
      formatSalesUnit,
      searchQuery,
      getSalesComparisonArrow,
    };
  },
};
</script>

<style scoped>
.salesunit {
  white-space: nowrap;
}
</style>

