<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
      onLoad、onShow、onReady 等是页面生命周期函数，只在页面组件中有效  在自定义组件中无效

      预处理指令	
    // #ifdef H5	仅 Web 浏览器环境   
    // #ifdef APP-PLUS	App 端（安卓 + iOS）
    // #ifdef MP-WEIXIN	微信小程序环境
    // #ifdef MP-ALIPAY	支付宝小程序环境
    // #ifdef MP-BAIDU	百度小程序环境
    // #ifdef MP-TOUTIAO	字节跳动小程序环境
    // #ifdef MP-QQ	QQ 小程序环境
    // #ifdef MP-360	360 小程序环境
    // #ifdef MP	所有小程序环境
    // #ifdef H5 | MP-WEIXIN	Web 浏览器和小程序环境（微信小程序）
    // #endif	结束条件编译 (都要加)

    格式化代码快捷键
    Shift + Alt + F

    生命周期钩子	
    onLoad	页面加载时触发（可接收 query 参数，如 onLoad(options)）
    onShow	页面显示时触发（每次进入页面都会触发）
    onReady	页面初次渲染完成时触发（DOM 已准备好）
    onHide	页面隐藏时触发（如跳转到其他页面或进入后台）
    onUnload	页面卸载时触发（如 uni.navigateBack 或关闭页面）
    onPullDownRefresh	监听用户下拉刷新（需在 pages.json 中配置 "enablePullDownRefresh": true）
    onReachBottom	页面滚动到底部时触发（常用于上拉加载更多）
    onPageScroll	页面滚动时触发（可获取滚动距离 scrollTop）
    onResize	窗口尺寸变化时触发（如旋转屏幕）
    onTabItemTap	点击当前 tab 时触发（适用于 tabBar 页面）

    uni.navigateTo	保留当前页，跳转新页	新增一层	不触发 onUnload	需要返回原页面的场景
    uni.redirectTo	关闭当前页，跳转新页	替换当前页	触发 onUnload 	登录后重定向，不需返回
    uni.reLaunch	关闭所有页，打开新页	重置为只剩新页	触发所有页的onUnload	应用重启（如切换身份）
    uni.switchTab	跳转到TabBar页	关闭所有非Tab页	触发 非Tab页的onUnload	切换到底部导航栏页面
    uni.navigateBack	返回上一页或多页	减少层数（delta参数）	关闭的页面触发 onUnload	返回上级
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  