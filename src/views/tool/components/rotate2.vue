<template>
    <div ref="container" class="orbit-container"></div>
    <div class="position-display">
      当前位置: ({{ Math.round(position.x) }}, {{ Math.round(position.y) }})
    </div>
    <button @click="toggleAnimation">
      {{ isPlaying ? '停止' : '开始' }}动画
    </button>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useOrbitEffect } from '@/utils/rotate2.js';
  
  const container = ref(null);
  const isPlaying = ref(false);
  
  const { currentPosition, startAnimation, stopAnimation } = useOrbitEffect(container, {
    imageUrl: '/img/game/coco.png',
    radius: 60,
    speed: 0.5,  // 旋转速度，越小速度越快
    centerX: 200,
    centerY: 200,
    autoStart: false,  // 是否默认开始动画
  });
  
  const position = currentPosition;
  
  const toggleAnimation = () => {
    isPlaying.value ? stopAnimation() : startAnimation();
    isPlaying.value = !isPlaying.value;
  };
  </script>
  
  <style>
  .orbit-container {
    position: relative;
    width: 400px;
    height: 400px;
    border: 1px dashed #ccc;
    margin: 20px auto;
  }
  
  .position-display {
    text-align: center;
    margin: 10px;
    font-family: monospace;
  }
  
  button {
    display: block;
    margin: 0 auto;
    padding: 8px 16px;
  }
  </style>