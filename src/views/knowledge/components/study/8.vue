<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
      js 异步
        浏览器是一个  渲染主线程 + 消息队列（包含任务） 让浏览器运行永不阻塞
        js 是一门 单线程语言，它运行在渲染主线程中，只能做一件事，异步发生时，会等待异步执行完成，再放到消息队列末尾排队，等待渲染主线程空闲时，再从消息队列中取出任务执行。
        在这种异步模式下，浏览器永不堵塞，最大程度保证了单线程运行

      js为何会阻碍页面渲染？
        js 本来就是在 渲染主线程 中运行的，它如果阻塞了渲染主线程，那么页面就会卡顿，用户体验就会下降。
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  