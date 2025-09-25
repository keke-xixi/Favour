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

        合并每2行的第1列
        // 行/列 合并函数
        {
            rowsColumnsMerge:function (data, row, colIndex, rowIndex) {
                console.log('data', data);
                console.log('row', row);
                console.log('colIndex', colIndex);
                console.log('rowIndex', rowIndex);
                // 返回一个数组,参数一为行(rowspan)合并数,参数二为列(colspan)合并数, 被合并的行或者列值设为0
                if (rowIndex%2 == 0) { // 0、2、4 行
                if (colIndex == 0) { // 1列
                    // 设置合并的 行/列 数量
                    return [2, 1]
                }
                return [1, 1]
                } else {
                // 1、3 行
                if (colIndex == 0) { // 1列
                    // 被合并的 行/列 设置为 0
                    return [0, 1]
                }
                return [1, 1]
                }
            }
        }

        合并每行的前 2 列
        // 行/列 合并函数
        {
            rowsColumnsMerge:function (data, row, colIndex, rowIndex) {
                console.log('data', data);
                console.log('row', row);
                console.log('colIndex', colIndex);
                console.log('rowIndex', rowIndex);
                // 返回一个数组,参数一为行(rowspan)合并数,参数二为列(colspan)合并数, 被合并的行或者列值设为0
                if (colIndex == 0) { // 第1列
                return [1, 2]
                } elseif (colIndex == 1) { // 第2列
                return [1, 0]
                } else {
                return [1, 1]
                }
            }
        }
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  