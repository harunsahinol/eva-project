<!-- src/components/SkuTable.vue -->
<template>
  <div
    v-if="paginatedSkuData.length > 0"
    class="p-6 bg-white rounded-lg shadow-md"
  >
    <table class="min-w-full bg-white border border-gray-200 rounded-lg">
      <thead>
        <tr class="bg-gray-100">
          <th
            v-for="header in tableHeaders"
            :key="header"
            class="py-2 px-4 text-left text-gray-600 font-semibold"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedSkuData" :key="item.sku" class="border-t">
          <td class="py-2 px-4">{{ item.sku }}</td>
          <td class="py-2 px-4">{{ item.productName }}</td>
          <td class="py-2 px-4">{{ item.amount }} / {{ item.qty }}</td>
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
  props: {
    selectedColumns: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const store = useStore();
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const tableHeaders = ["SKU", "Product Name", "Sales / Unit", "SKU Refund Rate"];

    const skuData = computed(() => store.state.sales.skuData);
    const skuRefundRates = computed(() => store.state.sales.skuRefundRates);

    const totalPages = computed(() => {
      const totalItems = skuData.value?.Data?.item?.skuList?.length || 0;
      return Math.ceil(totalItems / itemsPerPage);
    });

    const paginatedSkuData = computed(() => {
      const skuList = skuData.value?.Data?.item?.skuList || [];
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return skuList.slice(start, end);
    });

    const fetchSkuData = () => {
      if (props.selectedColumns.length > 0) {
        store.dispatch("sales/fetchSkuData", {
          isDaysCompare: props.selectedColumns.length === 2 ? 1 : 0,
          pageNumber: Math.ceil(currentPage.value / 3),
          pageSize: 30,
          salesDate: props.selectedColumns[0],
          salesDate2: props.selectedColumns[1] || "0",
        });
      }
    };

    const skuRefundRatesMap = computed(() => {
      const data = skuRefundRates.value.Data || [];
      return data.reduce((acc, item) => {
        if (item.sku && item.refundRate !== undefined) {
          acc[item.sku] = item.refundRate;
        }
        return acc;
      }, {});
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
        if (currentPage.value % 3 === 1) {
          fetchSkuData();
        }
        fetchSkuRefundRates();
      }
    };

    watch(paginatedSkuData, fetchSkuRefundRates, { immediate: true });
    watch(() => props.selectedColumns, fetchSkuData, { immediate: true });

    return {
      paginatedSkuData,
      currentPage,
      totalPages,
      prevPage,
      nextPage,
      skuRefundRatesMap,
      tableHeaders,
    };
  },
};
</script>