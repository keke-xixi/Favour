<template>
    <view class="container">
        <view style="position: fixed;top: 20%;">{{ qrContent }}</view>
        <qrcode-vue
          :value="qrContent" 
          :size="200" 
          class="qr-code"
        ></qrcode-vue>
    </view>
  </template>
  
  <script>
  // 直接import引入（支持ES6模块）
  import QrcodeVue from 'qrcode.vue'
  
  export default {
    components: {
      QrcodeVue // 注册组件
    },
    data() {
      return {
        qrContent: ''
      }
    },
    onShow(){
       let qrCode = uni.getStorageSync("qrCode");
       console.log(qrCode,'qrCode')
       this.qrContent = qrCode || ""
    },
    methods: {
      
    }
  }
  </script>
  
  <style scoped>
  .container {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f8f8f8;
  }
  .qr-code { 
      margin: auto;
  }
  </style>