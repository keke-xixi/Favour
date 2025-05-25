<template>
  <div class="wish">
    <div class="layer1"></div>
    <div class="layer2"></div>
    <div class="layer3"></div>
    <div class="layer4"></div>
    <div class="layer5"></div>
    <button class="z-button2" @click="drawLineMethod" style="z-index: 2;position: absolute;top: 20px;left: 20px;">
      开始
    </button>
    <!-- 旋转 -->
     <div class="rotate-container">
       <div ref="rotate" style="height: 100%;background-color: transparent;border: none;"></div>
     </div>
    <!-- 线条 -->
    <div ref="drawLine" class="drawLine-container"></div>
    

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { usePersistentStreakAnimation } from './components/drawLine.js';
import { useGalacticBoxAnimation } from './components/rotate.js';
import { useStore } from "vuex";

const store = useStore()

// 线条
const drawLine = ref(null);
const { start, stop, isRunning } = usePersistentStreakAnimation(drawLine, {
  maxStreaks: 500,
  spawnRate: 60,
  fadeDuration: 90,
  colorPalette: ['#3B82F6', '#07bf61', '#f04f24', '#fdcd0d', '#8B5CF6']
});

// 旋转
const rotate = ref(null);
const { addBox, clearAll } = useGalacticBoxAnimation(rotate, {
  boxCount: 1,
  palette: ['#3B82F6','#8B5CF6', '#fdcd0d'],
  enableTrails: true
})

// 启动动画
const drawLineMethod = async () => {
  isRunning.value ? stop() : start(); // 线条动画
  isRunning.value ? addBox() : clearAll(); // 旋转动画
}

onMounted(() => {
  store.commit('setBgColor', '#9a79e7')
})

onUnmounted(() => {
  store.commit('setBgColor', null)
})

</script>
<style lang="scss" scoped>
.wish {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(#9b7ae7, #5e3e9e, #1d1624, #000);

  .drawLine-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .rotate-container {
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    z-index: 1;
  }
}
</style>
