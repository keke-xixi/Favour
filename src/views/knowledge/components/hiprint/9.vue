<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
       Demo预览：[https://ccsimple.gitee.io/vue-plugin-hiprint/](https://ccsimple.gitee.io/vue-plugin-hiprint/)(已挂，恢复看gitee官方情况)

        Github Demo预览：[https://ccsimple.github.io/vue-plugin-hiprint/](https://ccsimple.github.io/vue-plugin-hiprint/)(慢，需翻墙)

        更新记录：[npm包版本及更新记录](CHANGELOG.md)

        打印客户端：[https://gitee.com/CcSimple/electron-hiprint](https://gitee.com/CcSimple/electron-hiprint)

        中转服务：[https://github.com/Xavier9896/node-hiprint-transit](https://github.com/Xavier9896/node-hiprint-transit)

        ## 文章链接

        入门篇: [【vue-plugin-hiprint】使用-入门篇](https://mp.weixin.qq.com/s/4N4f7CkxodA-fuTJ_FbkOQ)

        进阶篇: [【vue-plugin-hiprint】使用-进阶篇](https://mp.weixin.qq.com/s/LYZP2iqV0gy4m76mttplAw)

        provider: [【vue-plugin-hiprint】如何自定义可拖拽元素 provider](https://mp.weixin.qq.com/s/n9i1j8hhVJvnlfJRPRtWog)

        打印篇: [【vue-plugin-hiprint】使用-打印篇](https://mp.weixin.qq.com/s/P-Zz8YfELmRNi4EuED4QmA)

        参数篇: [【vue-plugin-hiprint】使用-参数篇](https://mp.weixin.qq.com/s/vfgSG62tAXn7Ot7y3x68fw)

        实战动态provider: [【vue-plugin-hiprint】实战-动态provider](https://mp.weixin.qq.com/s/UVkhul1tynjaUjdC_NaHfw)

        实战动态模板: [【vue-plugin-hiprint】实战-动态模板](https://mp.weixin.qq.com/s/JXXC9Fyy_PgPXrwh1mDBTQ)

        常见问题汇总①: [【vue-plugin-hiprint】常见问题汇总①](https://mp.weixin.qq.com/s/E-ZfuKLH3-GvKn4AosRvaw)

        常见问题汇总②: [【vue-plugin-hiprint】常见问题汇总②](https://mp.weixin.qq.com/s/UEnr24bB_P6KmpZ7iZmYvA)

        常见问题汇总③: [【vue-plugin-hiprint】常见问题汇总③](https://mp.weixin.qq.com/s/lRimQ-cjuwN3mg6RicPyag)

        ## 更多参数的文档请仔细查阅文档

        hiprint官方文档：[http://hiprint.io/docs/start](http://hiprint.io/docs/start)

        本人写的部分文档: [https://ccsimple.github.io/sv-print-docs/config/hiprint.html](https://ccsimple.github.io/sv-print-docs/config/hiprint.html)
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  