<template>
    <div ref="starfield" class="starfield-container"></div>
    <!-- 您的主内容 -->
    <main class="content">
      <h1>星空背景示例</h1>
      <button @click="triggerStar">触发流星</button>
    </main>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useStarfieldAnimation } from '@/utils/background2.js';
  
  const starfield = ref(null);
  const { triggerShootingStar } = useStarfieldAnimation(starfield, {
    starCount: 300,
    shootingStarInterval: 2000,
    colorPalette: {
      stars: ['#ffffff', '#b3e5fc', '#ffcc80', '#ff80ab'],
      nebulas: [
        'radial-gradient(circle, rgba(179,229,252,0.2) 0%, transparent 70%)',
        'radial-gradient(circle, rgba(255,204,128,0.15) 0%, transparent 70%)',
        'radial-gradient(circle, rgba(255,128,171,0.25) 0%, transparent 70%)'
      ]
    }
  });
  
  const triggerStar = () => {
    triggerShootingStar();
  };
  </script>
  
  <style>
  .starfield-container {
    position: fixed;
    width: 100%;
    height: 100%;
  }
  
  .content {
    position: relative;
    z-index: 1;
    color: white;
    text-align: center;
    padding-top: 20vh;
  }
  
  button {
    padding: 10px 20px;
    background: rgba(255,255,255,0.2);
    color: white;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  button:hover {
    background: rgba(255,255,255,0.3);
  }
  </style>