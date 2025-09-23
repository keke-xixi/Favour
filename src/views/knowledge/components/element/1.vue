<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
     下拉框：
      <el-select v-model="field" placeholder="请选择" filterable clearable>
        <el-option v-for="item in dl('001')" :key="item.value" :value="item.value" :label="item.label"></el-option>
     </el-select>

     数字框：
     <el-input-number v-model="field" :min="0" :max="999999999" controls-position="right" :precision="4" placeholder="请输入"  />

     输入框禁用语法检查：
     spellcheck="false"

     日期选择器： 
     default-time 选择时间时候设置默认时间后缀  value-format 设置选择时间后返回时间格式
     <el-date-picker 
            type="datetimerange" 
            v-model="field"  
            value-format="YYYY-MM-DD HH:mm:ss" 
            start-placeholder="开始时间" 
            end-placeholder="结束时间" 
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" 
        />

      时间范围：
       <el-col :xs="24" :sm="12" :md="9" :lg="9" :xl="9" class="mb5" >
            <el-form-item label="创建时间">
                <el-date-picker
                    style="width: 46%;"
                    v-model="state.queryParams.startDate"
                    :value-format="'YYYY-MM-DD' + ' ' + '00:00:00'"
                    type="date"
                    placeholder="开始时间"
                />
                <span style="text-align: center;width: 8%;">至</span>
                    <el-date-picker
                    style="width: 46%;"
                    v-model="state.queryParams.endDate"
                    :disabled-date="disabledEndDate"
                    :value-format="'YYYY-MM-DD' + ' ' + '23:59:59'"
                    type="date"
                    placeholder="结束时间"
                />
            </el-form-item>
        </el-col>

        // 禁用结束日期
        const disabledEndDate = (time:any) => {
            if (!state.queryParams.startDate) return false; // 如果没有选开始日期，不禁用
            
            const startDate = new Date(state.queryParams.startDate);
            return time.getTime() < startDate.setHours(0, 0, 0, 0); // 禁用开始日期之前的日期
        };
  `)
 
  onMounted(() => {
    
  })
  
  onUnmounted(() => {
    
  });

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  