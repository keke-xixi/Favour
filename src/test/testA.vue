<template>
	<view class="container">
	   <view class="header">
		   <text class="title">我的车辆</text>
		   <view class="status-summary">
			   <text class="subtitle">车辆状态概览</text>
			   <view class="status-tags">
				   <view class="status-tag" v-for="(tag, idx) in statusTags" :key="idx" :style="{background: tag.color}">
					   <text class="tag-text">{{tag.label}}</text>
					   <text class="tag-count">{{tag.count}}</text>
				   </view>
			   </view>
		   </view>
	   </view>
	   
	   <!-- 状态筛选Tabs -->
	   <view class="status-tabs">
		   <scroll-view class="tabs-scroll" scroll-x="true" show-scrollbar="false">
			   <view class="tabs-container">
				   <view 
					   class="tab-item" 
					   :class="{'active': activeTab === 'all'}" 
					   @tap="switchTab('all')"
				   >
					   <text class="tab-text">全部车辆</text>
					   <view class="tab-count">{{list.length}}</view>
				   </view>
				   <view 
					   v-for="tab in filterTabs" 
					   :key="tab.status" 
					   class="tab-item" 
					   :class="{'active': activeTab === tab.status}" 
					   @tap="switchTab(tab.status)"
					   :style="{borderLeftColor: tab.color}"
				   >
					   <text class="tab-text">{{tab.label}}</text>
					   <view class="tab-count">{{tab.count}}</view>
				   </view>
			   </view>
		   </scroll-view>
	   </view>
	   
	   <!-- 车辆列表 -->
	   <view class="list">
		   <view v-if="filteredList.length === 0" class="empty-state">
			   <image src="/static/imgs/empty-car.png" class="empty-image"></image>
			   <text class="empty-text">暂无车辆数据</text>
		   </view>
		   
		   <view class="car-card" v-for="(item, index) in filteredList" :key="item.id" @tap="clickBox(item)">
				<uni-swipe-action-item class="item" 
					:auto-close="false" 
					:show="item.show" 
					:right-options="options" 
					@click="onClick($event, item)" 
					@change="swipeChange($event, item)">
				    <view class="card-content">
						<view class="card-left">
							   <view class="car-icon" :style="{background: getStatusColor(item).light}">
								   <image src="/static/imgs/truck.png" class="icon"></image>
								   <view class="status-dot" :style="{background: getStatusColor(item).primary}"></view>
							   </view>
							   <view class="car-info">
								   <text class="plate-number">{{ item.carNo }}</text>
								   <view class="car-details">
									   <text class="car-model">{{ item.model || '货车' }}</text>
									   <text class="car-owner">车主：{{ item.owner || '未登记' }}</text>
								   </view>
								   <text class="car-date">绑定时间：{{ item.bindDate || '2023-10-15' }}</text>
							   </view>
						</view>
						<view class="card-right">
							  <view class="status-badge" :style="getStatusStyle(item)">
								  <text class="status-text">{{ getStatusText(item) }}</text>
							  </view>
							  <u-icon name="arrow-right" color="#999" size="26"></u-icon>
						</view>
					</view>
				</uni-swipe-action-item>
		   </view>
		   
		   <!-- 添加新车按钮 -->
		   <view class="add-card" @tap="addCar">
			   <view class="add-content">
				   <u-icon name="plus-circle" color="#1aad19" size="60"></u-icon>
				   <text class="add-text">添加新车</text>
			   </view>
		   </view>
	   </view>
	   
	   <!-- 状态说明卡片 -->
	   <view class="legend-card">
		   <text class="legend-title">状态说明</text>
		   <view class="legend-items">
			   <view class="legend-item" v-for="legend in statusLegends" :key="legend.status">
				   <view class="legend-color" :style="{background: legend.color}"></view>
				   <text class="legend-text">{{legend.label}}</text>
				   <text class="legend-desc">- {{legend.desc}}</text>
			   </view>
		   </view>
	   </view>
	   
	   <!-- 新增车牌弹窗 -->
	   <uni-popup ref="popup" type="top" border-radius="10px 10px 0 0">
	   		<addCarDialog @cancel="cancel" @submit="submit" ref="addCarDialogRef"/>
	   </uni-popup>
	   
	   <!-- 绑定矿弹窗 -->
	   <uni-popup ref="popupCoal" type="top" border-radius="10px 10px 0 0">
	   		<chooseCoalDialog @cancel="cancelCoal" @submit="submitCoal" :row="editRow" ref="chooseCoalDialogRef"/>
	   </uni-popup>
	   
	</view>
</template>

