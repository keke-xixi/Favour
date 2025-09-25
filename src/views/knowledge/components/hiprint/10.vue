<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
        // 参数依次为：标题，field的值，参数，模板打印数据，当前元素dom
        function(title,value,options,templateData,target) {
            return \`\${templateData['name']}-\${templateData['name']}\`;
        }

        // 对应模板json 或者 provider中
        {
            options:{
                "formatter": "function(title,value,options,templateData,target){  
                    return \`\${templateData['name']}-\${templateData['name']
                };
            }"
        }
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  