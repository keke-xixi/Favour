<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
        //  打印 添加自定义样式
        state.hiprintTemplate.print(
            state.printData,
            {},
            {
                callback: () => {
                    state.waitShowPrinter = false;
                },
                styleHandler: () => {
                    // 这里拼接成放html->head标签内的css/style
                    let css = '<style>div{font-size: 20px !important;}</style>'
                    return css
                }
            }
        );
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  