<script>
	import addCarDialog from './component/addCarDialog.vue';
	import chooseCoalDialog from './component/chooseCoalDialog.vue';
	import { myCarList,bindCar,unbindCar } from '@/api/driver/index.js';
	import { CAR_CHECK_STATUS } from '@/utils/constant.js';
	export default {
	  name: 'driver',
	  components: {
		  addCarDialog,chooseCoalDialog
	  },
	  props: {},
	  data() {
	    return {
			userInfo: {},
			editRow: {}, // 当前选矿的车辆信息
			activeTab: 'all', // 当前选中的标签
			list: [],  // 车辆数据
			carCheckStatus: CAR_CHECK_STATUS,
			// 状态颜色配置（使用方案一）
			statusColors: {
				unchecked: { primary: '#999999', light: '#f5f5f5' },    // 未审核
				rejected: { primary: '#FF6B6B', light: '#ffeaea' },     // 不通过
				approved: { primary: '#4ECDC4', light: '#e8f6f5' },     // 已通过
				unprocessed: { primary: '#FFA726', light: '#fff3e0' },  // 未选矿
				processed: { primary: '#42A5F5', light: '#e3f2fd' }      // 已选矿
			},
			options: [
				{
					text: '解绑',
					style: {
						backgroundColor: '#dd524d'
					}
				},
			]
		}
	  },
	  computed: {
	    // 状态标签统计
		statusTags() {
			return [
				{ label: '未审核', color: '#999999', count: this.list.filter(item => item.verifyStatus === this.carCheckStatus.Unchecked).length },
				{ label: '未通过', color: '#FF6B6B', count: this.list.filter(item => item.verifyStatus === this.carCheckStatus.Rejected).length },
				{ label: '已通过', color: '#4ECDC4', count: this.list.filter(item => item.verifyStatus === this.carCheckStatus.Approved).length },
				{ label: '未选矿', color: '#FFA726', count: this.list.filter(item => item.verifyStatus === this.carCheckStatus.Approved && !item.mineId).length },
				{ label: '已选矿', color: '#42A5F5', count: this.list.filter(item => item.verifyStatus === this.carCheckStatus.Approved && item.mineId).length }
			]
		},
		// 筛选标签
		filterTabs() {
			return [
				{ status: 'unchecked', label: '未审核', color: '#999999', count: this.list.filter(item => item.verifyStatus === this.carCheckStatus.Unchecked).length },
				{ status: 'rejected', label: '未通过', color: '#FF6B6B', count: this.list.filter(item => item.verifyStatus === this.carCheckStatus.Rejected).length },
				{ status: 'unprocessed', label: '未选矿', color: '#FFA726', count: this.list.filter(item => item.verifyStatus === this.carCheckStatus.Approved && !item.mineId).length },
				{ status: 'processed', label: '已选矿', color: '#42A5F5', count: this.list.filter(item => item.verifyStatus === this.carCheckStatus.Approved && item.mineId).length }
			]
		},
		// 状态说明
		statusLegends() {
			return [
				{ status: 'unchecked', label: '未审核', color: '#999999', desc: '等待管理员审核' },
				{ status: 'rejected', label: '未通过', color: '#FF6B6B', desc: '审核未通过，请修改信息' },
				{ status: 'approved', label: '已通过', color: '#4ECDC4', desc: '审核通过，等待选矿' },
				{ status: 'unprocessed', label: '未选矿', color: '#FFA726', desc: '已通过审核，未选择矿山' },
				{ status: 'processed', label: '已选矿', color: '#42A5F5', desc: '已选择矿山，可正常运输' }
			]
		},
		// 筛选后的列表
		filteredList() {
			if (this.activeTab === 'all') return this.list;
			
			return this.list.filter(item => {
				switch(this.activeTab) {
					case 'unchecked':
						return item.verifyStatus === this.carCheckStatus.Unchecked;
					case 'rejected':
						return item.verifyStatus === this.carCheckStatus.Rejected;
					case 'unprocessed':
						return item.verifyStatus === this.carCheckStatus.Approved && !item.mineId;
					case 'processed':
						return item.verifyStatus === this.carCheckStatus.Approved && item.mineId;
					default:
						return true;
				}
			});
		}
	  },
	 mounted() {
	  	let info = uni.getStorageSync("userInfo");
	  	const { carList } = info;
		this.userInfo = info;
		this.getCarList();
	  },
	  methods: {
		// 获取车辆信息
		getCarList(){
			// 模拟假数据
			this.list = [
				{ id: 1, carNo: '粤A·12345', verifyStatus: 0, mineId: null, model: '重型货车', owner: '张师傅', bindDate: '2023-10-15' },
				{ id: 2, carNo: '粤B·67890', verifyStatus: 1, mineId: null, model: '中型货车', owner: '李师傅', bindDate: '2023-10-18' },
				{ id: 3, carNo: '粤C·11223', verifyStatus: 2, mineId: null, model: '轻型货车', owner: '王师傅', bindDate: '2023-10-20' },
				{ id: 4, carNo: '粤D·44556', verifyStatus: 2, mineId: '矿场A', model: '重型货车', owner: '赵师傅', bindDate: '2023-10-22' },
				{ id: 5, carNo: '粤E·77889', verifyStatus: 2, mineId: '矿场B', model: '中型货车', owner: '刘师傅', bindDate: '2023-10-25' }
			];
			
			// 实际接口调用
			// myCarList().then(res =>{
			// 	this.list = res.result;
			// })
		},
		// 切换标签
		switchTab(status) {
			this.activeTab = status;
		},
		// 获取状态文本
		getStatusText(item) {
			if (item.verifyStatus === this.carCheckStatus.Unchecked) return '未审核';
			if (item.verifyStatus === this.carCheckStatus.Rejected) return '未通过';
			if (item.verifyStatus === this.carCheckStatus.Approved) {
				return item.mineId ? '已选矿' : '未选矿';
			}
			return '未知状态';
		},
		// 获取状态颜色
		getStatusColor(item) {
			if (item.verifyStatus === this.carCheckStatus.Unchecked) return this.statusColors.unchecked;
			if (item.verifyStatus === this.carCheckStatus.Rejected) return this.statusColors.rejected;
			if (item.verifyStatus === this.carCheckStatus.Approved) {
				return item.mineId ? this.statusColors.processed : this.statusColors.unprocessed;
			}
			return this.statusColors.unchecked;
		},
		// 获取状态样式
		getStatusStyle(item) {
			const color = this.getStatusColor(item);
			return {
				background: color.light,
				color: color.primary,
				border: `1rpx solid ${color.primary}`
			};
		},
	     // 打开添加车辆弹窗
		async addCar() {
		  this.$refs.popup.open('top')
		  this.$nextTick(()=>{
		  	this.$refs.addCarDialogRef?.add();
		  })
		},
		// 取消
		cancel() {
			this.$refs.popup.close()
		},
		// 确认
		submit(info,type = 'add'){
			console.log(info,'info')
			this.$refs.popup.close()
			if(type === 'add') {
				bindCar(info).then(res =>{
					uni.showToast({
						title: "操作成功",
						icon: 'sucess'
					})
					this.getCarList();
				})
			}else if(type === 'edit') {
				this.list = this.list.map(item =>{
					if(item.carNum === info.carNum) {
						item = info
					}
					return item
				})
				this.userInfo.carList = this.list;
				this.saveInfo();
				this.getCarList()
			}
		},
		// 点击滑动栏右边按钮
		onClick(e , i) {
			const { index } = e;
			switch (index) {
				case 0:  // 删除
					uni.showModal({
					  title: '提示',
					  content: '确认解除该车辆绑定！',
					  cancelText: '取消',
					  confirmText: '确认',
					  confirmColor: '#FF0000',
					  cancelColor: '#999999',
					  success: (res) => {
						 if(res.confirm){
							 unbindCar({ carID: i.id }).then(res =>{
								 uni.showToast({
									title: "操作成功",
									icon: 'sucess'
								 })
								 this.getCarList();
							 })
						 }
					  }
					});
					break;
			}
		},
		// 保存信息
		saveInfo(){
			let userList = uni.getStorageSync("userList") || [];
			userList = userList.map(item =>{
				if(item.username === this.userInfo.username) {
					item = this.userInfo
				}
				return item
			})
			uni.setStorageSync("userInfo", this.userInfo);
			uni.setStorageSync("userList", userList);
		},
		swipeChange(e, i) {
			if(e === 'right') {
				i.show = "true"
			}
		},
		// 点击盒子
		clickBox(item){
			this.editRow = item;
			this.$refs.popupCoal.open('top')
		},
		// 取消选矿
		cancelCoal(){
			this.$refs.popupCoal.close()
		},
		submitCoal(info){
			this.$refs.popupCoal.close()
			this.list = this.list.map(item =>{
				if(item.carNum === info.carNum) {
					item = info
				}
				return item
			})
			this.userInfo.carList = this.list;
			this.saveInfo();
		},
	  }
	}
