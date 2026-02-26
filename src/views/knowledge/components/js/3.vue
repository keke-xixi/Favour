<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
    可用 JSON to TS 管理ts类型： https://www.npmjs.com/package/json-to-ts

    interface PowerStationData {
        [stationKey: string]: IStation;
    }

    // 假设 IStation 接口是这样的
    interface IStation {
        id: number;
        name: string;
        capacity: number;
        status: 'running' | 'stopped';
    }

    // 那么 PowerStationData 可以是这样的对象：
    const data: PowerStationData = {
        "station_001": {
            id: 1,
            name: "北京光伏电站",
            capacity: 1000,
            status: "running"
        }
        // 可以继续添加任意多个，只要键是字符串，值是 IStation 类型
    };
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  