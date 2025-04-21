<template>
    <div class="content" ref="content">
  
      <div class="layer1"></div>
      <div class="layer2"></div>
      <div class="layer3"></div>
      <div class="layer4"></div>
      <div class="layer5"></div>
      <div class="z-title"></div>
  
      <div class="role"  :style="{
            left:role.x * unitX + 'px',
            bottom:role.y * unitY + 'px',
            width:role.w * unitX + 'px',
            height:role.h * unitY + 'px',
            transition:  `top ${role.transition}s ${role.method}, 
                left ${role.transition}s ${role.method}, 
                right ${role.transition}s ${role.method}, 
                bottom ${role.transition}s ${role.method}`,
            animation: role.animation,
        }">
         <img src="/img/moonlight/role.png" alt="" class="img">
      </div>
      
  
    </div>
  </template>
<script setup lang="ts">
import { ref,reactive,computed,onMounted,onUnmounted } from "vue"
import { KEY } from '@/constants/key.ts';
import cloneDeep from 'lodash/cloneDeep';


// 整个屏幕实例
const content:any = ref(null)
const widthNum = ref(10)
const heightNum = ref(10)

const unitX = computed(() => {
   return content.value ? (content.value.offsetWidth / widthNum.value) : 0; // content.value.offsetWidth  整个屏幕宽度
})
const unitY = computed(() => {
   return content.value ? (content.value.offsetHeight / heightNum.value) : 0; // content.value.offsetWidth  整个屏幕高度
})

// 角色
const role = reactive<any>({
    x: 1,
    y: 1,
    w: 1,
    h: 2,
    jumpStatus: true, // 是否跳跃
    transition: 0.1, // 移动过渡效果
   // 匀速运动（如进度条）	linear  自然动作（如按钮悬停）	ease 或 ease-in-out  物体减速（如刹车）	ease-out  离散动画（如幻灯片切换）	steps(n) 特殊弹性效果	cubic-bezier()
    method: 'ease', // 过渡效果  ease
    timer: null, // 定时器

})

// 按下
const handleKeyDown = (event:any) => {
    if(!event.key) return
    // 判断一个数是不是在数组中
    let originRole = cloneDeep(role)
    if(KEY['UP'].includes(event.key)){
        
    }else if(KEY['DOWN'].includes(event.key)){
        role.y-=2;
    }else if(KEY['LEFT'].includes(event.key)){
        
    }else if(KEY['RIGHT'].includes(event.key)){
       
    }else if(KEY['JUMP'].includes(event.key)){
        jump(originRole)
    }
}

// 跳跃 最高距离是 2，最远距离是 2
const jump = (originRole?:any) => {
    role.timer = setInterval(() => {
        if(role.y - originRole.y >= 2) {
            clearInterval(role.timer)
            return
        }
        role.transition = 0.1
        role.y += 0.5
    },100)
    
}

// 松开
const onKeyUp = (event:any) => {
    if(!event.key) return

}

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', onKeyUp);
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', onKeyUp);
})

  
  </script>
  <style lang="scss" scoped>
  .content{
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #0883d8;
      position: relative;
      .role{
        position: absolute;
        // transition: all 0.3s ease;
      }
  }
  
  
  
  </style>
  