</script>

<style scoped lang="scss">
.container {
    height: 100vh;
	background: linear-gradient(180deg, #f8f9fa 0%, #f1f3f5 100%);
	padding: 20rpx;
	overflow-y: scroll;
}

.header {
	padding: 30rpx 20rpx;
	.title {
		font-size: 44rpx;
		font-weight: bold;
		color: #1a1a1a;
		display: block;
		margin-bottom: 20rpx;
	}
	.subtitle {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 20rpx;
		display: block;
	}
	.status-summary {
		background: #fff;
		border-radius: 16rpx;
		padding: 24rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	}
	.status-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
		margin-top: 16rpx;
		.status-tag {
			padding: 8rpx 20rpx;
			border-radius: 20rpx;
			display: flex;
			align-items: center;
			gap: 8rpx;
			.tag-text {
				font-size: 24rpx;
				color: white;
				font-weight: 500;
			}
			.tag-count {
				font-size: 22rpx;
				color: white;
				background: rgba(255, 255, 255, 0.3);
				padding: 2rpx 8rpx;
				border-radius: 12rpx;
			}
		}
	}
}

.status-tabs {
	background: #fff;
	border-radius: 16rpx;
	margin: 0 20rpx 24rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	.tabs-scroll {
		width: 100%;
		white-space: nowrap;
	}
	.tabs-container {
		display: inline-flex;
		align-items: center;
		gap: 16rpx;
		.tab-item {
			display: inline-flex;
			align-items: center;
			padding: 16rpx 24rpx;
			border-radius: 12rpx;
			background: #f8f9fa;
			border-left: 4rpx solid transparent;
			transition: all 0.3s ease;
			&.active {
				background: #fff;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
				.tab-text {
					color: #1a1a1a;
					font-weight: 600;
				}
				.tab-count {
					background: #1a1a1a;
					color: #fff;
				}
			}
			.tab-text {
				font-size: 28rpx;
				color: #666;
				margin-right: 12rpx;
			}
			.tab-count {
				font-size: 22rpx;
				background: #e9ecef;
				color: #666;
				padding: 4rpx 12rpx;
				border-radius: 12rpx;
				min-width: 32rpx;
				text-align: center;
			}
		}
	}
}

