<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
      多报表预览： 
        let newDiv = document.createElement('div');
        const newHtml = hiprintTemplate.getHtml(reportData);
        newDiv.innerHTML = newHtml[0].outerHTML  + newHtml[0].outerHTML;
        templateRef?.appendChild(newDiv);
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  