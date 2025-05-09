<template>
    <div ref="box" class="collision-container">
      <!-- 内部盒子由JS动态生成 -->
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useBoxCollision } from '@/utils/crash.js';
  
  const box = ref(null);
  
  useBoxCollision(box, {
    boxSize: 50,
    speed: 20,
    bounceFactor: 0.85,
    friction: 0.98,
    colors: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6']
  });
  </script>
  
  <style scoped>
  .collision-container {
    width: 400px;
    height: 300px;
    background: #f5f5f5;
    border-radius: 12px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .collision-container:hover {
    box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.2);
    transform: scale(1.01);
  }
  </style>