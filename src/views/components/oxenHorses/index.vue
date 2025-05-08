<template>
    <div class="oxenHorses">
        <dragBox :customStyle="{}">
            拖拽盒子
        </dragBox>
        <div ref="draggableBox" class="box">拖拽我！</div>
    </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue';

import dragBox from '@/components/drag/index.vue';
import { makeDraggable } from '@/utils/drag.js';

const draggableBox = ref(null);  // draggableBox.value 就是 DOM 元素

onMounted(() => {
    if (draggableBox.value) {
        makeDraggable(draggableBox.value); // 调用 makeDraggable
    }
})

</script>

<style scoped lang="scss">
.oxenHorses {

}
.box {
    position: absolute;
    top: 100px;
    left: 100px;
    height: 100px;
    width: 100px;
    background-color: aqua;
}
</style>