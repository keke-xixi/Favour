<template>
    <!-- 指标 -->
    <div class="container" ref="containerRef" :style="{ fontSize: fontSizeBase }">
        <view class="target-top">
            <view class="target-top-title" :class="{topTitle: state.clean === '1'}" :style="{ fontSize: fontSizeBase }" @click="openTargetType">
                {{ state.targetName }}
                <view class="down"></view>
            </view>
            <view class="target-top-status" :style="{ fontSize: fontSizeMini }" v-if="state.timeoutNum" @click="handleTargetClick({ target: TARGET.out_time })">
                <text>{{ state.timeoutNum }}单超时未解决</text>
                <image src="/static/image/ic_fold.png" style="width: 16px; height: 16px;"></image>
            </view>
            <view class="target-top-status target-top-status-no" :style="{ fontSize: fontSizeMini }" v-else="state.timeoutNum">
                <text>暂无超时未解决单</text>
            </view>
        </view>

        <view class="target-content">
            <view class="target-box" v-for="(item, index) in state.targetList" :key="index"
                @click="handleTargetClick(item)">
                <view class="target-box-title" :style="{ fontSize: fontSizeMini }">{{ item.title }}</view>
                <view class="target-box-value" :style="{ fontSize: fontSizeMini }">
                    <view class="percent" :style="{ fontSize: fontSizeExtraLarge }">{{ item.percent || '-' }}</view>
                    <view class="rate" :style="{fontSize: fontSizeMini}">%{{ '（' + item.rate + '）' }}</view>
                </view>
                <view class="target-box-status" :style="{ fontSize: fontSizeMini }">
                    {{ item.target + ' (' + item.target_method + ') ' }}
                </view>
            </view>

            <view class="target-box"
                style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
                <view class="text" :style="{ fontSize: fontSizeMini }">
                    更多指标
                </view>
                <view class="text" :style="{ fontSize: fontSizeMini }">
                    敬请期待
                </view>
            </view>
        </view>
    </div>

    <uni-popup ref="popup" type="bottom" background-color="#fff" border-radius="40rpx 40rpx 0 0">
		<view class="popup-content">
			<view class="title" :style="{ fontSize: fontSizeExtraLarge }">
				切换指标
			</view>
			<view class="list">
				<view v-for="item in targets" :key="item.id" class="name-item" :style="{ fontSize: fontSizeLarge }" :class="{ select: targetType === item.id }" @click="selectType(item)">{{ item.title }}</view>
			</view>
		</view>
	</uni-popup>

    <TargetPopup ref="targetPopupRef" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import { useFontSizeStore } from "@/store";
import { getElementRect, getScreenInfo } from '@/common/getAttribute.js';
import { ROLE_TARGET_CONFIG, TARGET_NAME, TARGET_STATUS, TARGET_STATUS_METHOD, TARGET } from '@/common/constant';
import TargetPopup from './component/target/index.vue';
import api from './api';

const {
    fontMini,
    fontSizeBase,
    fontSizeSmall,
    fontSizeScale,
    fontSizeMini,
    fontSizeMedium,
    fontSizeExtraLarge,
    fontSizeLarge
} = useFontSizeStore()

const containerRef = ref(null);
const targetPopupRef = ref(null);
const platform = ref('');
const safeAreaInsetsTop = ref(0)

const targets = ref([
    { title: '我的指标', id: 'person_target' },
    { title: '团队指标', id: 'team_target' }
])
const targetType = ref('person_target')

// 参数
const state = reactive({
    clean: '',  // 角色
    targetKey: '',  
    targetName: '',  
    timeoutNum: 0,  // 超时未解决单数量
    userId: '',  // 用户id
    todayDate: '',  // 今天日期
    targetList: [],
    roleForm: {
        value: "",  // 依次对应 角色 "1": 保洁领班 "2": 保洁员 "3": 保洁主管 "4": 环境经理  "5": 项目经理
        person_target: [],  
        team_target: [],
        project_target: [],
        user_target: 'person_target', // person_target 个人指标 team_target 团队指标 project_target 项目指标
    },
    config: {
        
    }
})

// 格式化值，0 显示为 "0"
const formatValue = (value) => {
    return value || 0;
};
const formatValue1 = (value) => {
    return value === 0 ? "0" : (value || "-");
};

//  根据clean 参数获取 targetKey（对应角色权限）
const getPermission = async () => {
    api.getMetricOpertionControlMenu({ clean: state.clean }).then(res => {
        const { overtimeUnsolvedOrders,personTarget } = res;
    })
}

