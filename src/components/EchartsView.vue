<template>
  <div
    class="row-chart"
    id="rowChart"
    ref="echart"
    :style="{ width: `${width}px`, height: `${height}px` }"
  ></div>
</template>

<script>
import * as echarts from "echarts";
import { onMounted, toRefs, ref, watch } from "vue";

export default {
  name: "HorizontalBarChart",
  props: {
    title: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "444",
    },
    width: {
      type: String,
      default: "438",
    },
    dataY: {
      type: Array,
      default: () => {
        return [];
      },
    },
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    colorStart: {
      type: String,
      default: "#4CA2F7",
    },
    colorEnd: {
      type: String,
      default: "#318FF3",
    },
  },
  setup(props) {
    const { title, dataY, data, colorStart, colorEnd } = toRefs(props);
    let echart = ref(null);
    const intiChart = () => {
      let rowBarChart = echarts.init(echart.value);
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: 70,
          right: 25,
          top: 30,
          bottom: 35,
        },
        xAxis: {
          type: "value",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              type: "dashed", // y轴分割线类型
            },
          },
        },
        yAxis: {
          type: "category",
          data: dataY.value,
          splitLine: { show: false },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          offset: 10,
          nameTextStyle: {
            fontSize: 15,
          },
        },
        series: [
          {
            name: title.value,
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(238, 246, 255, 1)",
            },
            data: data.value,
            barWidth: 14,
            barGap: 10,
            itemStyle: {
              emphasis: {
                barBorderRadius: [0, 7, 7, 0],
              },
              normal: {
                // barBorderRadius: 7,
                barBorderRadius: [0, 7, 7, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: colorStart.value },
                  { offset: 1, color: colorEnd.value },
                ]),
              },
            },
          },
        ],
      };
      option && rowBarChart.setOption(option);
    };
    watch(
      dataY,
      () => {
        intiChart();
      },
      { deep: true }
    );

    onMounted(() => {
      intiChart();
    });
    return {
      intiChart,
      echart,
      //   height,
      //   width,
      //   colorStart,
      //   colorEnd,
      //   title,
    };
  },
};
</script>

<style scoped></style>
