<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
     高级->样式函数：
      function(value, options, target, templateData) {
            return {
                // 行高 = 高度（确保单行文字居中）
                lineHeight: "35px",
                // 内边距（控制上下间距）
                height: "auto",
                // 避免内容溢出
                overflow: "hidden",
            };
      }

      function(value, options, target, templateData) {
        return {
            position: "relative", // 伪元素定位基准
            border: "1px solid black",
            padding: "80px 0 60px 0", // 顶部80px + 底部60px间距
            
            // 伪元素实现左右边框（仅作用于顶部80px + 底部60px）
            "&::before, &::after": {
                content: "''",
                position: "absolute",
                width: "1px", // 边框宽度
                background: "black", // 纯色边框（非渐变）
                zIndex: 1
            },
            "&::before": { 
                 left: 0,
                // 关键：精准控制高度和位置
                height: "calc(80px + 60px)", // 顶部80px + 底部60px
                top: "0",
                // 中间透明区域用背景裁剪实现
                backgroundImage: "linear-gradient(to bottom, black 80px, transparent 80px, transparent calc(100% - 60px), black calc(100% - 60px))"
            },
            "&::after": { 
                right: 0,
                height: "calc(80px + 60px)", // 同上
                top: "0",
                backgroundImage: "linear-gradient(to bottom, black 80px, transparent 80px, transparent calc(100% - 60px), black calc(100% - 60px))"
            }
        };
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  