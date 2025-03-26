<template>
  <div class="appPage" :style="style"  ref="app">
    <router-view />
  </div>
</template>
<script setup lang="ts">
import {ref, onMounted, onUnmounted } from "vue"



const style = ref({
      width: `${window.innerWidth}px`,
      height: `${window.innerHeight}px`
});

const handleResize = () => {
  style.value.width = window.innerWidth + 'px';
  style.value.height = window.innerHeight + 'px';
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});


</script>
<style lang="scss" scoped>
.appPage{
  margin: 0;
  padding: 0;
}



</style>
