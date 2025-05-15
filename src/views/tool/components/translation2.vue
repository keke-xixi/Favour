<template>
    <div style="width: 100%;height: 100vh;background-color: transparent;">
        <div ref="animationContainer" class="persistent-container"></div>
        <div class="intensity-control">
        <input 
            type="range" 
            min="1" 
            max="10" 
            v-model="intensity"
            @input="adjustIntensity"
        >
        </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { usePersistentStreakAnimation } from '@/utils/translation2.js';
  
  const animationContainer = ref(null);
  const intensity = ref(5);
  const { setIntensity } = usePersistentStreakAnimation(animationContainer, {
    maxStreaks: 150,
    spawnRate: 8,
    fadeDuration: 90,
    colorPalette: [
      '#FF2D75', '#00F2FF', '#FFEE00', 
      '#00FF87', '#FF00F5', '#00FFE0'
    ]
  });
  
  const adjustIntensity = () => {
    setIntensity(intensity.value);
  };
  </script>
  
  <style lang="scss" scoped>
  element.style {
      background: transparent !important;
  }
  .persistent-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .intensity-control {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
  }
  
  input[type="range"] {
    width: 100%;
    height: 8px;
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    outline: none;
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  
  input[type="range"]:hover {
    opacity: 1;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
    appearance: none;
  }
  </style>