<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
       --- 下载包的网站：https://www.npmjs.com/
        --- 下载包的命令：npm install 包名  （仅仅把包下载到当前项目的 node_modules 文件夹里，不会修改 package.json 文件，最常用）
        --- 下载包的命令：npm install 包名 --save  （安装包，并在 package.json 文件的 dependencies 字段中记录这个包及其版本号， 用于生产环境依赖）
        --- 下载包的命令：npm install 包名 --save-dev  (同上，用于开发环境依赖)
        --- 下载包的命令：npm install 包名 -g  （将包安装到你操作系统的一个全局目录下（而不是当前项目的 node_modules），使其成为一个可以在任何地方通过命令行直接调用的全局命令）
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  