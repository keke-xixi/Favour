<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
     下拉框：
      <el-select v-model="field" placeholder="请选择" filterable clearable>
        <el-option v-for="item in dl('001')" :key="item.value" :value="item.value" :label="item.label"></el-option>
     </el-select>

     数字框：
     <el-input-number v-model="field" :min="0" :max="999999999" controls-position="right" :precision="4" placeholder="请输入"  />
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
  