<template>
    <div class="container">
      let { fullData } = xGrid.value ? xGrid.value.getTableData() : { fullData: [] }; 
      xGrid.value?.remove(fullData);
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  
  onUnmounted(() => {
    
  });
  
  </script>
  <style lang="scss" scoped>
  .container{
    width: 100%;
    height: 100%;
  }
  
  
  
  </style>
  