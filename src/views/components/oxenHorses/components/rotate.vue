<template>
   <div>
    <div ref="rotatingImage" class="rotating-container"></div>
    <div class="controls">
      <button @click="setSpeed(0.5)">慢速旋转</button>
      <button @click="setSpeed(2)">快速旋转</button>
      <button @click="changeImage">更换图片</button>
    </div>
   </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRotateImage } from '@/utils/rotate.js';

const rotatingImage = ref(null);
const { setRotationSpeed, setImage } = useRotateImage(rotatingImage, {
  imageUrl: '/img/game/coco.png',
  rotationSpeed: 1,
  hoverEffect: true,
  clickEffect: true,
  size: 150
});

const setSpeed = (speed) => {
  setRotationSpeed(speed);
};

const changeImage = () => {
  setImage('/img/game/jr.png');
};
</script>

<style>
.rotating-container {
  margin: 30px auto;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(0,0,0,0.2);
  overflow: hidden;
}

.controls {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.controls button {
  padding: 8px 16px;
  background: #4a6fa5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>