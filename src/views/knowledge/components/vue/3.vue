<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
    盒子按键：
    <div class="container" ref="containerRef" @keydown="handleKeyDown" tabindex="0">
		 <div class="user" 
		 :style="{
			width: width + 'px',
			height: height + 'px',
		 }"></div>

	</div>

    const handleKeyDown = (event) => {
        console.log('按下的键:', event.key);
        console.log('键码:', event.keyCode);
        console.log('编码:', event.code);
    }
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  