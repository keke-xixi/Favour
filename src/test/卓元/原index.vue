<template>
    <view class="container safe-page" :style="{ fontSize: fontSizeBase }" ref="containerRef">
        <!-- 头部卡片 -->
        <view class="container-top" ref="containerTopRef">
            <!-- 顶部搜索区 -->
            <view class="search-bar">
                <view class="search-input">
                    <input v-model="searchKey" placeholder="请输入空间信息/人员进行搜索" placeholder-class="input-placeholder" :style="{ fontSize: fontSizeSmall }"
                        @input="searchKeyChange"  @confirm="search" />
                    <image src="/static/image/search.png" style="width: 20px; height: 20px;" @tap="search"></image>
                </view>
            </view>

            <!-- 功能卡片区 -->
            <view class="function-cards">
                <view class="card-box card-required" @tap="goToRequiredTask">
                    <view class="card-icon">
                        <image src="/static/image/bcd.png"></image>
                    </view>
                    <view class="card-title" :style="{ fontSize: fontSizeMedium }">必查单</view>
                    <view class="card-desc" :style="{ fontSize: fontSizeMini  }">共{{ state.mustCheckNum }}单，已查{{ state.checkedNum }}单</view>
                </view>
                <view class="card-box card-optional" @tap="goToOptionalTask">
                    <view class="card-icon">
                        <image src="/static/image/kcd.png"></image>
                    </view>
                    <view class="card-title" :style="{ fontSize: fontSizeMedium }">可查单</view>
                    <view class="card-desc" :style="{ fontSize: fontSizeMini }">共{{ state.canCheckNum }}单</view>
                </view>
                <view class="card-box card-scan" @tap="scanCode">
                    <view class="card-icon">
                        <image src="/static/image/smdw.png"></image>
                    </view>
                    <view class="card-title" :style="{ fontSize: fontSizeMedium }">扫码定位</view>
                    <view class="card-desc" :style="{ fontSize: fontSizeMini }">快速定位</view>
                </view>
            </view>
        </view>

        <!-- 工单内容 -->
        <custom-scroll 
            ref="scrollRef" 
            :height="containerHeight + 'px'"
            :animation-duration="animationDuration"
            @scroll="onScroll"
            @scroll-to="onScrollTo"
          >
                <!-- 工单信息 -->
                <view class="InfosPageRef">
                  <InfosPage :id="infoData.id" @getInfoData="getInfoData" />
                </view>

                <!-- 操作指引 -->
                <view class="GuidePageRef">
                  <GuidePage/>
                </view>

                <!-- 必查单 -->
                 <view class="BillMustRef" id="BillMustRef">
                    <BillMust :showBtn="!disabledBtn" :mustList="state.mustList" :rate="state.checkedNum + '/' + state.mustCheckNum" :isExpand="isExpandMust" @updateExpand="updateExpand" @report-list="refreshData" ref="BillMustRef"/>
                </view>

                <!-- 可查单 -->
                <view class="BillUnMustRef" id="BillUnMustRef">
                    <BillUnMust :showBtn="!disabledBtn" :unMustList="state.unMustList" :isExpand="isExpandUnMust" @updateExpandUnMust="updateExpandUnMust" @report-list="refreshData" ref="BillUnMustRef"/>
                </view>
                
                <!-- 执行计划扫描码 -->
                <ExecutionPlanScanCode v-if="scanCodeSpaceId" :disabled="disabledBtn" ref="execution" :workOrderSpace="workOrderSpace"
                :spaceName="infoData.spaceName" :orderNumber="infoData.orderNumber" :infoData="infoData" :id="infoData.id" :spaceId="spaceIds"
                :isComplete="infoData?.isComplete" @getPhoneStatus="getPhoneStatus" @changeItem="changeItem" />

                <!-- sop执行计划 -->
                <ExecutionPlan ref="execution" v-if="workOrderSpace.length > 0 && !spaceIds" :disabled="!(!infoData?.type && status !== '1')"
                :workOrderSpace="workOrderSpace" :spaceName="infoData.spaceName" :orderNumber="infoData.orderNumber" :infoData="infoData"
                :scrollToptemp="scrollToptemp" @getPhoneStatus="getPhoneStatus" />

                <!-- 详细信息 -->
                <DetailsPage :id="infoData.id" :orderNumber="infoData.orderNumber" />

                <!-- 底部固定按钮 -->
                <BaseButtoms v-if="buttonNames.length" :buttonNames="buttonNames" :infoData="infoData" @buttonClick="buttonClick"></BaseButtoms>
        </custom-scroll>
         
        <sz-toast ref="toastRef"></sz-toast>

        <EmptyDialog ref="emptyDialogRef" ></EmptyDialog>
    </view>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, computed } from "vue";
