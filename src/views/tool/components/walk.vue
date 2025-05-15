<template>
    <div>
        <div ref="character" class="game-character"></div>
        <div class="controls">
        <button @click="move('left')">← 向左走</button>
        <button @click="stop">停下</button>
        <button @click="move('right')">向右走 →</button>
        <button @click="jump">跳跃</button>
        </div>
        <div>当前位置: {{ position.x.toFixed(0) }}, {{ position.y.toFixed(0) }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useCharacterAnimation } from '@/utils/walk.js';
  
  const character = ref(null);
  const { position, startWalking, stopWalking, jump } = useCharacterAnimation(character, {
    spriteSheet: '/img/game/coco.png', // 精灵图路径
    frameWidth: 120,
    frameHeight: 120,
    frameCount: 6,
    fps: 60,
    speed: 2
  });
  
  const move = (direction) => {
    startWalking(direction);
  };
  
  const stop = () => {
    stopWalking();
  };
  </script>
  
  <style>
  .game-character {
    position: absolute;
    left: 50%;
    bottom: 100px;
    z-index: 100;
  }
  
  .controls {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
  }
  
  button {
    padding: 8px 16px;
    background: #4a6fa5;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>