<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
      1.当拉取代码频繁失败
      Recv failure: Connection was reset
      Failed to connect to github.com port 443 after 21089 ms: Couldn't connect to server

      # 1. 生成 SSH 密钥（如果还没有）
      ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

      # 2. 查看并复制公钥
      cat ~/.ssh/id_rsa.pub

      Enter file in which to save the key (C:\Users\admin/.ssh/id_rsa):
         # 直接按回车

      Enter passphrase (empty for no passphrase):
         # 直接按回车（不设置密码）

      Enter same passphrase again:
         # 再次按回车确认

      # 查看公钥内容
      type C:\Users\admin\.ssh\id_rsa.pub

      3.直接打开  https://github.com/settings/keys

      4.# 测试 SSH 连接  ssh -T git@github.com

      5.如果连接成功，会显示： Hi keke-xixi! You've successfully authenticated, but GitHub does not provide shell access.


      6. 查看当前的远程地址
        git remote -v

      7. 修改为 SSH 地址
        git remote set-url origin git@XXXX:XXXX/XXXX.git

      8. 确认修改成功
        git remote -v

      9. 现在可以正常拉取代码了
        git pull --tags origin dev


      clone失效场景
      使用 git init + git remote add + git pull（推荐，效果等同 clone）

      # 方法A：直接在命令中包含用户名（替换成你的GitLab用户名）
      git fetch http://你的用户名@113.240.68.17:29919/code/PVMonitor-web-cloud.git

      # 或者设置远程地址时带上用户名
      git remote set-url origin http://你的用户名@113.240.68.17:29919/code/PVMonitor-web-cloud.git
      git fetch

      # 基于远程的 dev 分支创建本地 dev 分支，并自动切换到 dev 分支
      git checkout -b dev origin/dev

      git config --global user.name "你的姓名"
      git config --global user.email "你的邮箱@example.com"

      git remote add origin http://jw01@113.240.68.17:29919/web/datacapture-web.git

  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  