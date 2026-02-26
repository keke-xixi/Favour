<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted, reactive } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
    // 动画帧使用
    const role = reactive({
        y: 0,
        jumpHeight: 100,
        requestAnimationId: 0,
    })

    const jumpOnceTime = (originRole?:any) => {
        if(Math.abs(role.y - originRole.y) >= role.jumpHeight) {
            cancelAnimationFrame(role.requestAnimationId);
            return
        }
        role.requestAnimationId = requestAnimationFrame(() => jumpOnceTime(originRole));
    }

    cancelAnimationFrame(role.requestAnimationId);

    // 实际可能使用场景（加载大量组件或者盒子）
    
    export function useDefer() {
        const count = ref(0);
        function update() {
            count.value++;
            requestAnimationFrame(update);
        }
        update();
        return function(n) {
            return count.value >= n;
        }
    }
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  