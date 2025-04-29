<template>
    <div class="content" ref="content">
  
      <!-- <div class="layer1"></div>
      <div class="layer2"></div>
      <div class="layer3"></div>
      <div class="layer4"></div>
      <div class="layer5"></div>
      <div class="z-title"></div> -->
  
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

// 帧数
const FPS = ref(120)

// 整个屏幕实例
const content:any = ref(null)
const widthNum = ref(15)  // 宽度 分为 10个格子
const heightNum = ref(15) // 高度 分为 10个格子

const unitX = computed(() => {
   return content.value ? (content.value.offsetWidth / widthNum.value) : 0; // content.value.offsetWidth  整个屏幕宽度
})
const unitY = computed(() => {
   return content.value ? (content.value.offsetHeight / heightNum.value) : 0; // content.value.offsetWidth  整个屏幕高度
})

// 角色
const role = reactive<any>({
    x: 1, // 初始横坐标 1 格 
    y: 1, // 初始纵坐标 1 格
    w: 1, // 宽度 1 格
    h: 2, // 高度 2 格
    jumpStatus: false, // 是否跳跃
    jumpSecondStatus: false, // 是否 二段 跳跃
    transition: 0.1, // 移动过渡效果
   // 匀速运动（如进度条）	linear  自然动作（如按钮悬停）	ease 或 ease-in-out  物体减速（如刹车）	ease-out  离散动画（如幻灯片切换）	steps(n) 特殊弹性效果	cubic-bezier()
    method: 'ease', // 过渡效果  ease
    timer: null, // 定时器
    speed: 8, // 左右移动速度
    moveXDistance: 1, // 左右移动距离
    jumpTime: 1.5, // 跳跃时间 s
    jumpHeight: 3, // 跳跃高度 格
    jumpYSpeed: 12, // 跳跃时候上下方向速度 
    jumpXSpeed: 0, // 跳跃时候左右方向速度 默认是 0 跳跃的时候按 左 右 键会左右移动
    jumpXSpeedValue: 5, // 跳跃时候左右方向每次移动距离  和 jumpYSpeed 数值类似
    jumpYDirection: 'top', // 跳跃时候上下方向  top / down
    jumpXDirection: 'right', // 跳跃时候左右方向  left / right


})

// 存储上次角色信息
const initialRole:any = ref(null);

// 按下
const handleKeyDown = (event:any) => {
    if(!event.key) return
    // 判断一个数是不是在数组中
    let originRole = cloneDeep(role)
    if(KEY['UP'].includes(event.key)){
        if(!role.jumpStatus) {
            initialRole.value = cloneDeep(role);
            role.jumpYDirection = 'top';
            !role.moveStatus && jump(originRole);
        }else if(!role.jumpSecondStatus && initialRole.value){
            role.jumpYDirection = 'top';
            role.jumpHeight = role.y + role.jumpHeight;
            !role.moveStatus && jumpSecond(cloneDeep(initialRole.value));
        }
    }else if(KEY['DOWN'].includes(event.key)){
        if(role.jumpStatus) {
            return
        }
        role.y-=2;
    }else if(KEY['LEFT'].includes(event.key)){
        role.jumpXDirection = 'left';
        role.jumpXSpeed = role.jumpXSpeedValue;
        !role.jumpStatus && move(originRole);
    }else if(KEY['RIGHT'].includes(event.key)){
        role.jumpXDirection = 'right';
        role.jumpXSpeed = role.jumpXSpeedValue;
        !role.jumpStatus && move(originRole);
    }else if(KEY['JUMP'].includes(event.key)){  // 跳跃
        
    }
}

// 松开
const onKeyUp = (event:any) => {
    if(!event.key) return
    // 判断一个数是不是在数组中
    let originRole = cloneDeep(role)
    if(KEY['UP'].includes(event.key)){
        
    }else if(KEY['DOWN'].includes(event.key)){
        
    }else if(KEY['LEFT'].includes(event.key)){
        role.jumpXDirection = 'left';
        role.jumpXSpeed = 0;
        return;
    }else if(KEY['RIGHT'].includes(event.key)){
        role.jumpXDirection = 'right';
        role.jumpXSpeed = 0;
        return;
    }else if(KEY['JUMP'].includes(event.key)){  // 跳跃
        
    }

}

// 跳跃 最高距离是 role.jumpYSpeed
const jump = (originRole?:any) => {
    role.jumpStatus = true;
    role.y += role.jumpYSpeed / FPS.value
    role.transition = role.jumpTime / FPS.value;
    role.timer = setInterval(() => {
        if(Math.abs(role.y - originRole.y) >= role.jumpHeight) {
            clearInterval(role.timer);
            down(originRole);
            return
        }
        // 同时修改 left 和 top 会触发 一次连贯动画  浏览器优化策略
        role.jumpYDirection === 'top' ? role.y += role.jumpYSpeed / FPS.value : role.y -= role.jumpYSpeed / FPS.value;
        role.jumpXDirection === 'right' ? role.x += role.jumpXSpeed / FPS.value : role.x -= role.jumpXSpeed / FPS.value;
    },role.jumpTime * 1000 / FPS.value)
}

// 二段跳跃 最高距离是 role.y + role.jumpYSpeed
const jumpSecond = (originRole?:any) => {
    clearInterval(role.timer);  // 清除上一次的定时器 一段跳跃
    role.jumpStatus = true;
    role.jumpSecondStatus = true;
    role.timer = setInterval(() => {
        if(Math.abs(role.y - originRole.y) >= role.jumpHeight) {
            role.jumpHeight = originRole.jumpHeight;
            clearInterval(role.timer);
            down(originRole);
            return
        }
        // 同时修改 left 和 top 会触发 一次连贯动画  浏览器优化策略
        role.jumpYDirection === 'top' ? role.y += role.jumpYSpeed / FPS.value : role.y -= role.jumpYSpeed / FPS.value;
        role.jumpXDirection === 'right' ? role.x += role.jumpXSpeed / FPS.value : role.x -= role.jumpXSpeed / FPS.value;
    },role.jumpTime * 1000 / FPS.value)
}

// 下落
const down = (originRole?:any) => {
    role.jumpYDirection = 'down';
    role.timer = setInterval(() => {
        if(role.y <= originRole.y) {
            role.jumpStatus = false;
            role.jumpSecondStatus = false;
            clearInterval(role.timer)
            return
        }
        // 同时修改 left 和 top 会触发 一次连贯动画  浏览器优化策略
        role.jumpYDirection === 'top' ? role.y += role.jumpYSpeed / FPS.value : role.y -= role.jumpYSpeed / FPS.value;
        role.jumpXDirection === 'right' ? role.x += role.jumpXSpeed / FPS.value : role.x -= role.jumpXSpeed / FPS.value;
    },role.jumpTime * 1000 / FPS.value)
}

// 左右移动
const move = (originRole?:any) => {
    role.moveStatus = true;
    role.timer = setInterval(() => {
        if(Math.abs(role.x - originRole.x) >= role.moveXDistance) {
            role.moveStatus = false;
            clearInterval(role.timer)
            return
        }
        role.jumpXDirection === 'right' ? role.x += role.speed / FPS.value : role.x -= role.speed / FPS.value;
    },1000 / FPS.value)
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
    //   background-color: #0883d8;
      position: relative;
      .role{
        position: absolute;
        // transition: all 0.3s ease;
      }
  }
  
  
  
  </style>
  