.list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
	margin: 0 20rpx;
}

.empty-state {
	text-align: center;
	padding: 60rpx 0;
	.empty-image {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 32rpx;
		opacity: 0.6;
	}
	.empty-text {
		font-size: 28rpx;
		color: #999;
		display: block;
	}
}

.car-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	transition: all 0.3s ease;
	.item {
		width: 100%;
		height: 100%;
		.card-content {
			height: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
	
	&:active {
		transform: scale(0.98);
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}
}

.card-left {
	display: flex;
	align-items: center;
	flex: 1;
}

.car-icon {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;
	position: relative;
	
	.icon {
		width: 50rpx;
		height: 50rpx;
	}
	
	.status-dot {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		border: 2rpx solid #fff;
	}
}

.car-info {
	flex: 1;
	.plate-number {
		font-size: 36rpx;
		font-weight: bold;
		color: #1a1a1a;
		display: block;
		margin-bottom: 8rpx;
	}
	
	.car-details {
		display: flex;
		align-items: center;
		gap: 16rpx;
		margin-bottom: 8rpx;
		
		.car-model {
			font-size: 26rpx;
			color: #666;
		}
		
		.car-owner {
			font-size: 24rpx;
			color: #888;
			background: #f8f9fa;
			padding: 4rpx 12rpx;
			border-radius: 8rpx;
		}
	}
	
	.car-date {
		font-size: 24rpx;
		color: #999;
		display: block;
	}
}

.card-right {
	display: flex;
	align-items: center;
	gap: 20rpx;
	
	.status-badge {
		padding: 8rpx 20rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 100rpx;
		
		.status-text {
			font-size: 24rpx;
			font-weight: 500;
		}
	}
}

.add-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 40rpx 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	border: 2rpx dashed #e0e0e0;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: all 0.3s ease;
	
	&:active {
		background: #f9f9f9;
		transform: scale(0.98);
		border-color: #1aad19;
	}
}

.add-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	
	.add-text {
		margin-top: 16rpx;
		font-size: 28rpx;
		color: #1aad19;
		font-weight: 500;
	}
}

.legend-card {
	background: #fff;
	border-radius: 16rpx;
	margin: 24rpx 20rpx;
	padding: 24rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	
	.legend-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #1a1a1a;
		display: block;
		margin-bottom: 20rpx;
	}
	
	.legend-items {
		display: flex;
		flex-direction: column;
		gap: 16rpx;
		
		.legend-item {
			display: flex;
			align-items: center;
			gap: 12rpx;
			
			.legend-color {
				width: 20rpx;
				height: 20rpx;
				border-radius: 50%;
				flex-shrink: 0;
			}
			
			.legend-text {
				font-size: 26rpx;
				color: #333;
				font-weight: 500;
				min-width: 100rpx;
			}
			
			.legend-desc {
				font-size: 24rpx;
				color: #666;
				flex: 1;
			}
		}
	}
}
</style>