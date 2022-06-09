<template>
  <div id="myChart" ref="myChart"></div>
</template>
<script>
import { onMounted } from "vue";
import { ref, reactive, toRefs } from "vue";
// 引入echarts.js
import * as echarts from "echarts";
// 引入api接口
import { getTotalApi } from "@/api/chart";

export default {
  setup() {
    // 获取myChartDom节点
    const myChart = ref(null);
    // 定义数据state
    const state = reactive({
      data: {
        xAxis: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"],
        legendData: ["昨日", "今日"],
        seriesData: [
          [2501, 2400, 2350, 2300, 2200, 2450],
          [1100, 1300, 900, 700, 800, 1600],
        ],
      },
    });
    // 封装echart图表配置
    const echartsInit = (data) => {
      // 处理data中seriesData数据弄一个柱状图 当作背景
      // 合并数组 取最大值 向上取整为500的倍数 形成一个新数组
      let temp = data.seriesData[0].concat(data.seriesData[1]);
      temp = Math.ceil(Math.max(...temp) / 500) * 500;
      let arr = [];
      for (let i = 0; i <= data.seriesData[0].length; i++) {
        arr.push(temp);
      }
      data.seriesData.push(arr);
      return {
        color: ["#00aeff", "#15d651"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            lineStyle: {
              type: [10, 0],
            },
          },
          formatter: (params) => {
            for (var i in params) {
              if (i < 2) {
                return `${params[i].axisValue}
                        <br/>
                        ${params[0].seriesName}:  &nbsp;${params[0].value}
                        <br/>
                        ${params[1].seriesName}:  &nbsp;${params[1].value}
                        `;
              }
            }
          },
          backgroundColor: "#155983",
          borderColor: "#155983",
          textStyle: {
            color: "#fff",
            fontWeight: 500,
          },
        },
        legend: {
          top: "5%",
          right: "14%",
          icon: "rect",
          itemGap: 20,
          itemWidth: 18,
          itemHeight: 8,
          textStyle: {
            color: "inherit",
          },
          data: data.legendData,
        },
        grid: {
          left: "6%",
          right: "8%",
          bottom: "6%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: ["10%", "10%"],
          interval: 10,
          axisLine: {
            // x轴坐标轴线
            lineStyle: {
              color: "#254f5b",
              width: 2,
            },
          },
          axisTick: false, // 去掉刻度线
          axisLabel: {
            // 坐标轴标签
            color: "#afb2b7",
            fontSize: 12,
            fontWeight: 600,
            barWidth: 20,
          },
          data: data.xAxis,
        },
        yAxis: {
          type: "value",
          axisLabel: {
            // 坐标轴标签
            color: "#afb2b7",
            fontSize: 12,
            fontWeight: 600,
          },
          splitLine: {
            // grid中的线
            lineStyle: {
              color: "#061229",
            },
          },
        },
        series: [
          {
            name: data.legendData[0],
            type: "line",
            label: {
              show: true,
              color: "#000",
              fontSize: 14,
              lineHeight: 16,
              fontWeight: 600,
              padding: 4,
              backgroundColor: {
                image:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAXCAYAAAB0zH1SAAAAAXNSR0IArs4c6QAAAKdJREFUWEft0rEJAlEQhOF/L7cPzS3DC0zERPuwHCMNDsE+DG3AzAYEBWFFMTK5CZYDYV48b3f43gv2mfzhCRcf+NUsPjA4Fre4KOCvIkKVxSxeRikOsrgIVRazeBmlOMjiIlRZzOJllOKgEHNarMsxTw7A5OfCBZixjLM2qD9VW/y975gj7mxJ5t/1JxpaFnHtr6Mn6ot/dmewY0PDlAcr1nHTK2nJF0UiRxCzii+oAAAAAElFTkSuQmCC",
              },
              position: [-10, -30], // 左 上
            },
            symbol:
              "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAXCAYAAAALHW+jAAAAAXNSR0IArs4c6QAAAnVJREFUSEullc1LVFEYxn/vnZmk1FQUi5S+wEZLyxTLTBdtCloW6LXpA1ft+gNqM7v+BlcR6RQDtnQhiBAmpmU6YIpBCzdWUolZajP3vnFmRJyrM415tvd5fvec933Oe4RcVkQPYXGUr8R4IOvZLJKV90SLyacJpQz4jEMFyhtC8jGTb2dgtx7gII3AcZQp/EzTLg4RLUNoQ4izyjBdsuQFpwO7NUAR9UANDrMEmKRd/qSbVIhwGqEBYRaLieTPNlYKGFaL6qTIwOZZ5x135VfWckR1PwkuYVHOOiPck3mjF6JaRILrKN+BMULyI5c+bWqiWoFDa9KfYETo00oSnKVD+ncF2iqOqg+HFpSA0KvH8BHEloFtwBd6CngMXN34NoDLI27J7DbtMw3i47ABnsTiBJ0ymCYyMGUUocRjNiVpxpY5j74Gl1IDrAIqCcmQR9AH3MhQhpfYctOjr8WlUIhoNUo5IXnlEfwECjIAV7Cl0KM/h0OeAZ7BRzEd8noXwGVsKfLoG3AQE5s6XPKxZXSPR27CIm6A9bgEsGV8T03p0WYsfpumNOJDsWUiY2yUawgOyiDKwx1j06OXsVgywAtmq3TK+/8OtjE+1zaUxVQOoZUAMT4QIyzursFPtZR9XMFlKjUcolqASwtQRJxh7shCTlDj0+S8PILLJHPMpI8vcw39tOCywBqjdMnajuB+zWOZ8ziYqznNCjHuSzw1bbxrSP0sYjIVRHiLLTObkrD6qaIWizocPrEvOQtXtyIyPwG9WoKVnM6Ciwm9mdYNwBccxrktyzvtPvubkqpvEJeLKN/wMUa7LGar77+Bxm2OGpZELo36C9tj7pLvOlwJAAAAAElFTkSuQmCC",
            symbolSize: 20, // 标记的大小
            data: data.seriesData[0],
          },
          {
            name: data.legendData[1],
            type: "line",
            label: {
              show: true,
              color: "#000",
              fontSize: 14,
              lineHeight: 16,
              fontWeight: 600,
              padding: 4,
              backgroundColor: {
                image:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAXCAYAAAB0zH1SAAAAAXNSR0IArs4c6QAAALhJREFUWEdjFL0W+J9hCALGUYfTOdZGQ5zOAc4wGuKjIU5kCIwmFSIDimrKRkOcakFJpEGjIU5kQFFN2WiIUy0oiTRoNMSJDCiqKRsNcaoFJZEGMRKpjihlwjeDNRj//lvHyMCgiazhPwPDw78MDD7vtdZfIcogIhRR1eEg+0Ru+PEy/mNeyMDAEAix//8Zhv+/fF9rb3tBhHuIVkJ1h0PcCuqgBFUyMP43Yfr9Nfal/q6vRLuISIUATm5JtIltwYIAAAAASUVORK5CYII=",
              },
              position: [-10, -30], // 左 上
            },
            symbol:
              "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAXCAYAAAALHW+jAAAAAXNSR0IArs4c6QAAAw5JREFUSEullWlPE1EUhs+5M7SARQO0nYSIBuOCkJggZauatKKgtpTg9mP0i9/4LxpFQRZXMEIXKIKERUWJe6CdthEQCp17jymItrVtqs7HOe957nuW3IuQw6eMOQ4QlwyBge5puAEiWwpmCxqHXWWMiYa4hhCjgLQL1sVw0N63mCkvLXC3u7VEj7oGBrQbZBpbqutdiAMUX1sFcGjiAF/UjRUf2IeiqeAkoGnQZpDyDRaBbK+m0UT4cc/cHyX6a/MUrayWOBwSOhxV67pfJ0K3gfPn9UoIakhIhwWjGVVenALLeCxbO4p8zaWFVHgSSNA6acPL1gfhuB5LRtvLZSFsQLgQoOALsHrWc5jTL0mpv61S0qAOib9Ziq6No9HjPE4SSqH6nrG/ASVpB235SkFRKzJ4i0afy4IceNDaPZEKNM51HEaiTgBs2Y7RQyHx66EjPa9StSaf45SQWBAVT3sDIa0HGrunEkVxGAjyImJx4n8CigBio3q0602S3uO0gSa+otntsDKZfVus75lJFJhmO24DwMUMbbgTrOq6lBhT3M5mIv4et6wKUENNvXMpwBUAMGQArgaruooSY2av6yyjzfn4ULasqqf6kkowzXZkBBLQslp1d0+SgVHXOQ44gztWAyf63/1PyUafwwExaQJ3rC42Dbz/n6EoHoeLUPKh6afVcP29T+nXBjqBqJUQOAI+EZJ2Ld3amN3ODqbxYYxbFWviZdje//mfFxsATF7n5Q0Re4pGr6OWEVZCHvcGLMl9zPWA4ufOfbKMpzlqd7YuB2WkxUws/yShiGpydCRiefwtF1g8jzNdAyLoNRlGI5b7H39fXwSo+B3VxFmNADGrfiychKu3eDpw8aMze3SGXXVAwswl7lfr++YBgbZum9SEMn9bIY8JqwAs5chHwo0JvXU3FZhYaS0CVgDSVOBDwXTqoRmfgJJnLeV5+rwTIDC4qYv6JU1/kCFWcyFehyI0CRf6N9K5z/qmwM0rknH/9xok+RiRWMDoqj9oH1rN1t/swJ3MQZsM9iEtl0H9ALYVdg6e7vuGAAAAAElFTkSuQmCC",
            symbolSize: 20, // 标记的大小
            data: data.seriesData[1],
          },
          {
            name: "背景",
            type: "bar",
            barWidth: "50%",
            data: data.seriesData[2],
            itemStyle: {
              normal: {
                color: "rgba(6, 19, 44,0.4)",
              },
            },
          },
        ],
      };
    };
    // echart图表接口api
    const initEchartFn = async () => {
      let res = await getTotalApi();
      if (res.meta.state === 200) {
        // 接口数据赋值
        // state.data.xAxis = res.data.pv_title;
        // state.data.data = res.data.pv_data;
        // 渲染图表
        let eChart = echarts.init(myChart.value);
        eChart.setOption(echartsInit(state.data));
        window.onresize = function () {
          eChart.resize();
        };
      }
    };
    // dom渲染生命周期
    onMounted(() => {
      // echarts图表渲染调用
      initEchartFn();
    });

    return {
      myChart,
      ...toRefs(state),
      echartsInit,
      initEchartFn,
    };
  },
};
</script>
<style lang="scss" scoped>
#myChart {
  width: 500px;
  height: 70%;
  background-color: #030c24;
}
</style>
