<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
    多选：
    @checkbox-change="handleSelectionChange"
	@checkbox-all="handleSelectionChange"

    { type: 'checkbox', width: 50, fixed: 'left' },
     
    // 多选配置
	checkboxConfig: { trigger: 'row' },

     // 多选
    const checkboxSelection = ref<any>([]);
    const handleSelectionChange = (data: any) => {
        checkboxSelection.value = data.records;
    }




    单选：
    @radio-change="handleRadioChange"

    { type: 'radio', width: 50, fixed: 'left' },

    // 单选配置
	radioConfig: { trigger: 'row', highlight: true },

    // 单选
    const nowEditRow = ref<any>(null);
    const handleRadioChange = (data: any) => {
            nowEditRow.value = data.row;
    }
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  .container{
    width: 100%;
    height: 100%;
  }
  
  
  
  </style>
  