<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
      高级 -> 格式化函数 -> 
      function(title,value,options,templateData,target){ return \`\${value}\`; }

      function(title,value,options,templateData,target){ 
        value = value.replace(/<br\s*\/?>/g, '');
        return \`\<div style="text-indent: 2em; line-height: 1.6; font-size: 14px;">\${value}\</div>\`; }

  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  