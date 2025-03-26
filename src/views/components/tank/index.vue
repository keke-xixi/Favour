<template>
  <div class="mainContainer" v-if="start === false">
      <div class="back">
        <el-button @click="back" type="primary" class="primary" 
        style="background-color: #ef9951 !important;color: #606266 !important;font-weight: bold;">返回</el-button>
      </div>
      <div class="content">
          <div class="title">
            <img src="/img/tank/xc1.png" alt="" >
            <h1 style="font-size: 36px;">坦克大战</h1>
            <img src="/img/tank/xc1.png" alt="" >
          </div>
          <div class="start">
            <div style="width: 100%;padding: 10px;">
              <span style="font-size: 14px;text-decoration: underline;" class="tip">
                enemy tank
              </span>
            </div>
            <div v-for="item in tankList" :key="item.img" class="tank" @click="chooseIndex = item.id"
            :style="{border: chooseIndex == item.id ? '2px solid #ef9951' : ''}">
                 <img :src="item.img" alt="" style="width: 60px;height: 60px;">
            </div>
            <div style="width: 100%;padding: 10px;margin-top: 20px">
              <span style="font-size: 14px;text-decoration: underline;" class="tip">
                choose pass
              </span>
            </div>
            <div class="tank" style="width: 100%;">
               <div v-for="(item) in 10" :key="item" class="pass" @click="choosePass = item" style="padding: 10px;"
               :style="{border: choosePass == item ? '2px solid #ef9951' : ''}">
                 {{ item }}
               </div>
            </div>
            <div style="width: 100%;height: 60px;text-align: center;margin-top: 60px;">
              <el-button style="border:2px solid #30a6fb;background-color: #ef9951;font-weight: bold;width: 160px;height: 60px;font-size: 20px;" @click="startGame">开始游戏</el-button>
            </div>
          </div>
      </div>
      <div class="left-shop">
        <div style="height: 300px;display: flex;justify-content: space-around;flex-direction: column;margin-top: 100px;">
          <div>金币：{{ wealth.money }}</div>
          <div>积分：{{ wealth.score }}</div>
          <div>钻石：{{ wealth.diam }}</div>
        </div>
        <div>
          <el-button class="primary" style="color: #fff;" @click="settlement()" size="large">结 算</el-button>
        </div>
      </div>
      <div class="right-shop">
         <div v-for="item in tankList" :key="item.img" class="tank">
           <div v-if="chooseIndex === item.id" style="text-align: left;">
              <br/>
              <span>{{ item.name }}</span>
              <span style="margin-left: 30px;">{{ item.message }}</span>
           </div>
         </div>
         <div class="" v-for="item in 10" :key="item" style="margin-top: 100px;">
           <div v-if="choosePass === item" style="text-align: left;">
            <br/>
            第 {{ item }} 关
            <br/>
            金币：{{ (11 - item) }}
            <br/>
            积分：{{ item }}
            <br/>
            过关钻石掉落：{{ item }}
           </div>
         </div>
      </div>
      <div class="shopContent">
           <div class="z-text">SHOP</div>
           <div>
            <img src="/img/tank/shop.png" style="width: 60px;height: 60px;cursor: pointer;" alt="" @click="shopStatus = true"/>
           </div>
      </div>
      <div class="grass">
          <img src="/img/tank/xc2.png" alt="" style="width: 10%;height: auto;" v-for="i in 10" :key="i">
      </div>
  </div>
  <shopDialog v-model:show="shopStatus" @add="addKill"/>
  <first v-if="start && choosePass === 1" @back="start = false" @increase="increase" @reduce="reduce" @pass="pass" :wealth="wealth"/>
  <second v-if="start && choosePass === 2" @back="start = false" @increase="increase" @reduce="reduce" @pass="pass" :wealth="wealth"/>
  <third v-if="start && choosePass === 3" @back="start = false" @increase="increase" @reduce="reduce" @pass="pass" :wealth="wealth"/>
  <fourth v-if="start && choosePass === 4" @back="start = false" @increase="increase" @reduce="reduce" @pass="pass" :wealth="wealth"/>
  <five v-if="start && choosePass === 5" @back="start = false" @increase="increase" @reduce="reduce" @pass="pass" :wealth="wealth"/>
  <six v-if="start && choosePass === 6" @back="start = false" @increase="increase" @reduce="reduce" @pass="pass" :wealth="wealth"/>
  <seven v-if="start && choosePass === 7" @back="start = false" @increase="increase" @reduce="reduce" @pass="pass" :wealth="wealth"/>
  <eight v-if="start && choosePass === 8" @back="start = false" @increase="increase" @reduce="reduce" @pass="pass" :wealth="wealth"/>
  <nine v-if="start && choosePass === 9" @back="start = false" @increase="increase" @reduce="reduce" @pass="pass" :wealth="wealth"/>
  <ten v-if="start && choosePass === 10" @back="start = false" @increase="increase" @reduce="reduce" @pass="pass" :wealth="wealth"/>


