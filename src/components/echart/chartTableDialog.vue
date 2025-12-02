<!-- 
   echart图弹窗组件  大量数据表格渲染 + echart图 切换
-->
<template>
    <el-dialog v-model="isShowDialog" :width="800" draggable="" :close-on-click-modal="false" >
			<template #header>
				<div style="color: #fff">
					<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>
					<span>{{ props.title }}</span>
				</div>
			</template>
            <div class="chart-container">
                <div class="chart-title">
                    <span>{{ chartTitle }}</span>
                    <el-link style="font-size: 12px" v-if="status === 'echart'" @click="changeStatus('table')">[数据表]</el-link>
                    <el-link style="font-size: 12px" v-if="status === 'table'" @click="changeStatus('echart')">[柱形图]</el-link>
                </div>
                <div ref="chart" style="width: 100%; height: 260px" v-show="status == 'echart'"></div>
                <div class="table-container" v-show="status == 'table'">
                    <el-table-v2
                        v-if="columns.length"
                        :columns="columns"
                        :data="tableData"
                        :width="700"
                        :height="260"
                        :max-height="260"
                        :header-height="40"
                        :row-height="40"
                        headerClass="headerClass"
                        class="tableV2"
                        fixed
                        :border="true">
                        <template #empty>
                            <div></div>
                        </template>
                    </el-table-v2>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="isShowDialog = false">关 闭</el-button>
                </span>
            </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick,watch,onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { cloneDeep } from 'lodash-es';

// 接受父组件参数
const props = defineProps({
    title: {
        type: String,
        default: '',  // 弹窗标题
    },
    chartTitle: {
        type: String,
        default: '设备检定数据与期间核查数据',  // 图表标题
    },
	tableData: {
		type: Array,
		default: () => [], // 表格数据
	},
	columns: {
		type: Array,
		default: () => [], // 表格列 动态绑定
	},
    xAxisData:{
		type: Array,
		default: () => [], // echart图x轴数据
	},
    data: {
		type: null,
        default: () => [], // echart图x轴数据
    }
});

// 弹窗显示
const isShowDialog = ref(false);

// 显示图表
const status = ref('echart');  // echart 或者 table
const changeStatus = (type: string) => {
	status.value = type;
};

// echarts实例
const chart = ref<HTMLElement | null>(null);
let myChart: any = null;

// 图表配置
let chartOptions:any = {
	title: {
		show: false,
	},
    legend:{
        icon: 'rect',
        show: true
    },
	grid: {
		top: 40,
		bottom: 20,
		left: 20,
		right: 20,
		containLabel: true,
	},
	tooltip: {
		trigger: 'axis',
	},
	xAxis: {
		type: 'category',
		data: [],
		axisTick: { show: false },
		axisLine: { show: true, color: '#e7e7e7' },
	},
	yAxis: {
		type: 'value',
		axisTick: { show: false },
		axisLine: {
			show: true,
			lineStyle: {
				color: '#e7e7e7', // 设置刻度线的颜色为绿色
			},
		},
		axisLabel: {
			color: '#757575', // 设置标签的颜色为蓝色
		},
	},
	series: [],
};

// 初始化 ECharts 图表
const initChart = async () => {
	if(chart.value){
		myChart = echarts.init(chart.value);
	}
	myChart && myChart.clear(); // 清空图表
	myChart && myChart.resize(); // 重置图表大小
	let _options = cloneDeep(chartOptions);
	if(props.data.length){
		_options.xAxis.data = props.xAxisData;
		_options.series = props.data.map((item: any) => {
			return {
				name: item.label,
				data: item.data,
				type: 'bar',
				itemStyle: {
					color: item.backgroundColor,
				},
				borderWidth: '30%',
				label: {
					show: true,
					position: 'inside',
				},
			}
		});
		myChart && myChart.hideLoading();
	}else{
		_options.series = [];
		_options.xAxis.data = [];
		_options.xAxis.show = false;
		_options.yAxis.show = false;
		myChart && myChart.showLoading({
			text: 'No Data',
			showSpinner: false,   
			textColor: '#9a9ca1',
			maskColor: 'rgba(255, 255, 255, 0)',
			fontSize: '20px',
		})
	}
	myChart && myChart.setOption(_options);
	// 在窗口大小变化时，重新渲染图表
	window.addEventListener('resize', () => {
		myChart && myChart.resize();
	});
};

// 打开弹窗 
const openDialog = () => {
    isShowDialog.value = true;
    nextTick(() => {
        initChart();
    });
}

// 使用 onMounted 来确保在 DOM 渲染完成后初始化图表
onMounted(async () => {
    nextTick(() => {
		initChart();
	});
});

// 销毁 eCharts 实例
onUnmounted(() => {
	myChart && myChart.dispose();
});

// 将属性或者函数暴露给父组件
defineExpose({ openDialog })
</script>

<style scoped lang="scss">
.chart-container {
	margin-top: 20px;
	width: 100%;
	height: 300px;
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
		background-color: #deecf6;
	}
}
.table-container{
	display: flex;
	justify-content: center;
	align-items: center;
	height: 260px;
	.headerClass{
		height: 30px;
		line-height: 30px;
	}
	.tableV2{
		font-size: 14px;
	}
}
</style>
