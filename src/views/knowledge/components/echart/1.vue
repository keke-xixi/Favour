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
        <div class="chart-container" ref="chartContainerRef">
            <div class="chart-title" v-if="props.title">
                <span>{{ props.title }}</span>
                <el-tooltip content="保存为图片" placement="top">
                    <el-button icon="ele-Download" text type="primary" @click="handleDownload()" v-auth="'coalTemp/update'" />
                </el-tooltip>
            </div>
            <div ref="chart" style="width: 100%;margin-top: 10px;height: calc(100% - 60px)"></div>
        </div>
    </template>

    <script setup lang="ts">
    import { onMounted, ref, nextTick,watch,onUnmounted } from 'vue';
    import * as echarts from 'echarts';
    import { cloneDeep } from 'lodash-es';
    import emitter from '/@/utils/mitt'; // 引入mitt

    // 接受父组件参数
    const props = defineProps({
        loading: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: '',
        },
        chartData: {
            type: null, // 类型为对象或数组
            default: () => {}
        }
    });

    // echarts实例
    const chart = ref<HTMLElement | null>(null);
    let myChart: any = null;

    // 组件实例
    const chartContainerRef = ref<any>(null);

    // 图表配置
    let chartOptions:any = {
        title: {
            show: false,
        },
        legend:{
            show: true,
        },
        grid: {
            top: 30,
            bottom: 30,
            left: 30,
            right: 30,
            containLabel: true,
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            name: '',
            nameLocation: 'middle',  
            nameGap: 40,  
            axisTick: { show: false },
            axisLine: {
                show: true, 
                lineStyle: {
                    color: '#cfcfcf',  
                    width: 1,        
                    type: 'solid'     
                }
            },
            axisLabel: {
                show: true,
                color: '#666666' 
            },
            nameTextStyle: {
                color: '#666666' 
            }
        },
        yAxis: {
            name: '',
            type: 'value',
            axisTick: { show: true },
            axisLine: {
                show: false,
                lineStyle: {
                    width: 1,
                    color: '#e5e5e5',
                },
            },
            splitLine: {
            show: true,
            lineStyle: {
                color: '#e5e5e5',   
                width: 1        
            }
            },
            axisLabel: {
                show: true,
                color: '#000' 
            },
            nameTextStyle: { color: '#000' }
        },
        series: [{
            name: '温度',
            data: [],
            type: 'line',
            itemStyle: {
                color: '#7cc6f3',
            },
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
        }],
    };

    // 初始化 ECharts 图表
    const initChart = async () => {
        myChart = echarts.init(chart.value);
        myChart && myChart.clear(); // 清空图表
        let _options = cloneDeep(chartOptions);
        if(props.chartData){
            const { xAxis, yAxis, series,legend } = props.chartData;
            _options.legend.data = legend;
            _options.xAxis.data = xAxis;
            _options.yAxis.name = yAxis;
            _options.series = series;
            myChart && myChart.hideLoading();
        }else{
            _options.series = [];
            _options.xAxis.data = [];
            _options.xAxis.show = false;
            _options.yAxis.show = false;
            _options.xAxis.axisLine.show = false;
            _options.yAxis.axisLine.show = false;
            myChart && myChart.showLoading({
                text: 'No Data',
                showSpinner: false,   
                textColor: '#9a9ca1',
                maskColor: 'rgba(255, 255, 255, 0)',
                fontSize: '20px',
            })
        }
        myChart && myChart.setOption(_options);
    };

    // 下载
    const handleDownload = async ()=> {
        if (!myChart || !chartContainerRef.value) return;
        try {
        // 1. 获取图表图片
        const chartImageData = myChart.getDataURL({
            type: 'png',
            pixelRatio: 2,
            backgroundColor: '#fff'
        });

        // 2. 创建主Canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 设置Canvas尺寸（容器尺寸）
        canvas.width = chartContainerRef.value.offsetWidth * 2;
        canvas.height = chartContainerRef.value.offsetHeight * 2;
        
        // 3. 绘制白色背景
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 4. 绘制标题（模拟）
        ctx.font = 'bold 44px Arial'; // 2倍字体大小（因为pixelRatio=2）
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';
        ctx.fillText(props.title || '', 40, 80); // 调整位置
        
        // 5. 绘制图表
        const chartImg = new Image();
        await new Promise((resolve, reject) => {
            chartImg.onload = resolve;
            chartImg.onerror = reject;
            chartImg.src = chartImageData;
        });
        
        ctx.drawImage(
            chartImg,
            0, // x位置
            100, // y位置（留出标题空间）
            canvas.width,
            canvas.height - 100
        );

        // 6. 触发下载
        const link = document.createElement('a');
        link.download = \\\`\\\${props.title || 'chart'}.png\\\`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // 7. 清理
        setTimeout(() => URL.revokeObjectURL(link.href), 100);

        } catch (error) {
        console.error('导出失败:', error);
        alert('导出失败，请重试');
        }
    }

    watch(() => props.loading, (newVal, oldVal) => {
        if(newVal){
            myChart && myChart.clear(); // 清空图表
            myChart && myChart.showLoading({
                text: '数据加载中...',    
                effect: 'spin',           
                textStyle: {
                    fontSize: 20,
                    color: '#333'
                }
            })
        }else {
            nextTick(() => {
                initChart();
            });
        }
    },{ deep:true });

    // 使用 onMounted 来确保在 DOM 渲染完成后初始化图表
    onMounted(async () => {
        emitter.on('resize', () => {
            myChart && myChart.resize();
        })
        nextTick(() => {
            initChart();
        });
    });

    // 销毁 eCharts 实例
    onUnmounted(() => {
        emitter.off('resize');
        myChart && myChart.dispose();
    });
    </` + `script>

    <style scoped lang="scss">
    .chart-container {
        width: 100%;
        height: 100%;
        border: 1px solid #c8e6f0;
        border-radius: 5px;
        font-size: 12px;
        .chart-title {
            width: 100%;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            font-size: 22px;
            font-weight: bold;
        }
    }
    </style>
`)


   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  