<template>
    <div ref="gridContainer" class="grid-container"></div>
    <div class="controls">
      <button @click="move('up')">↑ 上</button>
      <div>
        <button @click="move('left')">← 左</button>
        <button @click="reset">重置</button>
        <button @click="move('right')">右 →</button>
      </div>
      <button @click="move('down')">↓ 下</button>
    </div>
    <div class="info">
      当前位置: ({{ currentPos.x }}, {{ currentPos.y }}) | 
      已访问: {{ visitedCells.length }}格
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useGridBoxAnimation } from '@/utils/walk2.js';
  
  const gridContainer = ref(null);
  const { currentPos, visitedCells, moveBox, resetGrid } = useGridBoxAnimation(gridContainer, {
    gridColumns: 20,
    gridRows: 20,
    moveDuration: 200,
    boxColor: '#3498db',
    activeColor: '#e74c3c'
  });
  
  const move = (direction) => {
    moveBox(direction);
  };
  
  const reset = () => {
    resetGrid();
  };
  </script>
  
  <style>
  .grid-container {
    margin: 20px auto;
    border: 2px solid #333;
  }
  
  .controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
  }
  
  .controls > div {
    display: flex;
    gap: 20px;
  }
  
  button {
    padding: 10px 20px;
    font-size: 16px;
    background: #2c3e50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .info {
    margin-top: 20px;
    text-align: center;
    font-family: monospace;
  }
  </style>