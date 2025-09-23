<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
        // 工具栏
        toolbarConfig: { export: false, refresh: false, print: false, custom: false, zoom: false },

        // 分页设置
        pagerConfig: { enabled: false },
  `)
 
  //将属性或者函数暴露给父组件
  defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  