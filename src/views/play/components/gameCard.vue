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
       <div class="contentCard">
         <div v-for="(a,i) in nowData" :key="i" class="cardBox"
         :style="{borderColor:a.color ? a.color : '',boxShadow: `0 0.5px -0.5px ${a.color ? a.color : ''}`}">
            <img :src="a.img" alt="" style="width: 100%;height: 100px;border-top-right-radius: 10px;border-top-left-radius: 10px;">
            <div style="flex:1;display: flex;align-items: center;" :style="{color:a.color ? a.color : ''}">
                <h3>{{ a.price }}</h3>
                <img :src="list.items[activeIndex].shopImg" alt="" :style="{width:activeIndex === 2 ? '50px' : '30px'}" style="height: auto;margin-left: 10px;">
            </div>
         </div>
       </div>
  
  
    </div>
  </template>
  <script setup lang="ts">
  import {ref,reactive, onMounted, Ref} from "vue"
  
  
  const activeIndex = ref(0);
  const nowData:Ref<any[], any[]> = ref([]);
  const list = reactive({
    items:[
        { title:'金币兑换',type:'gold',img:'/img/game/gold2.png',shopImg:'/img/game/money.png',
            data:[
                { price:100,img:'/img/game/data/img1.png',color:'#73c998'},
                { price:200,img:'/img/game/data/img2.png',color:'#474084'},
                { price:300,img:'/img/game/data/img3.png',color:'#ad806d'},
                { price:400,img:'/img/game/data/img4.png',color:'#d06457'},
                { price:500,img:'/img/game/data/img5.png',color:'#e6b543'},
                { price:600,img:'/img/game/data/img6.png',color:'#ca6bab'},
                { price:700,img:'/img/game/data/img7.png',color:'#f4d7b2'},
                { price:800,img:'/img/game/data/img8.png',color:'#a2422b'},
                { price:900,img:'/img/game/data/img9.png',color:'#685e48'},
            ]
        },
        { title:'积分兑换',type:'score',img:'/img/game/score.png',shopImg:'/img/game/circle.png',
            data:[
               { price:1000,img:'/img/game/data/img10.png',color:'#c3a9d3'},
                { price:1100,img:'/img/game/data/img11.png',color:'#fbe6a2'},
                { price:1200,img:'/img/game/data/img12.png',color:'#d3d9da'},
            ]
        },
        { title:'钻石兑换',type:'money',img:'/img/game/zs.png',shopImg:'/img/game/zs.png',
            data:[
                { price:1300,img:'/img/game/data/img13.png',color:'#dc9b98'},
                { price:1400,img:'/img/game/data/img14.png',color:'#6e0e35'},
                { price:1500,img:'/img/game/data/img15.png',color:'#6e534e'},
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
        justify-content: flex-start; 
        .cardBox{
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0 16px 16px 0;
            width: 120px;
            height: 160px;
            border: 1px solid #ccc;
            border-radius: 10px;
            padding: 1px;
            cursor: pointer;
            animation: card 1s 1 alternate; 
        }
    }
  }
  
  @keyframes card {
     0% {
            transform: translateX(-1000px) rotate(-540deg);
            opacity: 0;
        }
        100% {
            transform: translateX(0) rotate(0deg);
            opacity: 1;
        }
      }
  
  </style>
  