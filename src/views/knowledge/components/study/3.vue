<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
      // 给fetch 添加超时功能
      function createRequestWithTimeout(timeout = 3000) {
            return function (url, options) {
                return new Promise((resolve, reject) => {
                   const abort = new AbortController();
                   options = options || {};
                   if(options.signal) {
                      options.signal.addEventListener('abort', () => {
                          abort.abort();
                      })
                   }
                   options.signal = abort.signal;
                   setTimeout(() => {
                      reject(new Error('请求超时'))
                      abort.abort();
                   }, timeout)
                  //    fetch(url, options).then(resolve).catch(reject) // 能捕获resolve函数的错误
                  fetch(url, options).then(resolve, reject)  // 无法捕获resolve函数的错误
                })
            }
      }
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  