<template>
    <div class="oxenHorses">
        <dragBox :customStyle="{}">
            拖拽盒子
        </dragBox>
        <div ref="draggableBox" class="box">拖拽我！</div>
        <div>当前位置：left: {{ position.left }}, top: {{ position.top }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref,onMounted,watch } from 'vue';

import dragBox from '@/components/drag/index.vue';
import { useDraggable } from '@/utils/dragPostion.js';

const draggableBox = ref<any>(null);  // draggableBox.value 就是 DOM 元素

const { position } = useDraggable(draggableBox); // 获取位置



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
</style>