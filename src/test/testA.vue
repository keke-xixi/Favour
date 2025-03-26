<template>
  <div class="">

   {{ name + screenWidth }}


  </div>
</template>
<script setup lang="ts">
import { ref,onMounted,onUnmounted } from 'vue'
const screenWidth = ref(window.innerWidth);
screenWidth.value = window.innerWidth

 const name = 'testA'
 function updateWidth() {
  screenWidth.value = window.innerWidth;
  // screenHeight.value = window.innerHeight;
  // console.log(window.innerWidth,'window.innerWidth');
  
}

onMounted(() => {
  window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});

</script>
<style lang="scss" scoped>




</style>
