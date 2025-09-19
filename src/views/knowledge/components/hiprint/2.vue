<template>
    <div class="container">
      <!-- 复制按钮 -->
      <button class="copy-btn" @click="copyContainerContent">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        复制
      </button>
  
      <!-- 你的内容 -->
      let { fullData } = xGrid.value ? xGrid.value.getTableData() : { fullData: [] };
      xGrid.value?.remove(fullData);
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  
  // 复制容器内容
  const copyContainerContent = async () => {
    try {
      const container = document.querySelector('.container')
      if (!container) return
      
      // 获取容器内的文本内容（排除复制按钮）
      const content = container.innerText.replace('复制', '').trim()
      
      // 使用 Clipboard API
      await navigator.clipboard.writeText(content)
      
      // 显示复制成功提示（可选）
      showCopySuccess()
    } catch (err) {
      console.error('复制失败:', err)
      // 备用方案：使用传统方法
      fallbackCopy()
    }
  }
  
  // 显示复制成功提示
  const showCopySuccess = () => {
    const btn = document.querySelector('.copy-btn')
    if (btn) {
      const originalText = btn.innerHTML
      btn.innerHTML = '✓ 已复制'
      btn.style.backgroundColor = '#4caf50'
      
      setTimeout(() => {
        btn.innerHTML = originalText
        btn.style.backgroundColor = ''
      }, 2000)
    }
  }
  
  // 备用复制方案
  const fallbackCopy = () => {
    const container = document.querySelector('.container')
    if (!container) return
    
    const content = container.innerText.replace('复制', '').trim()
    const textArea = document.createElement('textarea')
    textArea.value = content
    document.body.appendChild(textArea)
    textArea.select()
    
    try {
      document.execCommand('copy')
      showCopySuccess()
    } catch (err) {
      console.error('备用复制方案失败:', err)
    }
    
    document.body.removeChild(textArea)
  }
  
  onUnmounted(() => {
    // 清理工作
  });
  </script>
  
  <style lang="scss" scoped>
  .copy-btn {
    position: absolute;
    top: 10px;
    right: 100px;
    padding: 6px 12px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.3s ease;
    
    &:hover {
      background: #0056b3;
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
  </style>