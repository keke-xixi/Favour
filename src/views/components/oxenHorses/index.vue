<template>
    <div class="oxenHorses">
        <dragBox :customStyle="{}">
            拖拽盒子
        </dragBox>
        <!-- <div ref="draggableBox" class="box">拖拽我！</div>
        <div>当前位置：left: {{ position.left }}, top: {{ position.top }}</div>
        <div ref="movingBox" class="box2">我会随机移动！</div> -->
        <div ref="explodingBox" class="box3">点击我爆炸！💥</div>
    </div>
</template>

<script setup lang="ts">
import { ref,onMounted,watch } from 'vue';

import dragBox from '@/components/drag/index.vue';
import { useDraggable } from '@/utils/dragPostion.js';
import { useRandomMove } from '@/utils/move.js';
import { useExplosion  } from '@/utils/animateExplode.js';

// const draggableBox = ref<any>(null);  // draggableBox.value 就是 DOM 元素
// const { position } = useDraggable(draggableBox); // 获取位置

// const movingBox = ref(null);
// useRandomMove(movingBox, { interval: 200, speed: 0.16 }); // 随机移动 interval 每隔多少毫秒移动一次 speed 动画时长

const explodingBox = ref(null);
useExplosion(explodingBox, {
  particleCount: 30,      // 粒子数量
  duration: 1500,         // 动画持续时间（毫秒）
  colors: ['#ff0000', '#ff9900', '#ffff00', '#ffffff'], // 粒子颜色
});


onMounted(() => {
 
})

</script>

<style scoped lang="scss">
.oxenHorses {

}
.box {
  width: 100px;
  height: 100px;
  background: #2ecc71;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.box2 {
  width: 100px;
  height: 100px;
  background: #e74c3c;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.box3 {
  width: 80px;
  height: 80px;
  background: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  user-select: none;
}

.exploding-box {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #3498db, #9b59b6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  user-select: none;
  font-weight: bold;
  transition: transform 0.2s;
}

.exploding-box:hover {
  transform: scale(1.05);
}

.exploding-box:active {
  transform: scale(0.95);
}
</style>