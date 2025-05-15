<template>
    <div ref="box" class="meteor-box">点击我有流星！✨</div>
    <div ref="box2" class="meteor-box">调用流星雨方法</div>
    
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useMeteorEffect } from '@/utils/star.js';
  
  const box = ref(null);
  const box2 = ref(null);
  
  useMeteorEffect(box, {
    meteorCount: 12,
    duration: 1200,
    size: 6,
    tailLength: 120,
    colors: ['#ff3366', '#33ccff', '#ffcc33', '#9966ff'],
    maxAngle: 45
  });

  // 初始化第二个盒子的流星雨效果，并暴露 triggerMeteor
const { triggerMeteor } = useMeteorEffect(box2);

// 手动触发第二个盒子的流星雨
const triggerBox2Meteor = () => {
  const rect = box2.value.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  triggerMeteor(centerX, centerY); // 手动调用
};
  </script>
  
  <style scoped>
  .meteor-box {
    width: 180px;
    height: 60px;
    background: linear-gradient(135deg, #6e48aa, #9d50bb);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    font-weight: bold;
    font-size: 18px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    user-select: none;
    transition: all 0.3s ease;
  }
  
  .meteor-box:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
  
  .meteor-box:active {
    transform: translateY(1px);
  }
  </style>