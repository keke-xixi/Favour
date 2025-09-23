<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
      let { fullData } = xGrid.value ? xGrid.value.getTableData() : { fullData: [] }; 
      xGrid.value?.remove(fullData);
  `)
 
  onMounted(() => {
    
  })
  
  onUnmounted(() => {
    
  });

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  .container{
    width: 100%;
    height: 100%;
  }
  
  
  
  </style>
  