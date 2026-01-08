<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
      遍历对象：
      const obj = { a: 1, b: 2, c: 3 };

        // 方法1：forEach
        Object.keys(obj).forEach(key => {
             console.log(key, obj[key]); // a 1, b 2, c 3
        });


        // 方法2：for...in循环
        for (const key in obj) {
            console.log(key, obj[key]); // a 1, b 2, c 3
        }


     遍历调用异步请求：
        const promises = state.stationOptions.map(item => getJsonData(item.stationCode))
        Promise.all(promises).then(results => {
            state.lineOptions = results
            console.log(state.lineOptions)
        })

        const getJsonData = (stationCode) => {
            return new Promise((resolve, reject) => {
                getJson(stationCode).then(data => {
                    resolve(data)
                }).catch(error => {
                    reject(error)
                })
            })
        }


  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  