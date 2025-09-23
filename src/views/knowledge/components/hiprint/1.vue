<template>
  <div class="container" ref="containerRef">
      <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
  </div>
</template>
<script setup lang="ts">
import { ref,onMounted,onUnmounted } from 'vue'

const containerRef = ref(null)

const text = ref(`
    修改单元格样式：
    function(options){ return { color:'black',borderRight: "0px",transform: "translateY(0px) translateX(60px)" }; }

    （其它样式属性请参考css文档    https://www.w3school.com.cn/cssref/pr_border.asp   ）
`)

 //将属性或者函数暴露给父组件
 defineExpose({ text });
</script>
<style lang="scss" scoped>


</style>
