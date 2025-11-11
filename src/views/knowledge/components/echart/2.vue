<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
      <template>
            <view class="content">
                <!-- 添加样式绑定确保尺寸 -->
                <div ref="chartRef" :style="{width: chartWidth, height: chartHeight}"></div>
            </view>
        </template>

        <script>
            import * as echarts from 'echarts';

            export default {
                data() {
                    return {
                        chartWidth: '100%',
                        chartHeight: '500px',
                        chartInstance: null, // 渲染echart实例
                    }
                },
                onLoad() {
                    this.initChart()

                    // 监听窗口尺寸变化
                    uni.onWindowResize(this.resizeChart)
                },
                onUnload() {
                    // 移除监听（避免内存泄漏）
                    uni.offWindowResize(this.resizeChart)
                },
                methods: {
                    // 适应大小变化
                    resizeChart(){
                        this.chartInstance && this.renderChart()
                    },
                    // 绘制echart
                    async initChart() {
                        try {
                            await this.$nextTick()
                            // const chartDom =  document.getElementById('chartCanvas');
                            const chartDom = this.$refs.chartRef;
                            if (!chartDom || !chartDom.clientWidth) {
                                console.warn(chartDom, 'DOM未渲染完成，延迟初始化');
                                setTimeout(initChart, 1000);
                                return;
                            }
                            this.chartInstance = echarts.init(chartDom);

                            this.renderChart();
                        } catch (e) {
                            
                        }
                    },
                    renderChart() {
                        const option = {
                            title: {
                                text: '销售数据'
                            },
                            tooltip: {},
                            xAxis: {
                                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                            },
                            yAxis: {},
                            series: [{
                                name: '销量',
                                type: 'bar',
                                data: [5, 20, 36, 10, 10, 20],
                            }]
                        };

                        this.chartInstance.setOption(option);
                        this.chartInstance.resize(); // 手动触发一次resize
                    }
                },

            };
        </` + `script>

        <style scoped lang="scss">
            .content {
                width: 100%;
                display: flex;
                flex-direction: column;
            }

            .chart {
                width: 100%;
                /* 高度通过JS动态设置 */
            }
        </style>
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  