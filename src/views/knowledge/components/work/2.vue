<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
      设置请求头（传参方式）：
       request({
            url: Api.CustomerApi,
            headers: {
            'Content-Type': 'multipart/form-data', // 设置请求头为 multipart/form-data
            },
            method: 'post',
            data
        });

        npm run dev -- --port 3001 --host 127.0.0.1  指定端口启动项目


        // 系统更新通知
        import { webUpdateNotice } from '@plugin-web-update-notification/vite'

        webUpdateNotice({
            versionType: 'build_timestamp',
            notificationConfig: {
                placement: 'topLeft',
            },
            notificationProps: {
                title: '📢 系统更新',
                description: '系统更新啦，请刷新页面！',
                buttonText: '刷新',
                dismissButtonText: '忽略',
            },
        }),
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  