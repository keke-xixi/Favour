<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
        微信公众平台：
        https://mp.weixin.qq.com/   （发布流程，配置 Appid->上传->版本管理发布体验版->正式版）

        uCharts:
        https://www.ucharts.cn/v2/#/demo/index

        开发者中心（打包apk）
        https://dev.dcloud.net.cn/pages/app/list
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  