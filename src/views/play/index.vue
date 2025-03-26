<template>
  <div class="playCard" >
     <el-card class="table-card !border-[#16825d]" body-style="border: none;">
      <h2 class="shop-title">游戏商城</h2>
       <el-row :gutter="20">
         <el-col :span="6">
             <div v-for="(a,i) in activeList.items" :key="i" @click="active = i" class="list-box"
             :style="{color:active === i ? '#ffd013' : '',boxShadow: active === i ? '0 4px 10px #ffd013,0 -4px 10px #ffd013':''}">
                <div style="display: flex;justify-content: center;align-items: center;margin-right: 16px;padding: 10px;margin-left: 16px;">
                  <img :src="a.img" alt="" style="width: 60px;height: 60px;">
                </div>
                <h3 class="text-white font-bold leading-[40px] p-[10px]">{{ a.name }}</h3>
             </div>
         </el-col>
         <el-col :span="18">
                <head-card v-if="active === 0"/>
                <money-card v-if="active === 1"/>
                <game-card v-if="active === 2"/>
        </el-col>
       </el-row>
     </el-card>
  </div>
</template>
<script setup lang="ts">
import {ref,reactive} from "vue"
import gameCard from "./components/gameCard.vue";
import headCard from "./components/headCard.vue";
import moneyCard from "./components/moneyCard.vue";

const active = ref(0);
const activeList = reactive({
  items:[
    {
       name:'头像',
       img:'/img/game/hy.png'
    },
    {
       name:'金币',
       img:'/img/game/money.png'
    },
    {
       name:'卡片',
       img:'/img/game/kt.png'
    },
  ]
})

</script>
<style lang="scss" scoped>
.playCard{
  padding: 20px 40px;
  .table-card{
    background-color: #191919;
    padding: 0 !important;
    height: calc(100vh - 100px);
  }
}
.list-box{
  display: flex;
  margin-top: 16px;
  width: 180px;
  align-items: center;
  cursor: pointer;
  position: relative;
  border-radius: 8px;
  color: #edf2fa;
  border-bottom: 1px solid #edf2fa;
  border-top: 1px solid #edf2fa;
  &:hover{
    color: #ffd013;
    box-shadow: 
                0 4px 10px #ffd013,  /* 下边框阴影 */
                0 -4px 10px #ffd013; /* 上边框阴影 */
    // ::after{
    //   content: '';
    //   position: absolute;
    //   left: 0;
    //   top: 0;
    //   width: 2px;
    //   height: 100%;
    //   background-color: #3699fd;
    //   translate: all 0.3s ease-in-out;
    // }
    
  }
  .left-box{
    position: absolute;
    left: 0;
    top: 0;
    width: 2px;
    height: 100%;
    background-color: #3699fd;
    display: none;
  }
}
.shop-title{
  color: #ffcd01;
  font-family: 'MyCustomFont', sans-serif;
  text-align: center;
  margin-top: 0;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); /* 字体阴影 */
  transition: max-height 0.5s ease; /* 动画效果 */
  font-size:28px;
  font-weight:bolder; 
  -webkit-text-stroke:1px #eee4da;
  -webkit-text-fill-color:transparent;  

}

</style>
