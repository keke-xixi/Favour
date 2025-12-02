<template>
	<view class="container">
	   <view class="header">
		   <text class="title">我的车辆</text>
		   <!-- <text class="subtitle">已绑定 {{ boundCount }} 辆车</text> -->
	   </view>
	   
	   <view class="list">
		   <view class="car-card" v-for="(item, index) in list" :key="item.carID" :class="{ 'active': item.status }" @tap="clickBox(item)">
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
	   
	   <!-- 新增车牌 -->
	   <uni-popup ref="popup" type="top" border-radius="10px 10px 0 0">
	   		<addCarDialog @cancel="cancel" @submit="submit" ref="addCarDialogRef"/>
	   </uni-popup>
	   
	   <!-- 绑定矿 -->
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
			list: [],  // 车辆数据
			carCheckStatus: CAR_CHECK_STATUS,
			statusColors: {
				unchecked: { primary: '#999999', light: '#f5f5f5' },    // 未审核
				rejected: { primary: '#FF6B6B', light: '#ffeaea' },     // 不通过
				approved: { primary: '#4ECDC4', light: '#e8f6f5' },     // 已通过
				unprocessed: { primary: '#FFA726', light: '#fff3e0' },  // 未选矿
				processed: { primary: '#42A5F5', light: '#e3f2fd' }      // 已选矿
			},
			options: [
				// {
				// 	text: '修改',
				// 	style: {
				// 		backgroundColor: '#007aff'
				// 	}
				// },
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
	    boundCount() {
		  return this.list.filter(item => item.status).length;
		}
	  },
	 mounted() {
	  	let info = uni.getStorageSync("userInfo");
	  	const { carList } = info;
		this.userInfo = info;
		this.getCarList();
	  },
	  methods: {
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
		// 获取车辆信息
		getCarList(){
			myCarList().then(res =>{
				this.list = res.result;
			})
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
					  cancelText: '取消', // 自定义取消按钮文字[citation:3]
					  confirmText: '确认', // 自定义确认按钮文字[citation:3]
					  confirmColor: '#FF0000', // 将确认按钮颜色设置为红色，以示警示[citation:3]
					  cancelColor: '#999999', // 设置取消按钮颜色[citation:3]
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
					// i.show = "false"
					// setTimeout(() => {
					// 	this.$refs.popup.open('top')
					// 	this.$nextTick(()=>{
					// 		this.$refs.addCarDialogRef?.edit(i);
					// 	})
					// }, 100)
					break;
				case 1:  
					
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
			uni.setStorageSync("userInfo", this.userInfo);  // 存储用户信息
			uni.setStorageSync("userList", userList);  // 存储用户信息
		},
		change(event) {
			console.log('改变事件', event);
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
	// background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
	background: #f8f8f8;
	padding: 20rpx;
	overflow-y:scroll;
}

.header {
	padding: 30rpx 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.title {
		font-size: 44rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 10rpx;
	}
	.subtitle {
		font-size: 28rpx;
		color: #666;
	}
}

.list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.car-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
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
	
	&.active {
		border-left: 8rpx solid #1aad19;
		// border-left: 8rpx solid #0a2d65;
	}
}

.car-info {
	display: flex;
	justify-content: space-between;
    align-items: center;
	.plate-number {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 8rpx;
	}
}

.add-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 40rpx 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
	border: 2rpx dashed #e0e0e0;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: all 0.3s ease;
	
	&:active {
		background: #f9f9f9;
		transform: scale(0.98);
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
</style>