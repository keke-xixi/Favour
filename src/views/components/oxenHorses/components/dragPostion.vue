<template>
     <div>
        <div style="height: 100px;">当前位置：left: {{ position.left }}, top: {{ position.top }}</div>
        <div ref="box" class="box">拖拽我！</div>
     </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue';
import { useDraggable } from '@/utils/dragPostion.js';

const box = ref<any>(null);  // draggableBox.value 就是 DOM 元素
const { position } = useDraggable(box); // 获取位置



onMounted(() => {
 
})

</script>

<style scoped lang="scss">

</style>