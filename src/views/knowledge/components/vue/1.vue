<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
   样式穿透：
    :deep(img) {
		margin: auto;
	}
    :deep(.el-input),
    :deep(.el-select),
    :deep(.el-input-number) {
        width: 100%;
    }
    :deep(.el-slider .el-input-number){
        width: auto;
    }   
  `)
 
  onMounted(() => {
    
  })
  
  onUnmounted(() => {
    
  });

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  
  </style>
  