import { useFontSizeStore } from "@/store";
import api from './api';
import { onLoad, onShow, onPageScroll } from "@dcloudio/uni-app";

// 组件
import DetailsPage from "./component/details.vue";
import InfosPage from "./component/info.vue";
import GuidePage from "./component/guide.vue";
import BaseButtoms from "./component/baseButtoms.vue";
import BillMust from "./component/billMust.vue";
import BillUnMust from "./component/billUnMust.vue";
import CheckListCom from './component/checklist/index.vue';
import CustomScroll from './component/customScroll.vue';
import EmptyDialog from '@/components/empty-dialog';



import globalApi from '@/api/api.js';
import ExecutionPlanScanCode from './component/executionPlan/indexScanCode.vue'
import ExecutionPlan from './component/executionPlan/index.vue'
import { validateRequiredFields, isOrderFormCompletedItem, findWorkOrderSopDetailsPosition, initExecutionPlanFormValue, isEqual } from './utils.js'
import { useGoBack } from '@/hooks/useGoBack.js';
import { getElementRect,getScreenInfo } from '@/common/getAttribute.js';

const { getPhoneStatus, beforeleave, isShow } = useGoBack(gobackSave);

const {
    fontSizeBase,
    fontSizeSmall,
    fontSizeScale,
    fontSizeMini,
    fontSizeMedium
} = useFontSizeStore()

const searchKey = ref(""); // 搜索关键字

// 工单信息数据
const infoData = ref({  
    id: "",
    orderNumber: "",
    orderType: "",
    spaceOrderId: "",
    type: "",
}); 

// 巡检单数据
const state = reactive({
    mustList: [],
    unMustList: [],
    canCheckNum: 0,
    checkedNum: 0,
    mustCheckNum: 0,
    totalNum: 0,
    spaceId: "",
    spaceName: "",
})

// 实例
const scrollRef = ref(null)
const containerRef = ref(null)
const containerTopRef = ref(null)
const emptyDialogRef = ref(null)
const checkListref = ref(null)
const BillMustRef = ref(null)
const BillUnMustRef = ref(null)

const currentScrollY = ref(0)
const currentIndex = ref(0)
const animationDuration = ref(300)
const isExpandMust = ref(false)
const isExpandUnMust = ref(false)

// 样式计算
const scrollTop = ref(0);  // 滚动距离
const scrollToptemp = ref(0);
const execution = ref(null);
const containerH = ref(0)
const containerHeight = ref(500)

// 响应式数据
const status = ref('1')
const orderTypes = ref('1')
const scanCodeSpaceId = ref('')
const spaceIds = ref('')
const buttonNames = ref([])
const workOrderSpace = ref([])
const disabledBtn = ref(false)

// 添加生命周期钩子
onShow(() => {
  let currentPage = getCurrentPages()[getCurrentPages().length - 1]
  if (currentPage.route === 'pages/yourCurrentPagePath/yourCurrentPage') {
    if (infoData.value.id) {
      getWorkOrderDetails(infoData.value.id)
    }
  }
})