</template>
<script setup lang="ts">
import {ref,reactive} from "vue"
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import first from "./components/first.vue";
import second from "./components/second.vue";
import third from "./components/third.vue";
import fourth from "./components/fourth.vue";
import five from "./components/five.vue";
import six from "./components/six.vue";
import seven from "./components/seven.vue";
import eight from "./components/eight.vue";
import nine from "./components/nine.vue";
import ten from "./components/ten.vue";
import { ElMessage } from "element-plus";
import shopDialog from "./components/shopDialog.vue";
const router = useRouter()
const store = useStore()

let wealth:any = reactive({
     money: 0,
     score: 0,
     diam: 0,
     kill1: 0,
     kill2: 0,
})
const shopStatus = ref(false)
const start = ref(false)
const chooseIndex = ref(0)
const tankList = ref([
  { name: '防御型', img: '/img/tank/tk3l.png',id: 1,message: '可爱'},
  { name: '速度型', img: '/img/tank/tk2l.png',id: 2,message: '上色了' },
  { name: '力量型', img: '/img/tank/tk5.png',id: 3,message: '刷积分的玩具' },
])

const choosePass = ref(0)
const startGame = () => {
    if(!choosePass.value){
      return ElMessage.warning({
        message: '请选择关卡'
      })
    };
    start.value = true
}
const pass = () => {
  if(choosePass.value === 10) {
      return
  } 
   choosePass.value += 1;
}
// 增加金币
const increase = (data:any) => {
  if(!data) return;
  if(data.type === 'money') wealth.money += data.num;
  if(data.type === 'score') wealth.score += data.num;
  if(data.type === 'diam') wealth.diam += data.num;
}
// 减少技能
const reduce = (data:any) => {
  if(!data) return;
  if(data.type === 'kill1') wealth.kill1 -= 1;
  if(data.type === 'kill2') wealth.kill2 -= 1;
}
// 购买技能
const addKill = (data:any) => {
  if(data.type === 'kill1') {
    wealth.kill1 += 1;
    ElMessage.success({
      message: '购买成功'
    })
  }
  if(data.type === 'kill2') {
    wealth.kill2 += 1;
    ElMessage.success({
      message: '购买成功'
    })
  }
}
// 结算
const settlement = () => {
     let userInfo:any = store.getters.getOnlineUser;
     userInfo.money += wealth.money;
     userInfo.score += wealth.score;
     userInfo.diam += wealth.diam;
     store.dispatch('updatePlayerInfo',userInfo);
     wealth.money = 0;
     wealth.score = 0;
     wealth.diam = 0;
     ElMessage.success({
       message: '结算成功'
     })
}
const back = () => {
  if(wealth.money > 0 || wealth.score > 0 || wealth.diam > 0){
    settlement()
  }
  store.dispatch('exitFullscreen');
  router.push('/home')
}


</script>
<style lang="scss" scoped>
.mainContainer{
  // background-color: #2a1f1f;
  background-color: #6d3333;
  position: relative;
  .left-shop{
    position: absolute;
    left: 0;
    top: 100px;
    width: 25%;
    height: 100%;
    color: #d5e9f0;
    text-indent: 2em;
  }
  .right-shop{
    position: absolute;
    right: 0;
    top: 200px;
    width: 20%;
    color: #d5e9f0;
    text-indent: 2em;
  }
  .shopContent{
    position: absolute;
    top: 30px;
    left: 30px;
    text-align: center;
    font-weight: bold;
  }
}
.content{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  .title{
    width: 700px;
    height: 100px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    letter-spacing: 5px;
    img{
      width: 240px;
      height: 50px;
    }
    h1{
      color: #d55926;
    }
  }
  .start{
    width: 800px;
    height: 120px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    .tank{
      width: 60px;
      height: 60px;
      padding: 10px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      .pass{
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        background-image: url('/img/game/xx.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 100% 100%;
        color:#001e36;
        font-weight: bold;
      }
    }
  }
}
.tip{
  font-size: 3rem; /* 主标题较大字体 */
  font-weight: 700; /* 使用加粗样式 */
  color: #333; /* 深灰色字体 */
  text-align: center;
  text-transform: uppercase; /* 大写字母 */
  letter-spacing: 2px; /* 字母间距 */
  background: linear-gradient(135deg, #f06, #f79); /* 渐变背景 */
  -webkit-background-clip: text; /* 渐变颜色应用于文字 */
  color: transparent; /* 文字颜色设置为透明，显示渐变效果 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  padding: 10px 0;
  margin: 20px 0;
}
.grass{
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  align-content: center;
}

</style>