// 根据targetKey 获取 targetName 和 targetList
const getTargetInfo = async () => {
    return new Promise((resolve, reject) => {
        if (state.targetKey) {
            state.roleForm = ROLE_TARGET_CONFIG[state.targetKey];
            
            if (state.clean === '1') state.roleForm.user_target = targetType.value
            state.targetName = TARGET_NAME[state.roleForm.user_target];

            state.targetList = state.roleForm[state.roleForm.user_target];

            
            const params = {
                userId: state.userId,
                statsDate: state.todayDate,
                metricsType: "",
                periodType: ""
            }

            switch(state.targetName) {
                case '我的指标':
                    api.getMyWorkOrderStatsInfo(params).then(res => {
                        resolve(res)
                    })
                    break;
                case '团队指标':
                    api.getTeamWorkOrderStatsInfo(params).then(res => {
                         resolve(res)
                    })
                    break;
                case '项目指标':
                    api.getTeamWorkOrderStatsInfo(params).then(res => {
                         resolve(res)
                    })
                    break;
            }
        }else {
            reject(new Error('targetKey 为空'))
        }
    })
}

// 获取一些配置信息
const getConfig = () => {
    const systemInfo = uni.getSystemInfoSync()
    platform.value = systemInfo.platform
    // 获取安全区域顶部距离，针对不同平台进行适配
    if (systemInfo.platform === 'ios') {
        // iOS设备使用安全区域
        safeAreaInsetsTop.value = systemInfo.safeAreaInsets?.top || systemInfo.statusBarHeight || 0
    } else {
        // Android设备直接使用状态栏高度
        safeAreaInsetsTop.value = systemInfo.statusBarHeight || 0
    }
    state.todayDate = getTodayDate()

    const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
    state.userId = userInfo?.id;
    state.clean = userInfo?.loginInfo?.clean;
}

// 获取今日日期
const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 获取本周一日期
const getThisWeekOneDate = () => {
    const now = new Date();
    const day = now.getDay(); // 0 ~ 6
    const monday = new Date(now);
    if (day === 0) {
        monday.setDate(now.getDate() - 6); // 周日 → 周一为6天前
    } else {
        monday.setDate(now.getDate() - (day - 1)); // 周一~周六 → 减去 (day - 1) 天
    }
    return monday?.toISOString().split('T')[0];
}

// 指标点击事件
const handleTargetClick = (item) => {
    let url = `/pages/orderSearch/index?`;
    const todayISO = new Date().toISOString().split('T')[0];
    switch(item.target) {
        case TARGET.finish: // 完成率
            url += `&status=2&timeRangeComplete=today&completeStartTime=${todayISO}&completeEndTime=${todayISO}`
            break;
        case TARGET.on_time: // 按时完成率
            url += `&status=4&timeRangeComplete=today&isTimeout=${0}&completeStartTime=${todayISO}&completeEndTime=${todayISO}`
            break;
        case TARGET.rework: // 返工率
            url += `&isRework=${0}&completeStartTime=${getThisWeekOneDate()}&completeEndTime=${todayISO}`
            break;
        case TARGET.people_ratio: // 人数占比 (免操作)  个人指标或者弹窗情况都不允许跳转
            url += `&disableSkip=${true}`
            break;
        case TARGET.out_time: // 超时
            url += `&status=2&isTimeout=${0}`
            break;
        default:  // 有添加其他指标 可以在后面补充
            break;
    }

    // 跳转  我的指标
    if (state.roleForm.user_target === 'person_target') {  // 我的指标 直接跳转
        url += `&targetName=我的工单`
        !url.includes("disableSkip") && uni.redirectTo({ url });
        return
    }
    // 跳转 团队指标
    if(state.roleForm.user_target === 'team_target') {  // 团队指标 直接跳转
        url += `&targetName=团队工单`
    }
    // 跳转 项目指标
    if(state.roleForm.user_target === 'project_target') {  // 项目指标 直接跳转
        url += `&targetName=团队工单`
    }
    // 超时跳转 直接跳转
    if (item.target === TARGET.out_time) {  // 超时 直接跳转
        uni.redirectTo({ url });
        return
    }

    // 打开弹窗
    if (targetPopupRef.value) {
        const params = { 
            userId: state.userId,
            statsDate: state.todayDate,
            metricsType: TARGET_STATUS[item.target],
            periodType: TARGET_STATUS_METHOD[item.target_method],
        }
        targetPopupRef.value.openPopup(item, params, url);
    }

    // 不同角色跳转前处理 （后续需要此需求再用）
    // switch(state.roleForm.value) {  
    //     case ROLE_TARGET_CONFIG.clean_leader.value:{  // "1"
    //        break;
    //     }
    //     case ROLE_TARGET_CONFIG.cleaner.value:{  // "2"
    //         break;
    //     }
    //     case ROLE_TARGET_CONFIG.clean_manager.value:{  // "3"
    //         break;
    //     }
    //     case ROLE_TARGET_CONFIG.environment_manager.value:{  // "4"
    //         break;
    //     }
    //     case ROLE_TARGET_CONFIG.project_manager.value:{  // "5"
    //         break;
    //     }
    // }
}