// 页面加载时执行
onLoad((options) => {
    const pages = getCurrentPages()
    if (pages.length <= 1) {
        isShow.value = false;
    }

   const { id, orderNumber, orderType, spaceOrderId, type, spaceId, team, scanCode } = options;
   infoData.value = { ...infoData.value, id, orderNumber, orderType, spaceOrderId, type, spaceId, team, scanCode };
   spaceIds.value = spaceId;
   search(); // 巡检单
   if (id) {
    getWorkOrderDetails(id)
    getWorkOrderSopDetails('', orderType, id)
  }

  nextTick(() => {
    const screeInfo = getScreenInfo()
    getElementRect('.container-top').then(rectTop => {
      containerHeight.value = screeInfo.windowHeight - rectTop.height - 10;
    })
  })
});

onPageScroll((e) => {
  scrollToptemp.value = e.scrollTop
})

const updateExpand = (val) => {
  isExpandMust.value = val
}

const updateExpandUnMust = (val) => {
  isExpandUnMust.value = val
}

// 滚动事件
const onScroll = (e) => {
  currentScrollY.value = Math.round(e.scrollTop)
  currentIndex.value = Math.floor(e.scrollTop / 80) + 1
}

// 滚动完成事件
const onScrollTo = (data) => {
  console.log('滚动完成:', data)
}

// 滚动到指定位置
const scrollToPosition = (y) => {
  if (scrollRef.value) {
      scrollRef.value.scrollTo({  y: y, animated: true })
      currentIndex.value = Math.floor(y / 80) + 1
  }
}

// 初始化加载的方法
const getInfoData = (data) => {
    infoData.value = { ...infoData.value, ...data };
    status.value = infoData.value.status || '1';
    orderTypes.value = infoData.value.orderType || '1';
    buttonNames.value = []
    globalApi.getButton({ instanceId: infoData.value.instanceId, isFreeOperation: infoData.value.isFreeOperation }).then(res => {
      if (infoData.value.status === '2' && !infoData.value.isFreeOperation) {
        if (res) {
          buttonNames.value = res?.map(item => {
            return item === '去完成' ? '完成' : item
          })
          buttonNames.value.unshift('保存')
        }
      } else {
        buttonNames.value = res || []
      }

      if (infoData.value.orderExecute === '3') buttonNames.value = buttonNames.value.filter(e => e !== '转单')

      disabledBtn.value = !(buttonNames.value.includes('完成'))
    })
}

// 跳转到必查单位置
const goToRequiredTask = async () => {
   isExpandMust.value = true;
   const infoRect = await getElementRect('.InfosPageRef');
   const guideRect = await getElementRect('.GuidePageRef');
   scrollToPosition(infoRect.height + guideRect.height + 10)
};

// 跳转到可查单位置
const goToOptionalTask = async () => {
    isExpandUnMust.value = true;
    const infoRect = await getElementRect('.InfosPageRef');
    const guideRect = await getElementRect('.GuidePageRef');
    const rectBill = await getElementRect('.BillMustRef');
    const len = rectBill.height + infoRect.height + guideRect.height + 20;
    scrollToPosition(len);
};

// 刷新数据
const refreshData = () => {
    search()
}
 
// 搜索关键字变化时触发
const searchKeyChange = (e) => {
    const keyword = e.detail.value;
    searchKey.value = keyword;
};

// 查询巡检单信息
const search = () => {
    const keyword = searchKey.value;
    const orderId = infoData.value.id;
    api.getWorkOrderInfo({ keyword, orderId }).then((res) => {
        const result = res || {};
        const { mustList = [], unMustList = [], canCheckNum, checkedNum, mustCheckNum, totalNum, spaceId, spaceName } = result;
        state.mustList = mustList || [];
        state.unMustList = unMustList || [];
        state.canCheckNum = canCheckNum || 0;
        state.checkedNum = checkedNum || 0;
        state.mustCheckNum = mustCheckNum || 0;
    })
}

