<template>
  <div class="container" ref="containerRef">
      <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
  </div>
</template>
<script setup lang="ts">
import { ref,onMounted,onUnmounted } from 'vue'

const containerRef = ref(null)

const text = ref(`
      单元格渲染：
      function(value,row,colIndex,options,rowIndex){ return \`\${( row.number || row.number === 0 )  ? row.number : "" }\`; }

      function(value,row,colIndex,options,rowIndex){ return \`\${row.testNo  ? row.testNo : "" }\`; }
`)

 //将属性或者函数暴露给父组件
 defineExpose({ text });
</script>
<style lang="scss" scoped>


</style>
