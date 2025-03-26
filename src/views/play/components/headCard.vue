<template>
    <div class="shopCard">
       <div class="topCard">
          <div class="moveBox" v-for="(a,i) in list.items" :key="i" :style="{left: i*33 + '%',width: i === 2 ?'34%':'33%'}" @click="changeShop(i)">
             <div class="imgBox">
                <img src="/img/game/gold.png" alt="" style="height: 75px;width: auto;margin-top: -20px;"
                v-if="activeIndex === 0 && i === 0">
                <img :src="a.img" alt="" style="width: auto;margin-top: -20px;"
                :style="{filter: activeIndex === i ? 'invert(100%)' : '',
                height: activeIndex === i ? '75px' : '45px'}"
                v-else>
             </div>
             <div class="textBox"
             :style="{
             color: activeIndex === i ? '#e4a221' : '#b5c4cb',
             fontWeight: activeIndex === i ? 'bold' : '',
             fontSize: activeIndex === i ? '22px' : ''
             }">{{ a.title }}</div>
          </div>
       </div>
       <div class="contentCard" :style="{justifyContent: nowData.length > 1 ? 'space-around' : 'start'}">
         <div v-for="(a,i) in nowData" :key="i" class="cardBox"
         :style="{borderColor:a.color ? a.color : ''}">
            <img :src="a.img" alt="" style="width: 100%;height: 130px;border-top-left-radius: 10px;border-top-right-radius: 10px;">
            <div style="flex: 1;color: #d3d9da;display: flex;align-items: center;">
                <h2>{{ a.price }}</h2>
                <img :src="list.items[activeIndex].shopImg" alt="" :style="{width:activeIndex === 2 ? '50px' : '30px'}" style="height: auto;margin-left: 10px;">
            </div>
         </div>
       </div>
  
  
    </div>
  </template>
  <script setup lang="ts">
  import {ref,reactive, onMounted, Ref} from "vue"
  
  
  const activeMethods = ref(0)
  const activeIndex = ref(0);
  const nowData:Ref<any[], any[]> = ref([]);
  const list = reactive({
    items:[
        { title:'金币兑换',type:'gold',img:'/img/game/gold2.png',shopImg:'/img/game/money.png',
            data:[
                // { price:500,img:'/img/game/data/user1.png',color:'#73c998'},
                // { price:100,img:'/img/game/data/user2.png',color:'#4c1b15'},
                // { price:100,img:'/img/game/data/user3.png',color:'#974a24'},
                // { price:100,img:'/img/game/data/user4.png',color:'#613c16'},
            ]
        },
        { title:'积分兑换',type:'score',img:'/img/game/score.png',shopImg:'/img/game/circle.png',
            data:[
                { price:500,img:'/img/game/data/user5.png'}
            ]
        },
        { title:'钻石兑换',type:'money',img:'/img/game/zs.png',shopImg:'/img/game/zs.png',
            data:[
                { price:500,img:'/img/game/data/user6.png'}
            ]
        },
    ]
  })
  const changeShop = (i:number)=>{
    activeIndex.value = i;
    nowData.value = list.items[i].data;
  }
  
  onMounted(()=>{
    nowData.value = list.items[activeIndex.value].data;
  })
  
  </script>
  <style lang="scss" scoped>
  .shopCard{
    font-family: Roboto, sans-serif;
    .topCard{
      width: 100%;
      height: 50px;
      position: relative;
      cursor: pointer;
      box-shadow: 1px 0 5px #5c35c3;
      border: 1px solid #d0ecff;
      border-radius: 10px;
      .moveBox{
        position: absolute;
        top: 0;
        left: 0;
        width: 33%;
        height: 50px;
        display: flex;
        color:#cee6ff;
        background-color: rgba(#020105, 0.5);
        transition: transform 0.3s ease;
        .imgBox{
          display: flex;
          align-items: center;
          justify-content: center;
          height: 70px;
         
        }
        .textBox{
          display: flex;
          align-items: center;
          font-size: 18px;
          letter-spacing: 5px;
          margin-left: 16px;
          text-shadow: 1px 0 1px #2cdd71;
        }
        :hover{
            color: #e4a221 !important;
            font-weight: bold;
        }
        
      }
    }
    .contentCard{
        margin-top: 20px;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        justify-content: start;
        .cardBox{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            width: 130px;
            height: 180px;
            border: 1px solid #ccc;
            border-radius: 10px;
            padding: 1px;
            padding-bottom: 10px;
            cursor: pointer;
            // animation: card 1s infinite alternate;  循环动画
            animation: card 1s 1 alternate; 
        }
    }
  }
  
  @keyframes card {
    0%{
        transform: rotate(0);
    }
    10%{
        left: calc(50% - 25px);
    }
    50%{
       left:70%;
    }
    90%{
        left: calc(50% - 25px);
    }
    100%{
        left: calc(50% - 25px);
        transform: rotate(360deg);
    }
}
  
  </style>
  