// 获取工单详情
const checkList = ref([])
function getWorkOrderDetails(id) {
  api.checkOrderAppInfo({
    orderId: id
  }).then(res => {
    checkList.value = res || []

    let position = 0
    let foundIncompleteItem = false

    for (let i = 0; i < checkList.value.length; i++) {
      if (foundIncompleteItem) break  // 找到未完成项后跳出外层循环

      const space = checkList.value[i]
      if (space.mustList && space.mustList.length > 0) {
        const mustList = space.mustList

        for (let j = 0; j < mustList.length; j++) {  // 使用不同的变量 j
          if (mustList[j].checkCount === 0) {
            foundIncompleteItem = true  // 标记已找到未完成项

            if (!spaceIds.value) {
              setTimeout(async () => {
                scrollTop.value = await checkListref.value?.scrollToElement(mustList[j], scrollToptemp.value, position);
                uni.pageScrollTo({
                  scrollTop: scrollTop.value, // 目标滚动位置的距离
                  duration: 300, // 滚动动画的时长
                });
              }, 2000)
            }
            break  // 跳出内层循环
          }
        }
      }
      if (!foundIncompleteItem) {
        position++  // 只有在没找到未完成项时才增加position
      }
    }
  })
}

// 扫码定位功能
const scanCode = async () => {
    uni.scanCode({
      success: async (res) => {
        if (res.result.indexOf('orderSpaceId') === -1) {
          toastRef.value.show({
            message: '请扫描正确的二维码',
            duration: 2000,
            type: 'warning'
          })
          return
        }
        let result = res.result.split('orderSpaceId=')[1]

        if(result) {
          const infoRect = await getElementRect('.InfosPageRef');
          const guideRect = await getElementRect('.GuidePageRef');
          const rectBill = await getElementRect('.BillMustRef');
          // const rectBillUn = await getElementRect('.BillUnMustRef');
          const indexMust = state.mustList.findIndex(item => item.spaceId === result);
          const indexUnMust = state.unMustList.findIndex(item => item.spaceId === result);
          if (indexMust !== -1) {
              isExpandMust.value = true;
               setTimeout(async () => {
                  const len = guideRect.height + infoRect.height;
                  const moveDistance = await BillMustRef.value?.getCardHeight(indexMust);
                  console.log('moveDistance',indexMust,moveDistance)
                  // scrollToPosition(len + moveDistance)
                  scrollRef.value?.setTargetId('mustId' + indexMust)
                },500)
              return
          }
          if (indexUnMust !== -1) {
              isExpandUnMust.value = true;
              nextTick(async () => {
                    const len = rectBill.height + guideRect.height + infoRect.height;
                    const moveDistance = await BillUnMustRef.value?.getCardHeight(indexUnMust);
                    console.log('moveDistance',indexUnMust,moveDistance)
                    // scrollToPosition(len + moveDistance)
                    scrollRef.value?.setTargetId('unMustId' + indexUnMust)
                })
              return
          }

          // 未找到匹配项，提示用户
          emptyDialogRef.value?.show()
        }else {
            toastRef.value.show({
              message: `二维码id未拿到`,
              duration: 2000,
              type: 'error'
            });
        }
      },
      fail: (err) => {
        console.log('扫码失败', err);
        // 处理扫码失败情况
        if (err.errMsg !== 'scanCode:fail cancel') {
          toastRef.value.show({
              message: `扫码失败，请重试`,
              duration: 2000,
              type: 'error'
            });
        }
      }
  });
};

function buttonClick(buttonName) {
  if (buttonName === '转单') {
    refresh()
  }

  if (buttonName === '完成') {
    handleComplete()
  }

  if (buttonName === '保存') {
    handleSave()
  }

  if (buttonName === '接单') {
    handleResponse()
  }
}

const onReport = () => {
  getWorkOrderDetails(infoData.value.id)
}

