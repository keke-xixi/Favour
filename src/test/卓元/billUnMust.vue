
<template>
  <view class="card-content">
    <view class="text-content" @tap="viewOrderDetail(item)">
        <!-- 项目标题与超时提示 -->
        <view :class="'distance' + index" style="height: 1px;background-color: transparent;"></view>
        <view class="card-header">
          <text class="project-name" :style="{ fontSize: fontSizeMedium }">{{ item.projectName }}</text>
          <text class="overtime" :style="{ fontSize: fontSizeSmall }" :class="{ 'time-expired': getTimeDisplayBool(item) }">{{ getTimeDisplay(item) }}</text>
        </view>

        <!-- 项目详情 -->
        <view class="card-info">
          <view class="info-item" :style="{ fontSize: fontSizeBase }">
            <text class="text">位置：<text class="desc-text">{{ item.spaceName }}</text></text>
          </view>
          <view class="info-item" :style="{ fontSize: fontSizeBase }">
            <text class="text">工单描述：<text class="desc-text">{{ item.description }}</text></text>
          </view>
          <view class="info-item" :style="{ fontSize: fontSizeBase }">
            <text class="text">接单人：<text class="desc-text">{{ item.processUname }}</text></text>
          </view>
        </view>

        <!-- 状态标签 -->
        <view class="status-group" :style="{ fontSize: fontSizeMini }">
          <text class="status-tag pending" :class="statusClass(item.status)" :style="{ fontSize: fontSizeSmall }">{{ item.statusDesc }}</text>
          <text class="status-tag checked" v-if="item.checkCount !== 0" :style="{ fontSize: fontSizeSmall }">已查{{ item.checkCount }}次</text>
        </view>
    </view>

    <!-- 操作按钮 -->
    <view class="actions">
       <view class="end-btn" v-if="showBtn">
            <button class="msg-tag primary" style="margin-right: 20rpx;" :style="{ fontSize: fontSizeSmall }" @click="onReport(item,1)">一键报单</button>
            <button class="pass-tag" :style="{ fontSize: fontSizeSmall, }" @click="onReport(item,2)">合格</button>
       </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useFontSizeStore } from "@/store";
import { getTimeDisplay, getTimeDisplayBool } from "@/common/time.js"
import { statusClass } from "@/common/tools.js"
import api from '../api.js'

const emit = defineEmits(['report-list'])
const prop = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },
    index: {
        type: Number,
        default: 0
    },
    showBtn: {
      type: Boolean,
      default: true
    },
    spaceNameAll: {
      type: String,
      default: ''
    }
})

const {
  fontSizeBase,
  fontSizeMini,
  fontSizeSmall,
  fontSizeMedium,
} = useFontSizeStore();

defineOptions({
	addGlobalClass: true
})

const linkId = ref('')
const spaceNameParams = ref({})
const onReport = (item, linkType) => {
  const text = linkType === 1 ? '一键报单' : '合格'

  linkId.value = item.linkId
  if (linkType === 1) {
    spaceNameParams.value = { id: item.orderId }
    setSelectSpaceName({ selectedName: prop.spaceNameAll, selectedId: item.spaceId, selectedItem: item })
    return
  }

  uni.showModal({
      title: '提示',
      content: `确定要${text}吗？`,
      success: (res) => {
        if (res.confirm) {
          api.appAddQualifiedAndCheckCount({ linkId: item.linkId, linkType }).then((res) => {
            emit('report-list', item)
            if (linkType === 2) {
              uni.showToast({ title: `${text}成功`, icon: 'success' })
            } else {
            }
          }).catch(() => {
            toastRef.value?.show({
              message: `${text}失败`,
              duration: 2000,
              type: 'error'
            });
          })
        }
      }
    })
}

const setSelectSpaceName = ({ selectedName, selectedId, selectedItem }) => {
  const { projectId, processUname, processUid, spaceName } = selectedItem
  const clean = uni.getStorageSync("clean")
  if (clean === '1') {
    uni.navigateTo({
      url: '/pages/order/taxationForm/indexForeman?processUname=' + processUname + '&processUid=' + processUid + '&spaceName=' + spaceName + '&spaceId=' + selectedId + '&projectId=' + projectId + '&linkId=' + linkId.value
    });
  } else {
    uni.navigateTo({
      url: '/pages/order/taxationForm/index?processUname=' + processUname + '&processUid=' + processUid + '&spaceName=' + spaceName + '&spaceId=' + selectedId + '&projectId=' + projectId + '&linkId=' + linkId.value
    })
  }
}

function viewOrderDetail(item) {
  const { spaceId, orderType, orderId, orderNumber } = item || {};
  uni.navigateTo({
    url:
      "/pages/orderExecution/info?spaceOrderId=" +
      spaceId +
      "&orderType=" +
      orderType +
      "&id=" +
      orderId +
      "&orderNumber=" +
      orderNumber +
      "&type=checkInfo",
  });
}
</script>

<style scoped lang="scss">
.card-content {
  position: relative;
}

.text-content {
  background: #F3F4F5;
  border-radius: 8px;
  padding: 18rpx;
  padding-bottom: 5rpx;
  margin: 0 20rpx;

  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 18px;
  color: #666666;
  line-height: 30px;
  text-align: left;
  font-style: normal;
  
  .text {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    color: #666666 ;
    line-height: 30px;
    text-align: left;
    font-style: normal;
  }
  .desc-text {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 30px;
    text-align: left;
    font-style: normal;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16rpx;
    
    .project-name {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 18px;
      color: #666666;
      line-height: 25px;
      text-align: left;
      font-style: normal;
    }
    
    .overtime {
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 18px;
      line-height: 25px;
      text-align: right;
      font-style: normal;
    }
  }
}

.status-group {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  flex-wrap: wrap;
  
  .status-tag {
    border-radius: 0;
    padding: 4px 10px;
    margin-right: 10px;
    margin-bottom: 8rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    font-style: normal;
    
    &.pending {
      background: #f3e0e0;
      border-radius: 4px;
      color: #F93525;
      width: 52px;
      height: 20px;
    }
    
    &.checked {
      color: #666666;
      background: #e4e5e6;
      border-radius: 4px;
      width: 68px;
      height: 20px;
    }
  }
}

.actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    .end-btn {
        display: flex;
        flex-wrap: wrap;
        margin: 20rpx;
        button {
          transition: all 0.2s ease;
          
          &:active {
            transform: scale(0.95);
          }
        }
    }
}

.msg-tag {
    width: 98px;
    height: 36px;
    border-radius: 20px;
    border: 1px solid #3D92FD;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 16px;
    line-height: 36px;
    text-align: center;
    font-style: normal;
    
    &:active {
      opacity: 0.8;
    }
}

.pass-tag {
    width: 68px;
    height: 36px;
    background: #3D92FD;
    border-radius: 20px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 36px;
    text-align: center;
    font-style: normal;
    
    &:active {
      opacity: 0.8;
    }
}
</style>
