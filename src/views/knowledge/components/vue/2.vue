<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
        <script setup>
        
        使用setup语法糖的需要  

       //将属性或者函数暴露给父组件  父组件通过ref才访问的到 (为了防止破坏单向数据流)
        defineExpose({ text });

        export default {
            setup(_,{ expose }){
               const a = ref(1)

               expose(); // 这样用可以不暴露任何一个  不写会默认暴露所有

               return {
                   a
               }
            }
        }
        // 会默认暴露所有
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  