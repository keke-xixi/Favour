<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
      设置请求头（传参方式）：
       request({
            url: Api.CustomerApi,
            headers: {
            'Content-Type': 'multipart/form-data', // 设置请求头为 multipart/form-data
            },
            method: 'post',
            data
        });
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  