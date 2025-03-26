<template>
  <div class="underground" :style="mouseStyle" ref="content">
    <div class="mouse" :style="{
          left:mouse.x * unitX + 'px',
          top:mouse.y * unitY + 'px',
          width:mouse.w * unitX + 'px',
          height:mouse.h * unitY + 'px',
          transition: `all ${mouse.transition}s ${mouse.method}`
      }" >
          <img src="/img/mouse/s1.png" class="img" alt="">
      </div>
      <div class="wall" v-for="item in wall.list" :key="item.id" :style="{
          left:item.x * unitX + 'px',
          top:item.y * unitY + 'px',
          width:item.w * unitX + 'px',
          height:item.h * unitY + 'px',
          animation: item.animation || ''
      }">
        <img :src="item.img" class="img" alt="">
    </div>

  </div>
</template>
<script setup lang="ts">
import { ref,reactive, onMounted, onUnmounted, computed, watch } from "vue"
import { MOUSE_KEY } from '@/constants/key.ts'
import runTask from '@/assets/js/task.js'

const emit = defineEmits(['change']);
const props = defineProps({
  style: {
    type: Object,
    default: () => ({})
  },
  mouseData: {
    type: Object,
    default: () => ({})
  }
})
// 老鼠角色
let mouse:any = reactive({
    x: 0,
    y: 0,
    w: 8,
    h: 8,
    transition: 0.2, // 移动过渡效果
    method: 'linear', // 过渡效果
    speed: 5,  // 移动速度
    jumpHeight: 12, // 跳跃高度
    jumpCount: 0, // 跳跃次数
    jumpState: false, // 跳跃状态
    jumpTimer: null, // 定时器
})
// 墙壁
let wall:any = reactive({
   list:[
     
   ]
})
const mouseStyle = computed(() => {
  return props.style
})
const widthNum = ref(100);  // 长分成多少份
const heightNum = ref(50);  // 高分成多少份
// 游戏资源
const content:any = ref(null)
  // 默认unit px
const unitX = computed(() => {
    return content.value ? (content.value.offsetWidth / widthNum.value) : 0; // content.value.offsetWidth  整个屏幕宽度
})
const unitY = computed(() => {
    return content.value ? (content.value.offsetHeight / heightNum.value) : 0; // content.value.offsetWidth  整个屏幕高度
})
// 从上面切换到下面
watch(() =>props.mouseData, (newVal:any) => {
  if(!newVal) return
   mouse.x = newVal.x || 0
})
const handleKeyDown = (event:any) => {
    if(!event.key) return
    if(MOUSE_KEY['UP'].includes(event.key)){
        if(mouse.y === 0){
          emit('change',mouse); // 切换到上面
        }
    }else if(MOUSE_KEY['DOWN'].includes(event.key)){

    }else if(MOUSE_KEY['LEFT'].includes(event.key)){
          mouse.x = mouse.x - mouse.speed;
    }else if(MOUSE_KEY['RIGHT'].includes(event.key)){
          mouse.x = mouse.x + mouse.speed;
    }else if(MOUSE_KEY['ATTACK'].includes(event.key)){
        
    }else if(MOUSE_KEY['JUMP'].includes(event.key)){
        
    }
}
const makeWalls = () => {
  // 生成墙壁
  for(let i = 0; i < widthNum.value; i++) {
      for(let j = 0; j < heightNum.value; j++) {
          wall.list.push({
              id: i + '-' + j,
              x: i,
              y: j,
              w: 4,
              h: 4,
              img: '/img/mouse/q1.png'
          })
      }
  }
  
}
onMounted(() => {
  // 里面是false,<=0,undefind,null    就不执行
    window.addEventListener('keydown', handleKeyDown);
})
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
})

</script>
<style lang="scss" scoped>
.underground{
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #cae9eb;
  transition: transform  1s linear;
  .mouse{
    position: absolute;
    z-index: 999;
  }
  .wall{
    position: absolute;

  }
}


</style>

