<script>
import store from './store'
import { baseURL } from './common/requestPackage.js'
import cacheRules from './cacheRules.js';
export default {
  store,
  data () {
    return {
    }
  },
  computed: {
    // 获取当前字体大小模式
    fontSizeClass () {
      return `font-size-${this.$store.state.fontSize.current}`
    }
  },
  watch: {
    // 监听字体大小变化并更新根元素的class
    fontSizeClass: {
      immediate: true,
      handler (newClass, oldClass) {
        // #ifndef MP-WEIXIN
        // if (oldClass) {
        //   document.documentElement.classList.remove(oldClass)
        // }
        // if (newClass) {
        //   document.documentElement.classList.add(newClass)
        // }
        // #endif
      }
    }
  },
  onLaunch: function () {
    // app.js
    if (wx.onNetworkWeakChange) {
      wx.onNetworkWeakChange((res) => {
        console.log('弱网状态变更:', res);
        // res.currentIsWeakNetwork: boolean
        // res.networkType: string (wifi/4g/...)

        if (res.currentIsWeakNetwork) {
          wx.showToast({ title: '网络信号弱，自动开启省流模式', icon: 'none' });
          // 可以在这里设置全局变量，让图片组件自动降级为低清图
          getApp().globalData.isWeakNet = true;
        } else {
          getApp().globalData.isWeakNet = false;
        }
      });
    }
    // 创建缓存管理器
    const cacheManager = wx.createCacheManager({
      origin: baseURL.replace('/api', ''),
      // mode: 'always'
    });
    const ids = cacheManager.addRules(cacheRules);

    // 监听符合规则的 wx.request 请求，默认在弱网时调用 wx.request 即会触发
    cacheManager.on('request', evt => {
      // console.log(evt)
      return new Promise((resolve, reject) => {
        // 匹配是否存在缓存
        const matchRes = cacheManager.match(evt)
        if (matchRes && matchRes.data) {
          console.group('缓存命中 ' + evt.url)
          console.log(matchRes)
          console.groupEnd('缓存命中 ' + evt.url)
          // 使用缓存返回
          resolve(matchRes.data)
        } else {
          console.log('缓存未命中 ' + evt.url)
          // 没有匹配到缓存
          reject({ errMsg: `catch not found: ${evt.url}` })
        }
      })
    })
    // wx.setBackgroundFetchToken({
    //   token: '9ee58825-2345-4cb5-9856-3744482daba6'
    // })
    // wx.getBackgroundFetchData({
    //   fetchType: 'periodic',
    //   success(res) {
    //     console.log(res.fetchedData) // 缓存数据
    //     console.log(res.timeStamp) // 客户端拿到缓存数据的时间戳
    //   }
    // })
    // 初始化字体大小配置
    this.$store.commit('initFontSize')
  },
  onShow: function () {
    // uni.getSystemInfo({
    //   success: function (res) {
    //     if (res.osName == "ios") {
    //       uni.onUserCaptureScreen(function () {
    //         uni.showToast({
    //           title: "当前页面不允许截屏",
    //           duration: 2000,
    // 					icon: 'none'
    //         });
    //       });
    //     }
    //   },
    // });
    // #ifdef MP-WEIXIN
    // if (wx.setVisualEffectOnCapture) {
    //   wx.setVisualEffectOnCapture({
    //     visualEffect: "hidden",
    //     complete: function (res) {},
    //   });
    // }
    // #endif
  },
  onHide: function () {
    // #ifdef MP-WEIXIN
    // if (wx.setVisualEffectOnCapture) {
    //   wx.setVisualEffectOnCapture({
    //     visualEffect: "none",

    //     complete: function (res) {},
    //   });
    // }
    // #endif
  },
  onUnload () {
    // #ifdef MP-WEIXIN
    // if (wx.setVisualEffectOnCapture) {
    //   wx.setVisualEffectOnCapture({
    //     visualEffect: "none",

    //     complete: function (res) {},
    //   });
    // }
    // #endif
  },
};
</script>

<style>
/*每个页面公共css */
@import './style/index.scss';

/* 全局字体大小过渡效果 */
html,
body {
  transition: font-size 0.3s ease;
}

/* iOS安全区域适配 */
page {
  padding-top: var(--safe-area-inset-top);
  padding-bottom: var(--safe-area-inset-bottom);
  padding-left: var(--safe-area-inset-left);
  padding-right: var(--safe-area-inset-right);
  box-sizing: border-box;
  background-color: #f5f5f5;
  position: relative !important;
  top: 0px !important;
}
</style>
