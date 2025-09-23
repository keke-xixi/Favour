<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'
  
  const containerRef = ref(null)
  
const text = ref(`
    底部聚合函数（选择一个字段计算合计）：
    function(column, fieldPageData, tableData, options) {
        const sum = tableData.reduce((total, row) => {
            return total + (Number(row.maoZhong) || 0); 
        }, 0);
        return \`<td style="text-align: center">\${sum }</td>\`;
    }

    function(column, fieldPageData, tableData, options) { 
        return \`<td style="border-right: 0px;transform: translateY(0px) translateX(85px);text-align: center">小计（\${tableData.length}）车</td>\`; 
    }
`)
  
   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  