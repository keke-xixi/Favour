<template>
    <view class="container" ref="containerRef" @touchstart="handleTouchStart" @touchmove="handleTouchMove" :style="{ height: screenHeight + 'px' }">
      <!-- 控制面板 -->
      <view class="controls">
        <button @click="zoomOut" size="mini">-</button>
        <text class="scale-text">缩放: {{ (scale * 100).toFixed(0) }}%</text>
        <button @click="zoomIn" size="mini">+</button>
        <button @click="resetView" size="mini">重置视图</button>
      </view>
      
      <!-- 可移动的世界容器 -->
      <view class="world" 
            :style="{
              width: worldWidth + 'px',
              height: worldHeight + 'px',
              transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`,
              transition: isAnimating ? 'transform 0.3s ease' : 'none'
            }">
        
        <!-- 网格背景 -->
        <view class="grid" :style="gridStyle"></view>
        
        <!-- 移动的盒子 -->
        <view class="user-box" 
              :style="{
                width: cellSize + 'px',
                height: cellSize + 'px',
                left: (state.x - worldBounds.left) * cellSize + 'px',
                top: (state.y - worldBounds.top) * cellSize + 'px',
                transition: isMoving ? 'left 0.2s ease, top 0.2s ease' : 'none'
              }">
          <view class="box-content">
            {{ state.x }}, {{ state.y }}
          </view>
        </view>
      </view>
      
      <!-- 虚拟方向控制 -->
      <view class="virtual-controls">
        <view class="control-row">
          <button @touchstart="move('w')" class="control-btn">↑</button>
        </view>
        <view class="control-row">
          <button @touchstart="move('a')" class="control-btn">←</button>
          <button @touchstart="move('s')" class="control-btn">↓</button>
          <button @touchstart="move('d')" class="control-btn">→</button>
        </view>
      </view>
      
      <!-- 信息显示 -->
      <view class="info-panel">
        <text>位置: ({{ state.x }}, {{ state.y }})</text>
        <text>世界大小: {{ (worldWidth / cellSize).toFixed(0) }} × {{ (worldHeight / cellSize).toFixed(0) }}</text>
      </view>
    </view>
  </template>
  
  <script>
  export default {
    data() {
      return {
        // 屏幕尺寸
        screenHeight: 0,
        
        // 基础参数
        cellSize: 50,
        extendAmount: 5,
        
        // 世界边界
        worldBounds: {
          left: 0,
          right: 20,
          top: 0,
          bottom: 20
        },
        
        // 视图状态
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        isAnimating: false,
        isMoving: false,
        
        // 盒子状态
        state: {
          x: 10,
          y: 10
        }
      }
    },
    
    computed: {
      // 计算世界尺寸
      worldWidth() {
        return (this.worldBounds.right - this.worldBounds.left) * this.cellSize
      },
      worldHeight() {
        return (this.worldBounds.bottom - this.worldBounds.top) * this.cellSize
      },
      // 网格样式
      gridStyle() {
        return {
          width: this.worldWidth + 'px',
          height: this.worldHeight + 'px',
          backgroundSize: `${this.cellSize}px ${this.cellSize}px`
        }
      }
    },
    
    onLoad() {
      this.getSystemInfo()
    },
    
    onReady() {
      this.adjustViewAfterExtension()
    },
    
    methods: {
      // 获取系统信息
      getSystemInfo() {
        const systemInfo = uni.getSystemInfoSync()
        this.screenHeight = systemInfo.windowHeight
      },
      
      // 移动控制
      move(direction) {
        let newX = this.state.x
        let newY = this.state.y
        
        switch(direction) {
          case 'w':
            newY = this.state.y - 1
            break
          case 'a':
            newX = this.state.x - 1
            break
          case 's':
            newY = this.state.y + 1
            break
          case 'd':
            newX = this.state.x + 1
            break
        }
        
        this.moveTo(newX, newY)
      },
      
      // 移动到指定位置
      moveTo(x, y) {
        const extended = this.extendWorldIfNeeded(x, y)
        
        this.isMoving = true
        this.state.x = x
        this.state.y = y
        
        if (extended) {
          this.adjustViewAfterExtension()
        } else {
          this.ensureBoxInView()
        }
        
        setTimeout(() => {
          this.isMoving = false
        }, 200)
      },
      
      // 检查并扩展世界边界
      extendWorldIfNeeded(x, y) {
        let extended = false
        
        if (x < this.worldBounds.left) {
          this.worldBounds.left -= this.extendAmount
          extended = true
        }
        
        if (x >= this.worldBounds.right) {
          this.worldBounds.right += this.extendAmount
          extended = true
        }
        
        if (y < this.worldBounds.top) {
          this.worldBounds.top -= this.extendAmount
          extended = true
        }
        
        if (y >= this.worldBounds.bottom) {
          this.worldBounds.bottom += this.extendAmount
          extended = true
        }
        
        return extended
      },
      
      // 扩展后调整视图
      adjustViewAfterExtension() {
        const systemInfo = uni.getSystemInfoSync()
        const containerWidth = systemInfo.windowWidth
        const containerHeight = systemInfo.windowHeight
        
        const targetOffsetX = -((this.state.x - this.worldBounds.left) * this.cellSize - containerWidth / (2 * this.scale))
        const targetOffsetY = -((this.state.y - this.worldBounds.top) * this.cellSize - containerHeight / (2 * this.scale))
        
        this.isAnimating = true
        this.offsetX = targetOffsetX
        this.offsetY = targetOffsetY
        
        setTimeout(() => {
          this.isAnimating = false
        }, 300)
      },
      
      // 确保盒子在视图中
      ensureBoxInView() {
        const systemInfo = uni.getSystemInfoSync()
        const containerWidth = systemInfo.windowWidth
        const containerHeight = systemInfo.windowHeight
        
        const boxScreenX = (this.state.x - this.worldBounds.left) * this.cellSize * this.scale + this.offsetX * this.scale
        const boxScreenY = (this.state.y - this.worldBounds.top) * this.cellSize * this.scale + this.offsetY * this.scale
        const boxSize = this.cellSize * this.scale
        const threshold = 100
        
        let newOffsetX = this.offsetX
        let newOffsetY = this.offsetY
        
        if (boxScreenX < threshold) {
          newOffsetX += (threshold - boxScreenX) / this.scale
        } else if (boxScreenX + boxSize > containerWidth - threshold) {
          newOffsetX -= (boxScreenX + boxSize - (containerWidth - threshold)) / this.scale
        }
        
        if (boxScreenY < threshold) {
          newOffsetY += (threshold - boxScreenY) / this.scale
        } else if (boxScreenY + boxSize > containerHeight - threshold) {
          newOffsetY -= (boxScreenY + boxSize - (containerHeight - threshold)) / this.scale
        }
        
        if (newOffsetX !== this.offsetX || newOffsetY !== this.offsetY) {
          this.isAnimating = true
          this.offsetX = newOffsetX
          this.offsetY = newOffsetY
          
          setTimeout(() => {
            this.isAnimating = false
          }, 300)
        }
      },
      
      // 缩放功能
      zoomIn() {
        this.isAnimating = true
        this.scale = Math.min(3, this.scale + 0.1)
        setTimeout(() => {
          this.isAnimating = false
          this.ensureBoxInView()
        }, 300)
      },
      
      zoomOut() {
        this.isAnimating = true
        this.scale = Math.max(0.3, this.scale - 0.1)
        setTimeout(() => {
          this.isAnimating = false
          this.ensureBoxInView()
        }, 300)
      },
      
      // 重置视图
      resetView() {
        this.isAnimating = true
        this.scale = 1
        this.offsetX = 0
        this.offsetY = 0
        this.worldBounds.left = 0
        this.worldBounds.right = 20
        this.worldBounds.top = 0
        this.worldBounds.bottom = 20
        this.state.x = 10
        this.state.y = 10
        
        setTimeout(() => {
          this.isAnimating = false
        }, 300)
      },
      
      // 触摸事件处理
      handleTouchStart(e) {
        this.startX = e.touches[0].clientX
        this.startY = e.touches[0].clientY
      },
      
      handleTouchMove(e) {
        if (!this.startX || !this.startY) return
        
        const currentX = e.touches[0].clientX
        const currentY = e.touches[0].clientY
        
        const diffX = currentX - this.startX
        const diffY = currentY - this.startY
        
        // 简单的滑动控制
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
          if (diffX > 0) {
            this.move('d') // 右滑
          } else {
            this.move('a') // 左滑
          }
        } else if (Math.abs(diffY) > 10) {
          if (diffY > 0) {
            this.move('s') // 下滑
          } else {
            this.move('w') // 上滑
          }
        }
        
        this.startX = currentX
        this.startY = currentY
      }
    }
  }
  </script>
  
  <style scoped>
  .container {
    width: 100%;
    position: relative;
    overflow: hidden;
    background: #f0f2f5;
  }
  
  .controls {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10;
    background: rgba(255, 255, 255, 0.9);
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .scale-text {
    font-size: 14px;
    color: #333;
  }
  
  .world {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 0;
    background-color: rgba(255, 255, 255, 0.8);
  }
  
  .grid {
    position: absolute;
    top: 0;
    left: 0;
    background-image: 
      linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px);
  }
  
  .user-box {
    position: absolute;
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 14px;
  }
  
  .box-content {
    transform: scale(calc(1 / v-bind(scale)));
  }
  
  .virtual-controls {
    position: absolute;
    bottom: 100px;
    right: 20px;
    z-index: 10;
  }
  
  .control-row {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
  
  .control-btn {
    width: 60px;
    height: 60px;
    margin: 0 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #ddd;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .info-panel {
    position: absolute;
    bottom: 20px;
    left: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 12px;
    line-height: 1.5;
    display: flex;
    flex-direction: column;
  }
  </style>