<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
      登录获取code:
        // 在您的登录按钮点击事件中
        export const getLoginCode = async () => {
            return new Promise((resolve, reject) => {
                uni.login({
                provider: 'weixin', // 微信小程序无需显式指定 provider（默认就是微信），H5 需配置
                success: (loginRes) => {
                    const code = loginRes.code;
                    console.log('获取微信登录 code 成功：', code);
                    resolve(code); // 成功时，把 code 传递出去
                },
                fail: (err) => {
                    console.error('获取登录 code 失败：', err);
                    reject(err); // 失败时，把错误信息传递出去
                }
                });
            });
        };

        // 引入 vConsole 用于移动端调试
        if (typeof VConsole === "undefined") {
            var script = document.createElement('script');
            script.src = 'https://unpkg.com/vconsole@latest/dist/vconsole.min.js';
            script.onload = function() {
            new VConsole();
            console.log('vConsole 初始化完成，移动端调试面板已启用。');
            };
            document.head.appendChild(script);
        } else {
            new VConsole();
            console.log('vConsole 初始化完成，移动端调试面板已启用。');
        }
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  