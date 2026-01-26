<template>
  <view class="custom-scroll-container">
    <!-- 滚动区域 -->
    <scroll-view 
      ref="scrollViewRef"
      :scroll-y="true" 
      :scroll-with-animation="false"
      :scroll-top="isDragging ? null : scrollTopValue"
      :show-scrollbar="false"
      :enable-back-to-top="false"
      @scroll="handleScroll"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      class="scroll-view-box"
      :style="{ height: actualHeight }"
    >
      <view id="scroll-content" class="scroll-content">
        <slot></slot>
      </view>
    </scroll-view>
<!--     
    <view 
      v-if="showScrollbar && canScroll"
      class="scrollbar-track"
      :style="{ height: actualHeight, opacity: thumbVisible ? 1 : 0 }"
      @touchstart="onTrackTouchStart"
      @touchmove="onTrackTouchMove"
      @touchend="onTrackTouchEnd"
      @touchcancel="onTrackTouchEnd"
    >
      <view 
        class="scrollbar-thumb"
        :style="{
          height: thumbHeight + 'px',
          transform: 'translateY(' + thumbTop + 'px)',
          transition: isDragging ? 'none' : 'transform 0.1s'
        }"
      ></view>
    </view> -->
  </view>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, defineProps, defineEmits, getCurrentInstance, onUnmounted } from 'vue'

const props = defineProps({
  height: {
    type: [String, Number],
    default: '500rpx'
  },
  showScrollbar: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['scroll', 'scroll-to'])

const instance = getCurrentInstance()

// 响应式数据
const scrollViewRef = ref(null)
const scrollTopValue = ref(0) // 用于绑定到scroll-top
const scrollTop = ref(0)
const scrollHeight = ref(0)
const containerHeight = ref(0)
const actualHeight = ref('500rpx')
const thumbHeight = ref(0)
const thumbTop = ref(0)
const thumbVisible = ref(false)
const isDragging = ref(false)
const isTouching = ref(false)
const startY = ref(0)
const startScrollTop = ref(0)
const thumbTimer = ref(null)
const animationTimer = ref(null)
const lastScrollTime = ref(0)

// 计算属性
const canScroll = computed(() => {
  return scrollHeight.value > containerHeight.value + 1
})

// 初始化
const init = () => {
  nextTick(() => {
    updateScrollInfo()
  })
}

// 更新滚动信息
const updateScrollInfo = () => {
  const query = uni.createSelectorQuery().in(instance)
  
  query.select('.scroll-view-box').boundingClientRect(containerRes => {
    if (!containerRes) return
    
    containerHeight.value = containerRes.height
    
    query.select('#scroll-content').boundingClientRect(contentRes => {
      if (!contentRes) return
      
      scrollHeight.value = contentRes.height
      
      // 计算滑块高度
      const ratio = Math.min(1, containerHeight.value / Math.max(1, scrollHeight.value))
      thumbHeight.value = Math.max(20, containerHeight.value * ratio)
      
      updateThumbPosition()
    }).exec()
  }).exec()
}

// 更新滑块位置
const updateThumbPosition = () => {
  if (!canScroll.value) return
  
  const maxScroll = Math.max(1, scrollHeight.value - containerHeight.value)
  const maxThumbTop = Math.max(1, containerHeight.value - thumbHeight.value)
  const scrollRatio = Math.min(1, scrollTop.value / maxScroll)
  
  thumbTop.value = scrollRatio * maxThumbTop
}

// 显示滚动条
const showThumb = () => {
  clearTimeout(thumbTimer.value)
  thumbVisible.value = true
  
  if (!isDragging.value && !isTouching.value) {
    thumbTimer.value = setTimeout(() => {
      thumbVisible.value = false
    }, 1500)
  }
}

// 触摸事件处理
const onTouchStart = () => {
  isTouching.value = true
  stopAnimation()
}

const onTouchMove = () => {
  showThumb()
}

const onTouchEnd = () => {
  isTouching.value = false
  showThumb()
}

// 滚动事件处理
const handleScroll = (e) => {
  const currentTime = Date.now()
  
  // 节流处理（避免频繁触发）
  if (currentTime - lastScrollTime.value < 16) {
    return
  }
  
  lastScrollTime.value = currentTime
  
  scrollTop.value = e.detail.scrollTop
  updateThumbPosition()
  showThumb()
  
  emit('scroll', {
    scrollTop: e.detail.scrollTop,
    scrollHeight: scrollHeight.value,
    containerHeight: containerHeight.value
  })
}

// 滚动条触摸开始
const onTrackTouchStart = (e) => {
  isDragging.value = true
  stopAnimation()
  startY.value = e.touches[0].clientY
  startScrollTop.value = scrollTop.value
  thumbVisible.value = true
  clearTimeout(thumbTimer.value)
}

// 滚动条触摸移动
const onTrackTouchMove = (e) => {
  if (!isDragging.value) return
  
  e.preventDefault()
  e.stopPropagation()
  
  const deltaY = e.touches[0].clientY - startY.value
  const maxScroll = Math.max(1, scrollHeight.value - containerHeight.value)
  const trackHeight = Math.max(1, containerHeight.value - thumbHeight.value)
  
  if (trackHeight > 0 && maxScroll > 0) {
    const ratio = deltaY / trackHeight
    let newScrollTop = startScrollTop.value + (maxScroll * ratio)
    newScrollTop = Math.max(0, Math.min(newScrollTop, maxScroll))
    
    scrollTop.value = newScrollTop
    updateThumbPosition()
  }
}

// 滚动条触摸结束
const onTrackTouchEnd = () => {
  isDragging.value = false
  showThumb()
}

// 停止动画
const stopAnimation = () => {
  if (animationTimer.value) {
    clearTimeout(animationTimer.value)
    animationTimer.value = null
  }
}

// 平滑滚动（兼容所有平台）
const smoothScrollTo = (targetY, duration = 300) => {
  return new Promise((resolve) => {
    stopAnimation()
    
    const startY = scrollTop.value
    const distance = targetY - startY
    const startTime = Date.now()
    const frameTime = 16 // 约60fps
    
    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // 缓动函数
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const currentY = startY + (distance * easeProgress)
      
      scrollTop.value = currentY

      scrollTopValue.value = currentY // 同步更新
      
      if (progress < 1) {
        animationTimer.value = setTimeout(animate, frameTime)
      } else {
        animationTimer.value = null
        resolve()
      }
    }
    
    animationTimer.value = setTimeout(animate, frameTime)
  })
}

