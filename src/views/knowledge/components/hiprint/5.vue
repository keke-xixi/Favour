<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
      高级-> 行/列合并函数:
      function customMergeCells(data, col, colIndex, rowIndex, tableData, printData) {
            // 需要合并的列索引：第0、3、5、7列
            const mergeColumns = [0, 3, 5, 7];
            
            // 如果不是要合并的列，保持原样（1x1单元格）
            if (!mergeColumns.includes(colIndex)) {
                return [1, 1];
            }
            
            // 每两行一组处理
            const isFirstInPair = (rowIndex % 2 === 0);
            
            if (isFirstInPair) {
                // 当前是两行中的第一行
                const rowCount = Math.min(2, tableData.length - rowIndex); // 防止越界
                return [rowCount, 1]; // 垂直合并2行
            } else {
                // 当前是两行中的第二行，隐藏单元格
                return [0, 0];
            }
        }
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  