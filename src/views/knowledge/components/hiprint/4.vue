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
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  