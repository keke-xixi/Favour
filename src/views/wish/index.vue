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
    <!-- 线条 -->
    <div ref="drawLine" class="drawLine-container" v-if="showDrawLine"></div>
     <!-- 旋转 -->
    <div class="rotate-container" ref="rotate"></div>
    

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { usePersistentStreakAnimation } from './components/drawLine.js';
import { useGalacticBoxAnimation } from './components/rotate.js';
import { useStore } from "vuex";

const store = useStore()
const firstTime = ref(500); // 第一段动画加载时间
const secondTime = ref(1000); // 第二段动画加载时间
const thirdTime = ref(1500); // 第三段动画加载时间

// 线条
const drawLine = ref(null);
const showDrawLine = ref(false);
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

// 延迟执行动画
const runDelayedActions = async (tasks) => {
  for (const task of tasks) {
    await new Promise(resolve => {
      setTimeout(() => {
        task.action(); // 执行传入的方法
        resolve();
      }, task.delay);
    });
  }
}

// 启动动画
const drawLineMethod = async () => {
        // 定义你的任务列表
      const tasks = [
        {
          // 第一个任务：线条动画
          action: () => {
            isRunning.value ? stop() : start()
          }, 
          delay: firstTime.value,
        },
        {
          // 第二个任务：旋转动画
          action: () => isRunning.value ? addBox() : clearAll(), 
          delay: secondTime.value,
        },
      ];

      // 执行任务
      runDelayedActions(tasks).then(() => {
          console.log("所有动画执行完毕！");
          if(isRunning.value) {
              drawLineMethod()
          }
      });
  
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
  height: 100vh;
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
      position: absolute;
      top: 20%;
      left: 20%;
      width: 60%;
      height: 60%;
  }
}
</style>