const getWorkOrderSopDetails = async (spaceOrderId, orderType, id) => {
  try {
    const res = await api.getWorkOrderDetails({
      spaceOrderId,
      orderType,
      id
    });
    workOrderSpace.value = res?.workOrderSpace || []

    if (spaceIds.value) {
      return
    }

    for (let i = 0; i < workOrderSpace.value.length; i++) {
      const space = workOrderSpace.value[i]
      if (space.workOrderSopMiddle) {
        // 处理workOrderSopMiddle为数组的情况
        const orderMiddles = Array.isArray(space.workOrderSopMiddle)
          ? space.workOrderSopMiddle
          : [space.workOrderSopMiddle];

        for (let i = 0; i < orderMiddles.length; i++) {
          const orderMiddle = orderMiddles[i];
          const orderItem = isOrderFormCompletedItem(orderMiddle)
          if (orderItem) {
            setTimeout(async () => {
              const position = findWorkOrderSopDetailsPosition(workOrderSpace.value, orderItem.id)

              // scrollTop.value = await execution.value.scrollToElement(orderItem, scrollToptemp.value, position);
              uni.pageScrollTo({
                scrollTop: scrollTop.value - 60, // 目标滚动位置的距离
                duration: 300, // 滚动动画的时长
              });
            }, 2000)
            return
          }
        }
      }
    }
  } catch (error) {
    console.log(error)
  } finally {
    if (infoData.value.scanCode === 'scanCode') {  // scanCode 扫码进入
        scanCodeSpaceId.value = infoData.value.spaceId
    }else {
        scanCodeSpaceId.value = ''
    }
  }
}

const changeItem = async (detail, i) => {
  scrollTop.value = await execution.value?.scrollToElement(detail, scrollToptemp.value, i);
  uni.pageScrollTo({
    scrollTop: scrollTop.value, // 目标滚动位置的距离
    duration: 300, // 滚动动画的时长
  });
}

const toastRef = ref(null)
const handleSave = async (type = 'save') => {
  const workOrderSopMiddleList = execution.value?.save()
  try {
    const res = await api.workUpdate({
      ...workOrderSopMiddleList
    });
    if (res && type === 'save') {
      toastRef.value.show({
        message: '保存成功',
        duration: 2000,
        type: 'success'
      });
    }
  } catch (error) {
    console.log(error)
  }
}

const handleComplete = async () => {
  // 免操作的不验证
  if (!infoData.value.isFreeOperation) {
    for (let i = 0; i < checkList.value.length; i++) {
      if (checkList.value[i].checkedNum !== checkList.value[i].mustCheckNum) {
        toastRef.value.show({
          message: '请完成必查项',
          duration: 2000,
          type: 'warning'
        })

        return
      }
    }
  }

  let isSpace = true
  if (workOrderSpace.value.length > 0) {
    await handleSave('complete')
    await getWorkOrderSopDetails('', orderTypes.value, infoData.value.id)
    try {
      // 获取表单数据和文件ID信息
      const workOrderData = execution.value?.save() || {};
      isSpace = await validateRequiredFields(workOrderSpace.value, workOrderData)
    } catch ({ detail, type }) {
      if (type === 'image') {
        toastRef.value.show({
          message: `${detail.title || ""}的图片未全部上传完成`,
          duration: 2000,
          type: "warning",
        });
      } else {
        toastRef.value.show({
          message: `${detail.title || ""}为必填项`,
          duration: 2000,
          type: "warning",
        });
      }
      return
    }
  }

  // 验证通过，提交工单
  const { orderNumber, id, workCategoryName, projectId, instanceId, processUid } = infoData.value
  globalApi.workOrderHandle({
    "orderNumber": orderNumber || "", //工单编号
    "id": id || "", //工单ID
    "status": "4", // 工单状态,2 执行中 3待反馈 4 已完成
    "workCategoryName": workCategoryName || "", //服务类型
    "projectId": projectId || "", // 项目ID
    "instanceId": instanceId || "", //流程id
    "processUid": processUid || "" // 流程实例id
  }).then(res => {
    if (res) {
      toastRef.value.show({
        message: '操作成功',
        duration: 2000,
        type: 'success'
      })
      isShow.value = false;
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }, 2000)
    } else {
      toastRef.value.show({
        message: '操作失败',
        duration: 2000,
        type: 'error'
      })
    }
  })
}

