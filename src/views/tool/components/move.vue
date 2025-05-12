<template>
   <div ref="box" class="box">我会随机移动！</div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue';

import { useRandomMove } from '@/utils/move.js';


const box = ref(null);
useRandomMove(box, { interval: 100, speed: 0.05 }); // 随机移动 interval 每隔多少毫秒移动一次 speed 动画时长


onMounted(() => {
 
})

</script>

<style scoped lang="scss">

</style>