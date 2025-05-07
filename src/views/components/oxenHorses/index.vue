<template>
    <div
      ref="draggableBox"
      @mousedown="startDrag"
      @touchstart="startDrag"
      :style="{
        position: 'absolute',
        transform: `translate(${x}px, ${y}px)`,
        cursor: 'move',
        userSelect: 'none',
        touchAction: 'none', // 禁止触摸默认行为（如滚动）
        width: '100px',
        height: '100px',
        background: 'lightblue',
      }"
    >
      拖拽我（修复版）
    </div>
  </template>
  
  <script setup>
  import { ref, onUnmounted } from "vue";
  
  const draggableBox = ref(null);
  const x = ref(0);
  const y = ref(0);
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  
  // 开始拖拽（兼容桌面和移动端）
  const startDrag = (e) => {
    isDragging = true;
    const clientX = e.clientX ?? e.touches[0].clientX;
    const clientY = e.clientY ?? e.touches[0].clientY;
    startX = clientX - x.value;
    startY = clientY - y.value;
    
    // 全局监听（确保快速移动不丢失）
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("touchmove", handleDrag, { passive: false });
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchend", stopDrag);
    
    e.preventDefault(); // 必须阻止默认行为！
  };
  
  // 拖拽中
  const handleDrag = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX ?? e.touches[0].clientX;
    const clientY = e.clientY ?? e.touches[0].clientY;
    x.value = clientX - startX;
    y.value = clientY - startY;
    e.preventDefault(); // 阻止移动端页面滚动
  };
  
  // 停止拖拽
  const stopDrag = () => {
    isDragging = false;
    // 清理所有全局事件
    window.removeEventListener("mousemove", handleDrag);
    window.removeEventListener("touchmove", handleDrag);
    window.removeEventListener("mouseup", stopDrag);
    window.removeEventListener("touchend", stopDrag);
  };
  
  // 组件卸载时清理事件
  onUnmounted(stopDrag);
  </script>