// 滚动到指定位置
const scrollTo = (options) => {
  if (typeof options === 'number') {
    options = { y: options, animated: false }
  }
  
  const { y, animated = false } = options
  
  if (animated) {
    smoothScrollTo(y).then(() => {
      emit('scroll-to', { y, animated })
    })
  } else {
    scrollTop.value = y
    emit('scroll-to', { y, animated })
  }
  
  showThumb()
}

// 滚动到顶部
const scrollToTop = (animated = false) => {
  scrollTo({ y: 0, animated })
}

// 滚动到底部
const scrollToBottom = (animated = false) => {
  const bottom = Math.max(0, scrollHeight.value - containerHeight.value)
  scrollTo({ y: bottom, animated })
}

// 滚动到元素
const scrollToElement = (selector, offset = 0) => {
  return new Promise((resolve) => {
    const query = uni.createSelectorQuery().in(instance)
    query.select(selector).boundingClientRect(res => {
      if (res) {
        scrollTo({ y: res.top + offset, animated: true })
        resolve(res.top + offset)
      }
    }).exec()
  })
}

// 暴露方法
defineExpose({
  scrollTo,
  scrollToTop,
  scrollToBottom,
  scrollToElement,
  updateScrollInfo
})

// 生命周期
onMounted(() => {
  actualHeight.value = typeof props.height === 'number' 
    ? props.height + 'px' 
    : props.height
  
  init()
})

onUnmounted(() => {
  stopAnimation()
  clearTimeout(thumbTimer.value)
})

// 监听高度变化
watch(() => props.height, () => {
  actualHeight.value = typeof props.height === 'number' 
    ? props.height + 'px' 
    : props.height
  
  nextTick(() => {
    updateScrollInfo()
  })
})

// 监听内容变化
watch(() => scrollTop.value, () => {
  updateThumbPosition()
})
</script>

<style scoped lang="scss">
.custom-scroll-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.scroll-view-box {
  width: 100%;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}

.scroll-content {
  width: 100%;
  min-height: 100%;
}

/* 自定义滚动条 */
.scrollbar-track {
  position: absolute;
  top: 0;
  right: 4rpx;
  width: 6rpx;
  background-color: transparent;
  border-radius: 3rpx;
  z-index: 1000;
  touch-action: none;
  transition: opacity 0.3s;
  pointer-events: auto;
}

.scrollbar-thumb {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 3rpx;
  transition: transform 0.1s;
  
  &:active {
    background-color: rgba(0, 0, 0, 0.5);
  }
}

/* 暗黑模式 */
@media (prefers-color-scheme: dark) {
  .scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    
    &:active {
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
}

/* 移动端优化 */
@media (max-width: 768px) {
  .scrollbar-track {
    width: 4rpx;
    right: 2rpx;
  }
}
</style>