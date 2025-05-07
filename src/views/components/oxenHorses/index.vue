<template>
    <div class="oxenHorses">
        <dragBox :customStyle="{}">
            拖拽盒子
        </dragBox>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import dragBox from '@/components/drag/index.vue';

</script>

<style scoped lang="scss">
.oxenHorses {

}

</style>