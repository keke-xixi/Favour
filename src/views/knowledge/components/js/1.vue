<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
      split(',') 字符串转换为数组 

     // 1. 空字符串处理
     console.log("".split(',')); // [""] - 注意不是空数组

     // 2. 没有分隔符的情况
     console.log("hello".split(',')); // ["hello"]

     // 3.
      const str = "a,b,c,d,e";
      console.log(str.split(',', 3)); // ["a", "b", "c"] - 只拆分前3个

      
      
      join(",") 数组转为字符串

     // 1.
     const array = ["apple", "banana", "orange"];
     const result = array.join(',');
     console.log(result); // "apple,banana,orange"
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  