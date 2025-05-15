<template>
    <div class="divBox" ref="divBox">
      <div style="position: fixed;top: 50%;left: 50%;z-index: 999;">
        <el-button type="danger" @click="updateDiv">生成100万个div</el-button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue"
  import runTask from "@/assets/js/task.js";
  
  const divBox = ref<any>(null)
  const isGenerating = ref(false)
  const progress = ref(0) // 进度 0-100
  const totalCount = 1000000  // 100万
  
  // 生成元素的优化版本
  const generateElements = () => {
    let currentIndex = 0
    const fragment = document.createDocumentFragment()
    
    return () => {
      // 记录开始时间
      const startTime = performance.now()
      
      // 每批处理一定数量的元素，避免长时间阻塞
      while (currentIndex < totalCount && (performance.now() - startTime) < 16) {
        const div:any = document.createElement('div')
        div.style = 'width: 100px;height: 100px;background-color: #0077d4;margin: 10px;'
        fragment.appendChild(div)
        currentIndex++
        
        // 每1000个元素更新一次进度
        if (currentIndex % 1000 === 0) {
          progress.value = Math.round((currentIndex / totalCount) * 100)
        }
      }
      
      // 每批结束后将片段添加到DOM
      if (fragment.children.length > 0) {
        divBox.value?.appendChild(fragment.cloneNode(true))
        fragment.textContent = '' // 清空片段
      }
      
      // 任务完成条件
      return currentIndex >= totalCount
    }
  }
  
  const updateDiv = () => {
    if (isGenerating.value) return
    
    isGenerating.value = true
    progress.value = 0
    
    // 清空现有内容
    if (divBox.value) {
      divBox.value.textContent = ''
    }
    
    // 使用runTask执行拆分后的任务
    runTask(generateElements())
      .then(() => {
        isGenerating.value = false
        progress.value = 100
        console.log('所有元素生成完成')
      })
      .catch(error => {
        isGenerating.value = false
        console.error('生成元素失败:', error)
      })
  }
  
  </script>
  
  <style scoped lang="scss">
  .divBox {
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    height: 100vh;
    width: 95%;
    padding-top: 120px;
  }
  .divBox::-webkit-scrollbar {
  width: 16px;
}

.divBox::-webkit-scrollbar-track {
  background: #fff;  // 轨道颜色
}

.divBox::-webkit-scrollbar-thumb {
  background: #0077d4; // 滚动条颜色
  border-radius: 3px;
}

.divBox::-webkit-scrollbar-thumb:hover {
  background: #fff;
}

  </style>