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
            height:role.h * unitY + 'px'
        }">
         <img src="/img/moonlight/role.png" alt="" class="img">
      </div>
      
  
    </div>
  </template>
<script setup lang="ts">
import { ref,reactive,computed,onMounted,onUnmounted } from "vue"
import { KEY } from '@/constants/key.ts';


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
const role = reactive({
    x: 1,
    y: 1,
    w: 1,
    h: 2,

})

// 按下
const handleKeyDown = (event:any) => {
    if(!event.key) return
    // 判断一个数是不是在数组中
    if(KEY['UP'].includes(event.key)){

    }else if(KEY['DOWN'].includes(event.key)){

    }else if(KEY['LEFT'].includes(event.key)){

    }else if(KEY['RIGHT'].includes(event.key)){

    }
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
  }
  
  
  
  </style>
  