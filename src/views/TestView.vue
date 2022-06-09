<template>
  <horizontal-bar-chart
    :dataY="brokerAcclaimRate.names"
    :data="brokerAcclaimRate.values"
    color-start="#4CC6C9"
    color-end="#31B3C6"
    title="好评率"
  ></horizontal-bar-chart>
</template>
<script>
import horizontalBarChart from "@/components/EchartsView.vue";
import { reactive } from "@vue/reactivity";
// 引入api接口
import { getTotalApi } from "@/api/chart";
import { onMounted } from "@vue/runtime-core";
export default {
  components: {
    horizontalBarChart,
  },
  setup() {
    const brokerAcclaimRate = reactive({
      names: [1, 2, 3, 4, 5, 6, 7],
      values: [31, 23, 34, 53, 23, 35, 24],
    });
    // echart图表接口api
    const initEchartFn = async () => {
      let res = await getTotalApi();
      if (res.meta.state === 200) {
        // 接口数据赋值
        brokerAcclaimRate.names = res.data.pv_title;
        brokerAcclaimRate.values = res.data.pv_data;
      }
    };
    onMounted(() => {
      initEchartFn();
    });
    return {
      brokerAcclaimRate,
      initEchartFn,
    };
  },
};
</script>
