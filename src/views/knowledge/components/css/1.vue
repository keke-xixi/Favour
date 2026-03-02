<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
       在线脚本工具  https://tools.jb51.net/code/css3path
       1. /* 裁剪 */
       clip-path
       
       2. /* 滚动 */  （用于隐藏网页元素的滚动条，但保留滚动功能）
        &::-webkit-scrollbar {
            display: none;
        }

        3. /* 背景 */ （自定义渐进色变）
        background: repeating-linear-gradient(135deg, transparent, transparent 0.1875rem, rgba(255, 255, 255, 0.5) 0.1875rem, rgba(255, 255, 255, 0.5) 0.4375rem), rgba(61, 146, 253, 0.5);
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  