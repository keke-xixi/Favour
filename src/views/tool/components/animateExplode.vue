<template>
    <div>
        <div ref="box" class="box">点击我爆炸！💥</div>
        <el-button @click="tiggerClick" style="margin-top: 300px;">点击其它引发爆炸</el-button>
    </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue';

import { useExplosion  } from '@/utils/animateExplode.js';

const box = ref(null);
useExplosion(box, {
  particleCount: 30,      // 粒子数量
  duration: 1500,         // 动画持续时间（毫秒）
  colors: ['#ff0000', '#ff9900', '#ffff00', '#ffffff'], // 粒子颜色
});

const { explode } = useExplosion(box, {
  particleCount: 30,      // 粒子数量
  duration: 1500,         // 动画持续时间（毫秒）
  colors: ['#ff0000', '#ff9900', '#ffff00', '#ffffff'], // 粒子颜色
});

const tiggerClick = () => {
    explode(box.value)
}

onMounted(() => {
 
})

</script>

<style scoped lang="scss">
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