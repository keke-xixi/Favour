<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
      同源：
       源 = 协议 + 域名 + 端口  （例如： http://a.com:80/a  和  http://a.com:80/c/b 同源）
      不同源：
        请求地址：http://a.com:80/a  和  http://b.com:80/b   请求资源标签、css、js、ajax（限制最严重）请求 会跨域

      cors请求：

      示例：
      fetch('http://b.com:80/b', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ a: 1, b: 2 }
        })

        headers: {}
          Origin: http://a.com:80  // 请求源
          Access-Control-Allow-Origin: *  // 允许所有域名访问  （一般不使用）
          Access-Control-Allow-Origin: http://a.com:80  // 允许指定域名访问
          Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS  // 允许请求方法
          Access-Control-Allow-Headers: Content-Type  // 允许请求头
          Access-Control-Allow-Credentials: true  // 允许发送cookie

        简单请求：
          1.请求方式：get、post、head
          2.请求头：Content-Type（仅限三个值：application/x-www-form-urlencoded、multipart/form-data、text/plain）
          3.头部字段满足CORS安全规范，详见：https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Headers

        非简单请求：
          1.请求方式：put、delete、patch
          2.请求头：Content-Type（除了三个值：application/x-www-form-urlencoded、multipart/form-data、text/plain）
          3.头部字段不满足CORS安全规范
          4.请求地址：http://a.com:80/a  和  http://b.com:80/b   请求资源标签、css、js、ajax（限制最严重）请求 会跨域


        JSONP
          1.利用script标签的src属性，可以请求跨域资源
          2.服务器返回一个函数调用，函数名和参数都是服务器返回的
          3.客户端定义一个函数，函数名和服务器返回的一致，函数参数就是服务器返回的数据
          4.服务器返回的函数调用，会被客户端执行，从而获取到服务器返回的数据

          function request(url) {
              const script = document.createElement('script');
              script.src = url;
              script.onload = () => {
                  script.remove();
              }
              document.body.appendChild(script);
          }

          request('http://localhost:3000?callback=fn')

  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  