const popup = ref(null)
const openTargetType = () => {
    popup.value.open()
}
const selectType = (item) => {
    targetType.value = item.id
    uni.setStorageSync('targetType', item.id)
    popup.value.close()
    getPermission()
}

onMounted(() => {
    targetType.value = uni.getStorageSync('targetType') || 'person_target'
    getConfig()
    getPermission()
    
})

onUnmounted(() => {

})

//将属性或者函数暴露给父组件
defineExpose({

});
</script>

<style lang="scss" scoped>
@mixin flex {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
}
.container {
    // width: 100%;
    height: 262rpx;
    background-color: #2c87fa;
    border-radius: 16rpx;
    border: 1px solid #2c87fa;
    margin: 24rpx;
    box-sizing: border-box;
    padding: 16rpx 20rpx;

    .target-top {
        height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #ffffff;
        // margin: 5px 10px 0 10px;

        .target-top-title {
            height: 30px;
            line-height: 30px;
            position: relative;
            cursor: pointer;
        }
        .topTitle::after {
            content: '';
            position: absolute;
            top: 36%;
            right: -24px;
            transform: translate(50% 50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid #fff;
        }

        .target-top-status {
            background-color: #FE513D;
            height: 52rpx;
            line-height: 52rpx;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 0 12.5rpx;
            font-weight: 400;
            border-radius: 26rpx;
            border: 1rpx solid rgba(255,255,255,0.3);
        }
        .target-top-status-no {
            background-color: rgba(255,255,255,0.15);
        }
    }

    .target-content {
        height: 60px;
        background-color: #2c87fa;
        display: flex;
        flex-wrap: nowrap;
        gap: 20rpx;
        margin-top: 14rpx;
        // margin: 5px 10px 5px 10px;
        // max-width: 300%;
        overflow-x: auto;    /* X轴滚动 */
        overflow-y: visible; /* Y轴可见，不隐藏也不滚动 */
        height: auto;        /* 或者不设置height，让它自适应 */
        min-height: 0;       /* 在某些flex布局中可能需要这个 */

        &::-webkit-scrollbar {
            display: none;
        }

        .target-box {
            height: 156rpx;
            // min-height: 75px;
            width: 256rpx;
            // min-width: 29%;
            border-radius: 5px;
            background-color: #ffffff;
            padding: 16rpx 0 16rpx 10rpx;
            flex-shrink: 0;
            box-sizing: border-box;

            .target-box-title {
                line-height: 36rpx;
                font-weight: 400;
                color: #666666;
            }

            .target-box-value {
                height: 30px;
                // line-height: 30px;
                display: flex;
                align-items: end;
                gap: 4px;

                .percent {
                    display: flex;
                    align-items: flex-end;
                    font-weight: 800;
                    height: 100%;
                }

                .rate {
                    display: flex;
                    align-items: flex-end;
                    height: 100%;
                }
            }

            .target-box-status {
                height: 20px;
                line-height: 20px;
                color: #333333;
                margin-top: 1px;
            }

            .text {
                color: #666666;
                line-height: 20px;
                font-family: 400;
            }
        }
    }
}
.popup-content {
	background-color: #fff;
	border-radius: 40rpx 40rpx 0 0;
	
	.title {
		@include flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 120rpx;
		border-bottom: 2rpx solid #eeeeee;
		// font-size: 32rpx;
		position: relative;
		
		.info {
			width: 140rpx;
			height: 60rpx;
			border: 2rpx solid #BBBBBB;
			font-family: PingFangSC, PingFang SC;
			font-weight: 500;
			// font-size: 32rpx;
			color: #666666;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 30rpx;
			position: absolute;
			left: 30rpx;
		}
	}
	
	.list {
		overflow-y: scroll;
		padding: 20rpx 30rpx;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		
		.name-item {
			height: 116rpx;
			background: #F3F4F5;
			border-radius: 16rpx;
			font-family: PingFangSC, PingFang SC;
			font-weight: 500;
			// font-size: 36rpx;
			color: #333333;
			line-height: 50rpx;
			font-style: normal;
			display: flex;
			align-items: center;
            justify-content: center;
			padding: 0 30rpx;
			flex-shrink: 0;
		}
		.name-item.select {
			border: 2rpx solid #3D92FD;
		}
	}
}
</style>