const inforef = ref(null)
const handleResponse = () => {
  const { spaceOrderId, orderType, id, orderNumber, workCategoryName, projectId, instanceId, processUid } = infoData.value || {}

  globalApi.workOrderHandle({
    "orderNumber": orderNumber || "", //工单编号
    "id": id || "", //工单ID
    "status": "2", // 工单状态,2 执行中 3完成
    "workCategoryName": workCategoryName || "", //服务类型
    "projectId": projectId || "", // 项目ID
    "instanceId": instanceId || "", //流程id
    "processUid": processUid || "" // 流程实例id
  }).then(res => {
    if (res) {
      toastRef.value.show({
        message: '操作成功',
        duration: 2000,
        type: 'success'
      })
      setTimeout(() => {
        inforef.value.getInfo()
      }, 2000)
    } else {
      toastRef.value.show({
        message: '操作失败',
        duration: 2000,
        type: 'error'
      })
    }
  })
}

const refresh = () => {
  isShow.value = false;
  setTimeout(() => {
    uni.switchTab({
      url: '/pages/index/index'
    })
  }, 100)
}

function gobackSave() {
  if (status.value !== '2') {
    return
  }
  if (workOrderSpace.value.length > 0) {
    handleSave('goback')
  }
}

</script>

<style lang="scss" scoped>
.container {
    max-height: 100%;
    overflow: hidden;
    padding-bottom: env(safe-area-inset-bottom);
}

// 头部
.container-top {
    background-color: #fff;
    position: relative;
    height: 210px;

    // 搜索栏样式
    .search-bar {
        position: absolute;
        top: 10px;
        left: 12rpx;
        width: calc(100% - 24rpx);
        height: 40px;

        .search-input {
            display: flex;
            align-items: center;
            padding: 12rpx 16rpx;
            border-radius: 8px;
            border: 1px solid #DADADA;
            // box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);


            .input-placeholder {
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                font-size: 16px;
                color: #999999;
                font-style: normal;
            }

            input {
                margin-right: 12rpx;
                font-size: 28rpx;
                flex: 1;
                border: none;
                outline: none;
            }
        }
    }

    // 功能卡片样式
    .function-cards {
        position: absolute;
        top: 40px;
        left: 0;
        width: 100%;
        height: 175px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .card-box {
            width: 33.3%;
            text-align: center;
            cursor: pointer;

            &.card-required {
                
            }

            &.card-optional {
             
            }

            &.card-scan {
             
            }

            .card-icon {
                image {
                    width: 50px;
                    height: 50px;
                }
            }

            .card-title {
                font-weight: 500;
                display: flex;
                justify-content: center;
                border-bottom: none;
                margin-bottom: 0;
                margin-top: 0;
                color: #333333;
            }

            .card-desc {
                word-wrap: break-word;  /* 旧版兼容 */
                overflow-wrap: break-word; /* 新版标准 */
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                font-size: 13px;
                color: #7C7C7C;
                line-height: 18px;
                text-align: center;
                font-style: normal;
            }
        }
    }
}

// 主体内容
.container-center {
    height: calc(100vh - 300px);
    overflow: hidden;
    -webkit-overflow-scrolling: touch; /* 添加iOS惯性滚动 */
    
    // 各个区块样式
    & > view {
        margin-bottom: 20rpx;
    }

     .scroll-box {
       overflow-y: hidden;
    }
}

// 定位锚点（隐藏）
.anchor {
    height: 1rpx;
    width: 1rpx;
    opacity: 0;
    position: absolute;
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 20rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
  background: linear-gradient(180deg, #E2EFFF 0%, #FFFFFF 43%, #FFFFFF 100%);
  
  .title {
        font-size: 36rpx;
        color: #333;
    }

    .tags {
        display: flex;
        gap: 15rpx;
    }

    .tag {
        padding: 8rpx 16rpx;
        border-radius: 16rpx;
        font-size: 24rpx;
    }
}

// 高亮动画
@keyframes highlightPulse {
    0% { box-shadow: 0 0 0 0 rgba(7, 193, 96, 0.3); }
    70% { box-shadow: 0 0 0 10rpx rgba(7, 193, 96, 0); }
    100% { box-shadow: 0 0 0 0 rgba(7, 193, 96, 0); }
}

.highlight {
    animation: highlightPulse 2s ease-out;
}
</style>