<template>
    <view class="container">
  
      <!-- 操作按钮 -->
     <!-- <view class="action-buttons">
        <button 
          class="btn primary" 
          :class="{ disabled: !qrContent }" 
          @tap="generateQRCode"
        >
          <text class="btn-text">生成二维码</text>
        </button>
      </view> -->
      
      <!-- 二维码显示区域 -->
      <view class="card qrcode-card" v-if="showQRCode">
        <view class="card-header">
          <text class="card-title">生成的二维码</text>
          <!-- <text class="card-subtitle">{{ qrContent }}</text> -->
        </view>
        
        <view class="qrcode-wrapper">
          <canvas 
            class="qrcode-canvas" 
            canvas-id="qrcodeCanvas" 
            :style="{ 
              width: canvasSize + 'px', 
              height: canvasSize + 'px',
              opacity: qrCodeLoaded ? 1 : 0
            }"
          />
          <view class="qrcode-loading" v-if="!qrCodeLoaded">
            <text class="loading-text">生成中...</text>
          </view>
        </view>
  
      </view>
      
      <!-- 提示信息 -->
  <!--    <view v-if="message.text" class="message" :class="message.type">
        <text class="message-text">{{ message.text }}</text>
      </view> -->
      
    </view>
  </template>
  
  <script>
  import QRCode from './js/qrcode.js';
  
  export default {
    data() {
      return {
        qrContent: '1111',
        showQRCode: false,
        qrCodeLoaded: false,
        canvasSize: 280,
        message: {
          text: '',
          type: ''
        },
        qrCodeInstance: null
      };
    },
    onShow(){
         let qrCode = uni.getStorageSync("qrCode");
         console.log(qrCode,'qrCode')
         this.qrContent = qrCode || ""
       if(this.qrContent) {
           this.generateQRCode()
       }
    },
    methods: {
      // 生成二维码
      async generateQRCode() {
        if (!this.qrContent) {
          this.showMessage('请输入1-50个字符的内容', 'error');
          return;
        }
        
        try {
          this.showQRCode = true;
          this.qrCodeLoaded = false;
          this.showMessage('正在生成二维码...', 'info');
          
          // 创建二维码实例
          this.qrCodeInstance = new QRCode({
            size: this.canvasSize,
            margin: 10,
            backgroundColor: '#FFFFFF',
            foregroundColor: '#000000'
          });
          
          // 生成二维码
          await this.qrCodeInstance.makeCode(this.qrContent, 'qrcodeCanvas', this);
          
          this.qrCodeLoaded = true;
          this.showMessage('二维码生成成功！', 'success');
          
        } catch (error) {
          console.error('生成二维码失败:', error);
          this.showMessage('生成失败，请重试', 'error');
          this.showQRCode = false;
        }
      },
      // 保存二维码
      async saveQRCode() {
        if (!this.qrCodeInstance) {
          this.showMessage('请先生成二维码', 'error');
          return;
        }
        
        try {
          this.showMessage('正在保存...', 'info');
          
          // 检查相册权限
          const authStatus = await this.checkPhotoAuth();
          if (!authStatus) {
            this.showMessage('需要相册权限才能保存', 'error');
            return;
          }
          
          // 保存到相册
          const filePath = await this.qrCodeInstance.saveToPhotosAlbum('qrcodeCanvas', this);
          
          this.showMessage('保存成功！', 'success');
          
        } catch (error) {
          console.error('保存失败:', error);
          if (error.errMsg && error.errMsg.includes('auth deny')) {
            this.showMessage('无相册权限，请在设置中开启', 'error');
            this.openSetting();
          } else {
            this.showMessage('保存失败，请重试', 'error');
          }
        }
      },
   
      // 检查相册权限
      checkPhotoAuth() {
        return new Promise((resolve) => {
          uni.getSetting({
            success: (res) => {
              if (res.authSetting['scope.writePhotosAlbum'] === false) {
                // 已拒绝授权，需要引导用户开启
                uni.showModal({
                  title: '需要相册权限',
                  content: '需要您授权访问相册才能保存二维码图片',
                  confirmText: '去授权',
                  success: (modalRes) => {
                    if (modalRes.confirm) {
                      this.openSetting();
                    }
                    resolve(false);
                  }
                });
              } else {
                resolve(true);
              }
            },
            fail: () => resolve(false)
          });
        });
      },
      
      // 打开设置页面
      openSetting() {
        uni.openSetting({
          success: (res) => {
            console.log('授权设置结果:', res);
          }
        });
      },
      
      showMessage(text, type = 'info') {
        this.message = { text, type };
        if (type === 'success' || type === 'error') {
          setTimeout(() => {
            this.hideMessage();
          }, 3000);
        }
      },
      
      hideMessage() {
        this.message = { text: '', type: '' };
      }
    }
  };
  </script>
  
  <style scoped lang="scss">
  .container {
    padding: 32rpx;
    min-height: 100vh;
  }
  
  .header {
    text-align: center;
    margin-bottom: 48rpx;
    padding-top: 40rpx;
  }
  
  .title {
    display: block;
    font-size: 48rpx;
    font-weight: bold;
    color: white;
    margin-bottom: 16rpx;
  }
  
  .subtitle {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .card {
    background: white;
    border-radius: 24rpx;
    padding: 32rpx;
    margin-bottom: 32rpx;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    margin-bottom: 24rpx;
  }
  
  .card-title {
    display: block;
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 8rpx;
  }
  
  .card-subtitle {
    font-size: 26rpx;
    color: #666;
  }
  
  .input-wrapper {
    position: relative;
  }
  
  .input {
    width: 100%;
    height: 200rpx;
    font-size: 32rpx;
    line-height: 1.5;
    border: 2rpx solid #e1e5e9;
    border-radius: 16rpx;
    padding: 24rpx;
    box-sizing: border-box;
    transition: all 0.3s;
  }
  
  .input:focus {
    border-color: #007AFF;
    background: white;
  }
  
  .placeholder {
    color: #999;
  }
  
  .input-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16rpx;
  }
  
  .char-count {
    font-size: 26rpx;
    color: #999;
  }
  
  .char-count.warning {
    color: #ff6b35;
    font-weight: 600;
  }
  
  .clear-btn {
    font-size: 26rpx;
    color: #007AFF;
    padding: 8rpx 16rpx;
  }
  
  .action-buttons {
    margin-bottom: 32rpx;
  }
  
  .btn {
    width: 100%;
    height: 96rpx;
    border-radius: 48rpx;
    font-size: 32rpx;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    border: none;
    position: relative;
  }
  
  .btn:after {
    border: none;
  }
  
  .btn.primary {
    background: linear-gradient(135deg, #007AFF, #0056CC);
    color: white;
  }
  
  .btn.primary.disabled {
    background: #ccc;
    color: #666;
  }
  
  .btn.secondary {
    background: #34C759;
    color: white;
  }
  
  .btn.outline {
    background: transparent;
    border: 2rpx solid #007AFF;
    color: #007AFF;
  }
  
  .btn-text {
    font-weight: 600;
  }
  
  .qrcode-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 320rpx;
    border-radius: 16rpx;
    margin-bottom: 24rpx;
  }
  
  .qrcode-canvas {
    border: 1rpx solid #e1e5e9;
    border-radius: 12rpx;
    transition: opacity 0.3s;
  }
  
  .qrcode-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(248, 249, 250, 0.9);
  }
  
  .loading-text {
    font-size: 28rpx;
    color: #666;
  }
  
  .qrcode-actions {
    display: flex;
    gap: 20rpx;
  }
  
  .qrcode-actions .btn {
    flex: 1;
  }
  
  .message {
    padding: 24rpx;
    border-radius: 16rpx;
    margin-bottom: 24rpx;
    text-align: center;
  }
  
  .message.info {
    background: #e3f2fd;
    color: #1976d2;
  }
  
  .message.success {
    background: #e8f5e8;
    color: #2e7d32;
  }
  
  .message.error {
    background: #ffebee;
    color: #c62828;
  }
  
  .message-text {
    font-size: 28rpx;
    font-weight: 500;
  }
  
  .help-content {
    padding: 8rpx 0;
  }
  
  .help-item {
    display: block;
    font-size: 28rpx;
    color: #666;
    margin-bottom: 16rpx;
    line-height: 1.5;
  }
  
  .help-item:last-child {
    margin-bottom: 0;
  }
  </style>