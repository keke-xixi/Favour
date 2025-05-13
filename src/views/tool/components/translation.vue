<template>
    <div ref="galaxy" class="galaxy-container"></div>
    <div class="controls">
      <button @click="addBoxs">添加盒子</button>
      <button @click="clearAll">清空</button>
      <select v-model="selectedPath">
        <option v-for="path in pathTypes" :value="path">{{ path }}</option>
      </select>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useGalacticBoxAnimation } from '@/utils/translation.js';
  
  const galaxy = ref(null);
  const selectedPath = ref('diagonal');
  const pathTypes = ['diagonal', 'spiral', 'zigzag', 'figure8'];
  
  const { addBox, clearAll } = useGalacticBoxAnimation(galaxy, {
    boxCount: 3,
    palette: ['#FF2D75', '#00F0FF', '#FFD700'],
    enableTrails: true
  });
  
  const addBoxs = () => {
    addBox(selectedPath.value);
  };
  </script>
  
  <style>
  .galaxy-container {
    width: 100%;
    height: 70vh;
    margin: 0 auto;
    border: 1px solid #333;
    background: radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f1a 100%);
  }
  
  .controls {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
    padding: 15px;
    background: rgba(0,0,0,0.5);
    border-radius: 10px;
  }
  
  button {
    padding: 8px 16px;
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(167, 119, 227, 0.4);
  }
  
  select {
    padding: 8px;
    border-radius: 20px;
    background: #2c3e50;
    color: white;
    border: 1px solid #a777e3;
  }
  </style>