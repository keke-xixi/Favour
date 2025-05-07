<template>
  <div class="mainCard">
     <div class="main-top">
         <div v-for="(item,index) in list" :key="index" class="title-box" @click="toPath(item,index)"
         :style="{
          fontWeight: nowIndex === index ? 'bold' : '400' ,
          color: nowIndex === index ? '#2878ff' : '#fff'}">
            <span>{{item.name}}</span>
         </div>
     </div>
     <div class="z-card">
         <div class="pointer" ref="pointer" :style="pointerStyle"></div>
         <div class="z-card-main game-list"  v-for="a in gameListComputed" :key="a.id" @click="toGame(a)">
              <img src="/img/game/kt.png" ref="imgs" alt="" >
              <div class="card-content" >{{ a.name }}</div>
         </div>
     </div>

  </div>
</template>
<script setup lang="ts">
import {ref,reactive, computed, Ref,onUnmounted, nextTick, onMounted} from "vue"
import { mapActions, mapGetters } from 'vuex';
import { useStore } from 'vuex';
import { useRouter  } from 'vue-router';
import routes from '@/router/routes';
import { ElNotification } from "element-plus";
const router = useRouter();


const store = useStore();

// 使用计算属性 查看是否全屏状态
// const isFullscreen = computed(() => store.getters.isFullscreen);


const nowIndex = ref(0)
const nowGameList: Ref<string> = ref('game'); // 示例
  
const imgs:any= ref([]);
const pointer:any = ref(null);
const pointerStyle = ref({
  '--s': `${200}px`,  // 宽度
  '--x': `${30}px`,  // x轴偏移量
  '--y': `${0}px`,  // y轴偏移量
}); 


// 导航列表
const list = reactive([
  {name:'首页', path:'/',id: 1,list:'game'},
  {name:'冒险', path:'/risk',id: 2,list:'gameRisk'},
  {name:'闯关', path:'/pass',id: 3,list:'gamePass'},
  {name:'策略', path:'/card',id: 4,list:'gameCard'},
  {name:'棋牌', path:'/tactics',id: 5,list:'gameTactics'},
  {name:'我的', path:'/mine',id: 6,list:'gameMine'},
])
// 游戏列表
const gameList = {
   'game':[
        {name:'花仙', path:'/huaxian',listId: 1,id: 1},
        {name:'组件', path:'/jijia',listId: 1,id: 2},
        {name:'月光蛊', path:'/moonlight',listId: 1,id: 3},
        {name:'牛马蛊', path:'/oxenHorses',listId: 1,id: 4},
        {name:'吗喽蛊', path:'/malou',listId: 1,id: 5},
      ],
  'gameRisk': [
        {name:'鼠鼠出击', path:'/mouse',listId: 2,id: 1},
      ],
  'gamePass': [
        {name:'坦克大战模拟', path:'/tank',listId: 3,id: 1},
      ],
  'gameCard': [
        {name:'MAGIC', path:'/card',listId: 4,id: 1},
      ],
  'gameTactics': [
        {name:'斗地主', path:'/tactics',listId: 5,id: 1},
        {name:'跑的快', path:'/tactics',listId: 5,id: 2},
        {name:'斗牛', path:'/tactics',listId: 5,id: 3},
        {name:'猜花', path:'/tactics',listId: 5,id: 4},
      ],
  'gameMine': [
        {name:'好运眷顾傻瓜', path:'/mine',listId: 6,id: 1},
      ],
}
const gameListComputed = computed(() => {
  return reactive(gameList[nowGameList.value as keyof typeof gameList])
})
const toGame = (item:any) => {
  const arr:any = routes.find((route: any) => route.path === item.path);
  if(arr){
    // store.dispatch('toggleFullscreen'); // 成功进入游戏时，全屏(开发暂时隐藏)
    router.push(item.path)
  }else{
    ElNotification({
        title: '提示',
        message: '该游戏还在开发中，敬请期待！',
        position: 'top-right',
        type: 'warning',
    })
  }
}
const toPath = (item: any, index: number) => {
  handleMouseLeave();
  nowIndex.value = index;
  nowGameList.value = item.list;
  nextTick(() => {
    handleMouseEnter();
  })
}
const handleMouseEnter = (flag = true) => {
  imgs.value = Array.from(document.querySelectorAll('.z-card-main img'));
    imgs.value.forEach((img:any) => {
      img.addEventListener('mouseenter', () => {
        pointerStyle.value['--s'] = `${img.offsetWidth}px`;
        pointerStyle.value['--x'] = `${img.offsetLeft}px`;
        pointerStyle.value['--y'] = `${img.offsetTop}px`;
      });
  });
  if(flag && imgs.value && imgs.value.length){
    pointerStyle.value['--s'] = `${imgs.value[0].offsetWidth}px`;
    pointerStyle.value['--x'] = `${imgs.value[0].offsetLeft}px`;
    pointerStyle.value['--y'] = `${imgs.value[0].offsetTop}px`;
  }
};
const handleMouseLeave = () => {
  imgs.value = Array.from(document.querySelectorAll('.z-card-main img'));
    imgs.value.forEach((img:any) => {
      img.removeEventListener('mouseenter', () => {
        pointerStyle.value['--s'] = `${img.offsetWidth}px`;
        pointerStyle.value['--x'] = `${img.offsetLeft}px`;
        pointerStyle.value['--y'] = `${img.offsetTop}px`;
      });
    });
}
onMounted(() => {
  // localStorage.setItem('onlineUser','{}');
  handleMouseEnter(false)
})

</script>
<style lang="scss" scoped>
.mainCard{
    margin: 20px;
    height: calc(100vh - 60px);
    color: aliceblue;
    .main-top{
      height: 60px;
      width: 100%;
      display: flex;
      .title-box{
        padding: 10px 20px;
        cursor: pointer;
        transform: all 0.3s;
        font-size: 18px;
      }
    }
    .main-content{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      height: calc(100% - 160px);
      align-content: flex-start;
      position: relative;
      .game-list{
        margin: 10px;
        width: 30%;
        height: 160px;
        line-height: 160px;
        font-size: 25px;
        text-align: center;
        cursor: pointer;
        border-radius: 10px;
        transform: all 0.3s;
        border:1px solid var(--main-color);
        font-weight: bold;
        // text-shadow: 1px -1px #fff,-1px 1px #999,-10px 10px 10px #1f126d;
        &:hover{
          box-shadow: 0 0 10px #16825d;
        }
      }
    }
}
.z-card{
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .pointer{
        --l: 30px; /* 四角线框的长度 */
        --t: 3px; /* 四角线框的粗细 */
        --g: 15px; /* 四角线框和图片的间隔 */
        --s: 240px; /* 图片的尺寸 */
        --x: 0px; /* 图片左上角的横坐标 */
        --y: 0px; /* 图片左上角的纵坐标 */
        position: absolute;
        width: calc(var(--s) + var(--g) * 2);
        height: calc(var(--s) + var(--g) * 2);
        border: var(--t) solid #fff;
        left: calc(var(--x) - var(--g));
        top: calc(var(--y) - var(--g));
        transition: 0.2s;
        mask: conic-gradient(
            at var(--l) var(--l),
            transparent 75%,
            blue 75% 100%
        ) 0 0 / calc(100% - var(--l)) calc(100% - var(--l)) repeat;
        cursor: pointer;
        pointer-events: none;  /* 鼠标事件穿透  阻止遮罩层下面的盒子点击不到*/
    }
}
.z-card-main img{
    width: 100%;
    height: 160px;
    cursor: pointer;
}
.card-content{
  background-color: #191919;
  color: #fff;
}
</style>
