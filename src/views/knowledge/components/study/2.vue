<template>
    <div class="container" ref="containerRef">
        <el-button class="btn">hover</el-button>
        <div class="detail">
          this is a test
          inside the component , and the text is very long and will not fit in 
          the container  so we need to use the overflow property to make it scrollable, 
          but we also need to make sure that the container is not too small to fit the text,
        </div>
        <el-input type="textarea" v-model="text" :rows="26" class="container-input" spellcheck="false" style="margin-top: 15px;"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

   
  

  const text = ref(`
        <el-button class="btn">hover</el-button>
        <div class="detail">
          this is a test
          inside the component , and the text is very long and will not fit in 
          the container  so we need to use the overflow property to make it scrollable, 
          but we also need to make sure that the container is not too small to fit the text,
        </div>

          .btn {
            outline: none;
            cursor: pointer;
            transition: 0.1s;
          }
          .detail {
            background-color: #3693ff;
            font-size: 14px;
            height: 0;
            width: 300px;
            color: #ebf0fa;
            text-indent: 2em;
            transition: all 0.5s;
            interpolate-size: allow-keywords
          }
          .btn:hover  ~  .detail {
            height: auto !important;
            padding: 20px;
          }
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  .btn {
    outline: none;
    cursor: pointer;
    transition: 0.1s;
  }
  .detail {
    background-color: #3693ff;
    font-size: 14px;
    height: 0;
    width: 300px;
    color: #ebf0fa;
    text-indent: 2em;
    transition: all 0.5s;
    interpolate-size: allow-keywords
  }
  .btn:hover  ~  .detail {
    height: auto !important;
    padding: 20px;
  }
  </style>
  