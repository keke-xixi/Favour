<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
        slots: { default: 'row_createTime' }

        <template #row_createTime="{ row }">
            <span v-if="row.createTime">{{ formatDate(new Date(row.createTime), 'YYYY-mm-dd') }}</span>
            <span v-else></span>
        </template>

        import { formatDate } from '/@/utils/formatTime';

        // 获取前两天到今天的日期
        const getDateRange = (daysBefore = 2) => {
            const today = new Date();
            const startDate = new Date();
            startDate.setDate(today.getDate() - daysBefore);

            const formatDate = (date: any) => {
                return date.toISOString().split('T')[0]; // YYYY-MM-DD
            };

            return {
                startDate: formatDate(startDate),
                endDate: formatDate(today),
            };
        };


        // 页面初始化
        onMounted(() => {
            const { startDate, endDate } = getDateRange(2);
            state.queryParams.startDate = startDate + ' 00:00:00';
            state.queryParams.endDate = endDate + ' 23:59:59';
        });
  `)
 
  onMounted(() => {
    
  })
  
  onUnmounted(() => {
    
  });
  
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  