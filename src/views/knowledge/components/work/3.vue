<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
      开发常用笔记：
       <el-col :xs="24" :sm="5" :md="5" :lg="5" :xl="5" class="mb5">
            <el-form-item label="车牌" prop="transCode">
                <el-input v-model="state.queryParams.transCode" placeholder="车牌" clearable maxlength="50" />
            </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8" :md="5" :lg="5" :xl="5" class="mb5" >
                <el-form-item label="分类" prop="coalType">
                    <el-select v-model="state.queryParams.coalType" placeholder="物资种类" filterable clearable>
                        <el-option v-for="(item,index) in coalList" :key="item.value" :value="item.value" :label="item.label" />
                    </el-select>
                </el-form-item>
        </el-col>

        import { ApprovalResult } from '/@/types/enum';
        <template #row_confirmStatus="{ row }">
            <span v-if="row.confirmStatus === null || row.confirmStatus === undefined || row.confirmStatus === ''"></span>
            <el-tag v-else> {{ ApprovalResult.find((item:any) => item.value === row.confirmStatus)?.name }}</el-tag>
        </template>

        import { ApprovalResult,CoalList } from '/@/types/enum';
        <el-form-item label="煤种" prop="goodsName">
            <el-select v-model="state.queryParams.goodsName" placeholder="煤种" filterable clearable>
                <el-option v-for="(item,index) in CoalList" :key="item.label" :value="item.label" :label="item.label" />
            </el-select>
        </el-form-item>
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  