<template>
    <div class="mouse-game" ref="content" :style="mouseStyle">
        <div class="mouse" :style="{
            left:mouse.x * unitX + 'px',
            bottom:mouse.y * unitY + 'px',
            width:mouse.w * unitX + 'px',
            height:mouse.h * unitY + 'px',
            transition:  `top ${mouse.transition}s ${mouse.method}, 
                left ${mouse.transition}s ${mouse.method}, 
                right ${mouse.transition}s ${mouse.method}, 
                bottom ${mouse.transition}s ${mouse.method}`,
            animation: mouse.animation,
        }" >
            <img :src="mouse.img" class="img" alt="">
        </div>
        <!-- 宝箱和障碍物 -->
        <div v-for="item in wall.list" :key="item.id" class="wall" :style="{
            left:item.x * unitX + 'px',
            bottom:item.y * unitY + 'px',
            width:item.w * unitX + 'px',
            height:item.h * unitY + 'px',
            zIndex: item.zIndex ? item.zIndex : 0,
            animation: item.animation || 'none'
        }">
         <img :src="item.img" class="img" alt="">
        </div>
        <!-- 小怪和boss -->
        <div v-for="item in monster.list" :key="item.id" class="monster" :style="{
            left:item.x * unitX + 'px',
            bottom:item.y * unitY + 'px',
            width:item.w * unitX + 'px',
            height:item.h * unitY + 'px',
            zIndex: 99,
            transition:  `top ${monster.transition}s ${monster.method},
                left ${monster.transition}s ${monster.method},
                right ${monster.transition}s ${monster.method},
                bottom ${monster.transition}s ${monster.method}`,
            animation: item.animation || 'none'
        }">
          <div class="monster-container">
             <div class="monsterHP">
                <el-progress
                :stroke-width="12"
                :show-text="false"
                color="#e23b2e"
                :percentage="item.HP"
                style="width: 100%;height: 100% !important;"
                />
             </div>
             <img :src="item.img" class="img" alt="">
          </div>
        </div>
        <!-- 进度条、技能 -->
        <div class="progress">
            <div class="progress-bar">
                <div class="progress-HP">
                    <span class="title">HP</span>
                    <el-progress
                    :stroke-width="20"
                    :text-inside="true"
                    color="#1cd66c"
                    :percentage="HP"
                    style="width: 200px;"
                    />
                </div>
                <div class="progress-MP">
                    <span class="title" style="color: #bf3bc6">MP</span>
                    <el-progress
                    :stroke-width="20"
                    :text-inside="true"
                    color="#bf3bc6"
                    :percentage="MP"
                    style="width: 200px;"
                    />
                </div>
                <div class="progress-ATK">
                    <span class="title" style="color: #9fe9f9">ATK</span>
                    <el-progress
                    :stroke-width="20"
                    color="#9fe9f9"
                    :percentage="ATK"
                    style="width: 200px;"
                    >
                    <template #default>
                        <div style="color: #9fe9f9">{{ ATK }}</div>
                    </template>
                </el-progress>   
                </div>
            </div>
            <div class="skill">
               <div class="skill-item" v-for="(item,index) in skillList" :key="index"
               :style="{borderLeft: index === 1 ? 'none':'0.5px solid #7168f4',
                borderRight: index === 1 ? 'none':'0.5px solid #7168f4'
               }">
                    <div class="kill">{{ item.kill }}</div>
                    <img :src="item.img" class="img" alt="">
               </div>
            </div>
            <div class="setting">
                <div class="setting-item">
                    <img src="/img/mouse/music.png" class="img" alt="">
                </div>
                <div class="setting-item">
                    <img src="/img/mouse/cd.png" class="img" alt="">
                </div>
            </div>
        </div>
        <!-- 地图 -->
        <div class="map">
            <div class="map-item z-text">萤火虫森林</div>
            <img class="map-img" src="/img/mouse/map.png" alt="">
        </div>
        <!-- 物品材料 -->
        <div class="material">

        </div>
        <!-- 普攻 -->
        <div class="attack flex_c" v-for="item in attackList" :key="item.id" :style="{
            left:attack.x * unitX + 'px',
            bottom:attack.y * unitY + 'px',
            width:attack.w * unitX + 'px',
            height:attack.h * unitY + 'px',
            transformOrigin: attack.orgin,
            transition:  `top ${attack.transition}s ${attack.method}, 
                left ${attack.transition}s ${attack.method}, 
                right ${attack.transition}s ${attack.method}, 
                bottom ${attack.transition}s ${attack.method}`,
            animation: attack.animation,
        }" >
            <img :src="attack.img" class="img" style="width: 70%;height: 70%;" alt="" v-if="attack.show">
        </div>
        <div class="attack flex_c" v-for="item in attackList" :key="item.id" :style="{
            left:(attack.x + item.num * attack.distanse) * unitX + 'px',
            bottom:attack.y * unitY + 'px',
            width:attack.w * unitX + 'px',
            height:attack.h * unitY + 'px',
            transformOrigin: attack.orgin,
            transition:  `top ${attack.transition}s ${attack.method}, 
                left ${attack.transition}s ${attack.method}, 
                right ${attack.transition}s ${attack.method}, 
                bottom ${attack.transition}s ${attack.method}`,
            animation: attack.animation,
        }" v-show="attack.leave >= item.num">
            <img :src="attack.img" class="img" style="width: 70%;height: 70%;" alt="" v-if="attack.show">
        </div>
        <!-- 音频 -->
        <audio ref="audioB">
            <!-- 背景音乐 -->
           <source src="/audio/mouseB.mp3" type="audio/mp3" />
        </audio>
        <audio ref="audioC">
            <!-- 攻击 -->
           <source src="/audio/mouseC.mp3" type="audio/mp3" />
        </audio>
        <audio ref="audioBX">
            <!-- 捡到宝箱 -->
           <source src="/audio/mouseBX.mp3" type="audio/mp3" />
        </audio>
        <audio ref="audioA">
            <!-- 怪物受到击打 -->
           <source src="/audio/mouseA.mp3" type="audio/mp3" />
        </audio>
        <audio ref="GameOverAudio">
            <!-- 怪物受到击打 -->
           <source src="/audio/GameOver.mp3" type="audio/mp3" />
        </audio>
        <!-- 星空背景 -->
        <div class="layer1"></div>
        <div class="layer2"></div>
        <div class="layer3"></div>
        <div class="layer4"></div>
        <div class="layer5"></div>
        <!-- 失败弹窗 -->
        <defaultDialog :show="showDialog" @back="router.push('/mouse')" text="GAME OVER"></defaultDialog>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref,onUnmounted,watch,nextTick } from 'vue';
import { MOUSE_KEY } from '@/constants/key.ts';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import cloneDeep from 'lodash/cloneDeep';
import { useStore } from 'vuex';
import defaultDialog from '@/components/dialog/defaultDialog.vue';

const store = useStore();
const router = useRouter();
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
const widthNum = ref(100);  // 长分成多少份
const heightNum = ref(50);  // 宽分成多少份
const HP = ref(100); // 血量
const MP = ref(100);  // 魔法值
const ATK = ref(5); // 鼠鼠攻击力
const EXP = ref(0);  // 经验值
const LV = ref(1);  // 等级
const pause = ref(false);  // 暂停
const showDialog = ref(false);  // 失败弹窗
// 游戏资源
const content:any = ref(null);
// 声音资源
const audioB:any = ref(null);
const audioC:any = ref(null);
const audioBX:any = ref(null);
const audioA:any = ref(null);
const GameOverAudio:any = ref(null);

  // 默认unit px
const unitX = computed(() => {
    return content.value ? (content.value.offsetWidth / widthNum.value) : 0; // content.value.offsetWidth  整个屏幕宽度
})
const unitY = computed(() => {
    return content.value ? (content.value.offsetHeight / heightNum.value) : 0; // content.value.offsetWidth  整个屏幕高度
})
const mouseStyle = computed(() => {
    return props.style;
})
let mouse:any = reactive({
    x: 0, 
    y: 0,
    w: 8,
    h: 8,
    img: '/img/mouse/s1.png',
    status: true, // 是否可以移动或者跳跃、释放技能
    direct: 'right', // 方向 
    transition: 0.2, // 移动过渡效果
    method: 'linear', // 过渡效果
    speed: 5,  // 移动速度
    keyDown: '', // 按键
    keyUp: '', // 松开按键
    jumpHeight: 12, // 跳跃高度
    jumWidth: 24, // 跳跃宽度
    jumpCount: 0, // 跳跃次数
    jumpTime: 0.3, // 跳跃时间 （秒）
    jumpParagraph: 5, // 一次跳跃分成多少段
    isJump: false, // 是否能跳跃
    jumpState: false, // 跳跃状态  一段跳
    jumpStateTwo: false, // 跳跃状态 二段跳
    landStatusOne: false, // 一段跳是否落地
    landStatusTwo: false, // 二段跳是否落地
    jumpXValue: 0, // 跳跃时候左右偏移距离
    jumpTimer: null, // 定时器
    jumpTimerTwo: null, // 定时器 二段跳
    animation:'', // 动画
    killUState: true, // 技能是否可以释放（冷却、或者没蓝）
    killIState: true, // 技能是否可以释放（冷却、或者没蓝）
    killOState: true, // 技能是否可以释放（冷却、或者没蓝）
    allState: true, // 技能是否可以释放
})
// 普攻段数 除了一段
let attackList:any = ref([
    { num: 1 ,show: true, id:2 },
    { num: 2 ,show: true, id:3 },
    { num: 3 ,show: true, id:4 },
    { num: 4 ,show: true, id:5 },
    { num: 5 ,show: true, id:6 },
    { num: 6 ,show: true, id:7 },
    { num: 7 ,show: true, id:8 },
    { num: 8 ,show: true, id:9 },
    { num: 9 ,show: true, id:10 },
])
// 普攻
let attack:any = reactive({
    x: 0,
    y: 0,
    w: 8,
    h: 8,
    img: '/img/mouse/wq2r.png',
    transition: 0.2, // 移动过渡效果
    animation:'attack 0.5s linear',
    orgin: 'left bottom',
    method: 'linear', // 过渡效果
    show: false,
    time: 400, // 普攻持续时间 毫秒
    distanse: 4, // 普攻距离
    leave: 9, // 普攻段数 最长 9 段
})
const wall:any = reactive({
    list: [
        { x: 46, y: 12, w: 6, h: 2,name: '墙',img: '/img/mouse/q1.png',id: 1 },
        { x: 52, y: 12, w: 6, h: 2,name: '墙',img: '/img/mouse/q1.png',id: 2 },
        { x: 50, y: 26, w: 6, h: 2,name: '墙',img: '/img/mouse/q1.png',id: 3 },
        { x: 56, y: 26, w: 6, h: 2,name: '墙',img: '/img/mouse/q1.png',id: 4 },
        { x: 30, y: 20, w: 6, h: 2,name: '墙',img: '/img/mouse/q1.png',id: 5},
        { x: 24, y: 20, w: 6, h: 2,name: '墙',img: '/img/mouse/q1.png',id: 6},
        { x: 18, y: 20, w: 6, h: 2,name: '墙',img: '/img/mouse/q1.png',id: 7},
        { x: 88, y: 26, w: 6, h: 2,name: '墙',img: '/img/mouse/q1.png',id: 8},
        { x: 82, y: 26, w: 6, h: 2,name: '墙',img: '/img/mouse/q1.png',id: 9},
        { x: 18, y: 22, w: 4, h: 4,name: '宝箱',img: '/img/mouse/bx1.png',zIndex: 1,id: 10 },
        { x: 82, y: 28, w: 4, h: 4,name: '宝箱',img: '/img/mouse/bx2.png',zIndex: 1,id: 11 },
        { x: 48, y: 0, w: 4, h: 12,name: '梯子',img: '/img/mouse/tz.png',id: 12},
        { x: 53, y: 14, w: 4, h: 12,name: '梯子',img: '/img/mouse/tz.png',id: 13},
        { x: 88, y: 2, w: 4, h: 12,name: '梯子',img: '/img/mouse/tz.png',id: 14},
        { x: 88, y: 14, w: 4, h: 12,name: '梯子',img: '/img/mouse/tz.png',id: 15},
        { x: 92, y: 0, w: 8, h: 8,name: '树洞',img: '/img/mouse/homeWay.png',zIndex: 100,id: 16},
    ]
})
const monster:any = reactive({
    // status 怪物状态
    // attack 怪物攻击状态 , attacked 怪物被攻击状态
    list:[
        // 低级的怪不能切换方向  111
        { x: 30, y: 22, w: 6, h: 6,name: '小怪',img: '/img/mouse/monster1.png',id: 1,
        leave: '低级',small: true,timer: null,ATK: 1,status: '',animation: '',HP: 50 },
        { x: 46, y: 28, w: 8, h: 8,name: '小怪',img: '/img/mouse/monster2l.png',id: 2,
        leave: '中级',animation: 'monsterMove 1s linear infinite',timer: null, ATK: 5,status: '',HP: 100 },
    ],
    timer: null, // 定时器
    time: 1000, // 怪物移动时间 毫秒
    speed: 4, // 怪物移动速度
    transition: 0.4, // 移动过渡效果
    method: 'linear', // 过渡效果
    controlTime: 1000, // 怪物控制时间 毫秒
})
// 技能列表
const skillList = ref([
    { name: '火舞旋风', cost: 40 ,kill: 'U', img: '/img/mouse/k1.png' },
    { name: '突刺', cost: 60 ,kill: 'I', img: '/img/mouse/k2.gif' },
    { name: '鼠鼠之怒', cost: 100 ,kill: 'O', img: '/img/mouse/k3.png' },
])
// 阻止走出屏幕边界
watch(() => mouse, (newValue, oldValue) => {
      if(newValue.x < 0) {
          mouse.x = 0;
      }else if(newValue.x + newValue.w > widthNum.value) {
          mouse.x = widthNum.value - newValue.w;
      } if(newValue.y < 0) {
          mouse.y = 0;
      }else if(newValue.y + newValue.h > heightNum.value) {
          mouse.y = heightNum.value - newValue.h;
      }
},{ deep: true})

watch(() =>props.mouseData, (newVal:any) => {
   if(!newVal) return
   mouse.x = newVal.x || 0; // 切换界面到地上初始化位置
})
// 监测跳跃
watch(() => mouse.jumpState, (newVal:any) => {
   if(newVal === false) {
        mouse.landStatusOne = true;
        mouse.jumpTimer && clearInterval(mouse.jumpTimer);
        let arr = wall.list;
        // 监测是否碰到墙体
        let obj = arr.sort((a:any, b:any) => b.y - a.y).find((item:any) => {
            return mouse.x + mouse.w > item.x && mouse.x < item.x + item.w && mouse.y >= item.y + item.h && item.name === '墙'
        })
        if(obj) {
            if(mouse.transition <= 0.15) mouse.transition = 0.15;
            mouse.y = obj.y + obj.h;
            mouse.jumpCount = 0;
            mouse.jumpXValue = 0;
            mouse.landStatusOne = false;
        }else {
            let mouseOriginal = cloneDeep(mouse);
            mouse.transition = mouse.jumpTime / mouse.jumpParagraph;
            mouse.jumpTimer = setInterval(() => {
                mouse.y = (mouse.y - mouseOriginal.y / mouse.jumpParagraph) > 0 ? (mouse.y - mouseOriginal.y / mouse.jumpParagraph) : 0;
                mouse.x = mouse.x + mouse.jumpXValue;
                if(mouse.jumpStateTwo){
                    clearInterval(mouse.jumpTimer);
                    mouse.landStatusOne = false;
                    return
                }
                if(mouse.y <= 0){
                    clearInterval(mouse.jumpTimer);
                    mouse.landStatusOne = false;
                    mouse.jumpCount = 0;
                    mouse.jumpXValue = 0;
                    mouse.transition = mouseOriginal.transition;
                }
            }, mouse.jumpTime / mouse.jumpParagraph * 1000);
        }
   }
})
watch(() => mouse.jumpStateTwo, (newVal:any) => {
     if(newVal === false) {
        mouse.landStatusTwo = true;
        mouseLand();
     }
})
watch(() => mouse.y, (newVal:any) => {
    if(newVal === 0){
        mouse.jumpCount = 0;
        mouse.jumpXValue = 0;
        mouse.landStatusTwo = false;
    }
})
watch(() => HP.value, (newVal:any) => {
    if(newVal <= 0) {
        newVal = 0;
        GameOver();
    }
})
// 游戏结束
const GameOver = () => {
    store.dispatch('playAudio',GameOverAudio.value);
    mouse.timer && clearInterval(mouse.timer);
    mouse.jumpTimer && clearInterval(mouse.jumpTimer);
    mouse.jumpTimerTwo && clearInterval(mouse.jumpTimerTwo);
    monster.timer && clearInterval(monster.timer);
    mouse.status = false;
    mouse.jumpState = false;
    showDialog.value = true;
}
// 按键
const handleKeyDown = (event:any) => {
    if(!event.key || !mouse.status) return
    // 判断一个数是不是在数组中
    if(MOUSE_KEY['UP'].includes(event.key)){
        // 判断有没有梯子
        let ladder = wall.list.find((item:any) => {
            return item.name === '梯子' && Math.abs(item.x - mouse.x) <= mouse.w / 2 && item.y <= mouse.y && item.y + item.h >= mouse.y;
        })
        if(ladder){
            // 监测是否碰到墙体
            let arr = wall.list;
            let obj = arr.sort((a:any, b:any) => b.y - a.y).find((item:any) => {
                return mouse.y < item.y && mouse.x + mouse.w > item.x && mouse.x < item.x + item.w && mouse.y + mouse.speed >= item.y + item.h && item.name === '墙'
            })
            if(obj) {
                mouse.y = obj.y + obj.h;
            }else {
                mouse.jumpTimer && clearInterval(mouse.jumpTimer);
                mouse.jumpTimerTwo && clearInterval(mouse.jumpTimerTwo);
                mouse.y = mouse.y + mouse.speed;
            }
        }
    }else if(MOUSE_KEY['DOWN'].includes(event.key)){
        if(mouse.y === 0){
            emit('change',mouse);
        }else{
            // 判断有没有梯子  2 为墙体的高度
            let ladder = wall.list.find((item:any) => {
                return item.name === '梯子' && Math.abs(item.x - mouse.x) <= mouse.w / 2 && item.y <= mouse.y && item.y + item.h + 2 >= mouse.y && mouse.y - mouse.speed >= item.y;
            })
            if(ladder){
                mouse.y = mouse.y - mouse.speed;
            }
        }
    }else if(MOUSE_KEY['LEFT'].includes(event.key)){
       mouse.direct = 'left';
       if(mouse.jumpState || mouse.jumpStateTwo) {
         mouse.keyDown = event.key;
         mouse.jumpXValue = -(mouse.jumWidth / mouse.jumpParagraph);
       }else{
        if(MOUSE_KEY['LEFT'].includes(mouse.keyDown) && !MOUSE_KEY['LEFT'].includes(mouse.keyUp)) return
         mouse.x = mouse.x - mouse.speed;
         mouseLand();
       }
    }else if(MOUSE_KEY['RIGHT'].includes(event.key)){
       mouse.direct = 'right';
       if(mouse.jumpState || mouse.jumpStateTwo) {
           mouse.keyDown = event.key;
           mouse.jumpXValue = mouse.jumWidth / mouse.jumpParagraph;
       }else{
         if(MOUSE_KEY['RIGHT'].includes(mouse.keyDown) && !MOUSE_KEY['RIGHT'].includes(mouse.keyUp)) return
          mouse.x = mouse.x + mouse.speed;
          mouseLand();
       }
    }else if(MOUSE_KEY['ATTACK'].includes(event.key)){
        attackMethod();
    }else if(MOUSE_KEY['K'].includes(event.key)){
        mouseJump();
    }else if(MOUSE_KEY['U'].includes(event.key)){
        if(MP.value < 10) {
            return
        }else{
            MP.value = MP.value - 10;
        }
        if(!mouse.allState || !mouse.killUState) return
        mouse.animation = 'fire 1s linear 2';  
        setTimeout(() => {
            mouse.animation = '';
        },2000)
    }else if(MOUSE_KEY['I'].includes(event.key)){
        if(MP.value < 5) {
            return
        }
        if(!mouse.allState || !mouse.killIState) return
        mouse.img = mouse.direct === 'left' ? '/img/mouse/wq2l.png' : '/img/mouse/wq2r.png';
        let transition = cloneDeep(mouse.transition);
        mouse.status = false;
        mouse.transition = 0.1;
        mouse.x = mouse.x + (mouse.direct === 'left' ? -30 : 30);
        setTimeout(() => {
            mouse.transition = transition;
            setTimeout(() => {
                mouse.img = '/img/mouse/s1.png';
                mouse.status = true;
                mouseLand();
            },500)
        },mouse.transition)
    }else if(MOUSE_KEY['O'].includes(event.key)){
        if(MP.value < 20) {
            return
        }else{
            MP.value = MP.value - 20;
        }
        if(!mouse.allState || !mouse.killOState) return
        let mouseOriginal = cloneDeep(mouse);
        mouse.status = false;
        mouse.img = '/img/mouse/k4.gif';
        let time = 1; // 技能释放时间
        mustKill(time);     // 释放终极技能
        setTimeout(() => {
            mouse.x = mouseOriginal.x;
            mouse.y = mouseOriginal.y;
            mouse.transition = mouseOriginal.transition;
            mouse.status = true;
            mouse.img = mouseOriginal.img;
        },time * 1500)
    }
    checkOpenBX(); // 检查是否开启宝藏箱
    checkImpact(); // 检查是否碰撞到怪物
}
const onKeyUp = (event:any) => {
    if(!event.key) return;
    if(MOUSE_KEY['LEFT'].includes(event.key)){
        mouse.jumpXValue = 0;
        mouse.keyUp = event.key;
    }else if(MOUSE_KEY['RIGHT'].includes(event.key)){
        mouse.jumpXValue = 0;
        mouse.keyUp = event.key;
    }
}
// 跳跃  一次跳跃到顶点所需要的时间是 transition 秒
/*
  2段跳跃需要考虑两点：1、是否跳到最高点再继续跳（极限跳）；2、跳的过程中跳
*/
// 一段跳
const mouseJump = () => {
    if(mouse.landStatusTwo) return; 
    // 未跳跃
    if(mouse.jumpCount < 2){  // 0,1
        mouse.jumpCount++;
    }
    if(mouse.jumpCount > 1) {
        mouseJumpTwo();
        return
    }
    if(mouse.jumpCount !== 1) return;
    mouse.jumpState = true; // 一段跳跃 状态
   let mouseOriginal = cloneDeep(mouse);
   let height = mouseOriginal.y + mouseOriginal.jumpHeight;
   let time = mouseOriginal.jumpTime; 
   let num = mouseOriginal.jumpParagraph; 
   mouse.transition = time / num;
   mouse.jumpTimer && clearInterval(mouse.jumpTimer);
   mouse.jumpTimer = setInterval(() => {
      if(Math.abs(mouse.x - mouseOriginal.x) >= mouseOriginal.jumWidth){
         mouse.jumpXValue = 0;
      }
       mouse.y = mouse.y + (mouse.jumpHeight / num);
       mouse.x = mouse.x + mouse.jumpXValue;
       if(mouse.y >= height){
          mouse.jumpState = false;
          clearInterval(mouse.jumpTimer);
          mouse.transition = mouseOriginal.transition;
       }
   }, time / num * 1000);
}
// 二段跳
const mouseJumpTwo = () => {
    if(mouse.landStatusTwo) return; 
    if(mouse.jumpStateTwo || mouse.jumpCount > 2) return;
    if(mouse.jumpState){
        mouse.jumpState = false; // 一段跳跃状态停止
        mouse.jumpTimer && clearInterval(mouse.jumpTimer); // 清除一段跳跃定时器
    }
    mouse.jumpCount = 2;
    mouse.jumpStateTwo = true; // 二段跳跃 状态
    let mouseOriginal = cloneDeep(mouse);
    let height = mouseOriginal.y + mouseOriginal.jumpHeight;
    let time = mouseOriginal.jumpTime; 
    let num = mouseOriginal.jumpParagraph; 
    mouse.transition = time / num;
    mouse.jumpTimerTwo = setInterval(() => {
      if(Math.abs(mouse.x - mouseOriginal.x) >= mouseOriginal.jumWidth){
           mouse.jumpXValue = 0;
       }
       mouse.y = mouse.y + (mouse.jumpHeight / num);
       mouse.x = mouse.x + mouse.jumpXValue;
       // 防止跳出屏幕上方
       if(mouse.y >= height || mouse.y >= heightNum.value - mouse.h){
           mouse.jumpStateTwo = false;
           clearInterval(mouse.jumpTimerTwo);
           mouse.transition = mouseOriginal.transition;
        }
    }, time / num * 1000)
}
// 落地
const mouseLand = () => {
    mouse.jumpTimer && clearInterval(mouse.jumpTimer);
    mouse.jumpTimerTwo && clearInterval(mouse.jumpTimerTwo);
    let arr = wall.list;
    // 监测是否碰到墙体
    let obj = arr.sort((a:any, b:any) => b.y - a.y).find((item:any) => {
        return mouse.x + mouse.w > item.x && mouse.x < item.x + item.w && mouse.y >= item.y + item.h && item.name === '墙'
    })
    if(obj) {
        if(mouse.transition <= 0.15) mouse.transition = 0.15;
        mouse.y = obj.y + obj.h;
        mouse.jumpCount = 0;
        mouse.jumpXValue = 0;
        mouse.landStatusTwo = false;
    }else {
        mouse.jumpTimer && clearInterval(mouse.jumpTimer);
        let mouseOriginal = cloneDeep(mouse);
        mouse.jumpTimer = setInterval(() => {
            mouse.y = (mouse.y - mouseOriginal.y / mouse.jumpParagraph) > 0 ? (mouse.y - mouseOriginal.y / mouse.jumpParagraph) : 0;
            mouse.x = mouse.x + mouse.jumpXValue;
            if(mouse.jumpStateTwo){
                clearInterval(mouse.jumpTimer);
                mouse.landStatusOne = false;
                return
            }
            if(mouse.y <= 0){
                clearInterval(mouse.jumpTimer);
                mouse.landStatusOne = false;
                mouse.jumpCount = 0;
                mouse.jumpXValue = 0;
            }
        }, mouse.jumpTime / mouse.jumpParagraph * 1000);
    }
}
// 普攻
const attackMethod = ()=>{
    if (audioC.value) {
        store.dispatch('playAudio',audioC.value);
    }
      mouse.status = false;
      attack.show = true;
      if(mouse.direct === 'left'){
        attackList.value = attackList.value.map((item:any) => {
            return { ...item,num: -Math.abs(item.num) }
        })
        attack.orgin = 'right bottom';
        attack.animation = 'attackLeft 0.1s ease-in';
        attack.x = mouse.x - mouse.w;
        attack.y = mouse.y;
        attack.img = attack.img.slice(0, attack.img.length - 5) + 'l' + attack.img.slice(attack.img.length - 4);
      }else{
        attackList.value = attackList.value.map((item:any) => {
            return { ...item,num: Math.abs(item.num) }
        })
        attack.orgin = 'left bottom';
        attack.animation = 'attackRight 0.1s ease-in';
        attack.x = mouse.x + mouse.w;
        attack.y = mouse.y;
        attack.img = attack.img.slice(0, attack.img.length - 5) + 'r' + attack.img.slice(attack.img.length - 4);
      }
      attackMonster();
      setTimeout(() => {
        attack.show = false;
        mouse.status = true;
      },attack.time)
}
// 攻击怪物  111
const attackMonster = () => {
    // 判断是否攻击到怪物
    let obj:any = null;
    // 1.没有段数 leave
      if(attack.leave === 0){
        obj = monster.list.find((item:any) => {
            return Math.abs(item.x - attack.x) <= mouse.w / 2 && Math.abs(item.y - attack.y) <= mouse.h / 2;
        })
      }else{
        // 2.有段数
        obj = monster.list.find((item:any) => {
            let a = item.x >= attack.x && item.x <= attack.x + attack.distanse * attack.leave;
            let b = item.x <= attack.x && item.x >= attack.x - attack.distanse * attack.leave;
            return Math.abs(item.y - attack.y) <= mouse.h / 2 && (a || b);
        })
      }
      if(obj){
        // 让怪物处于被攻击状态+
        let orginMonster = cloneDeep(obj);
        obj.status = 'attacked';
        obj.HP -= ATK.value;
        if(mouse.x <= obj.x){
            obj.animation = 'AttackedRight 1s ease-in';
            obj.x += 2;
        }else{
            obj.animation = 'AttackedLeft 1s ease-in';
            obj.x -= 2;
        }
        store.dispatch('playAudio',audioA.value);
        setTimeout(() => {
            obj.status = 'normal';
            obj.animation = orginMonster.animation;
            if(obj.HP <= 0){
                killMonster(obj);
            }
        },monster.controlTime)
      }
}
// 怪物去世
const killMonster = (obj:any) => {
    monster.list = monster.list.filter((item:any) => item.id !== obj.id);
}
// 必杀
const mustKill = (time:any = 1) => {
    let leftTop = {x: 0, y: widthNum.value - mouse.h};
    let rightTop = {x: widthNum.value - mouse.w, y: widthNum.value - mouse.h};
    let leftBottom = {x: 0, y: 0};
    let rightBottom = {x: widthNum.value - mouse.w, y: 0};
    let center = {x: widthNum.value / 2 - mouse.w / 2, y: heightNum.value / 2 - mouse.h / 2};
    let arr  = [leftTop, rightTop, leftBottom, rightBottom, center];
    mouse.transition = time / arr.length;
    moveKill(arr,time / arr.length);
}
// 移动 给入需要移动的坐标
const moveKill = (arr:any,time:any) => {
    let newArr = arr;
    setTimeout(() => {
        mouse.x = newArr[0].x;
        mouse.y = newArr[0].y;
        newArr.shift();
        if(newArr.length > 0) {
            moveKill(newArr,time)
        }
    },time * 1000)
}
// 监测是否开启宝箱
const checkOpenBX = () => {
    let bxArr = wall.list.filter((item:any) => item.name === '宝箱');
    if(bxArr && bxArr.length){
        let BX = bxArr.find((item:any) => {
            return  Math.abs(item.x - mouse.x) <= mouse.w / 2 && Math.abs(item.y - mouse.y) <= mouse.h / 2;
        })
        if(BX){
            BX.animation = 'openBX 1s ease-in';
            store.dispatch('playAudio',audioBX.value);
            setTimeout(() => {
                wall.list = wall.list.filter((item:any) => item.id !== BX.id);
            },1000)
        }
           

    }
}
// 怪物移动 
const moveMonster = () => {
     monster.timer = setInterval(() => {
         monster.list.forEach((item:any) => {
            // 被攻击时候无法移动
            if(item.status === 'attacked'){
                return;
            }
            if(item.leave === '低级'){
               let num = Math.floor(Math.random() * 2) + 1;
               if(num === 1){
                    let flag = monster.list.find((i:any) => {
                        return i.id !== item.id && i.y === item.y && i.x + i.w > (item.x + monster.speed) && (item.x + monster.speed) + item.w > i.x
                    })
                    if(flag) return;
                    let randomTime = Math.random();
                    setTimeout(() => {
                        item.x += monster.speed;
                    }, randomTime * 1000);
               }else{
                    let flag = monster.list.find((i:any) => {
                        return i.id !== item.id && i.y === item.y && i.x + i.w > (item.x - monster.speed) && (item.x - monster.speed) + item.w > i.x
                    })
                    if(flag) return;
                    let randomTime = Math.random();
                    setTimeout(() => {
                        item.x -= monster.speed
                    }, randomTime * 1000);
               }
               checkFall(item);
            }
            if(item.leave === '中级'){
                let num = Math.floor(Math.random() * 2) + 1;
                if(num === 1){
                    let flag = monster.list.find((i:any) => {
                        return i.id !== item.id && i.y === item.y && i.x + i.w > (item.x + monster.speed) && (item.x + monster.speed) + item.w > i.x
                    })
                    if(flag) return;
                    item.img = item.img.slice(0, item.img.length - 5) + 'r' + item.img.slice(item.img.length - 4);
                    item.x += monster.speed;
               }else{
                    let flag = monster.list.find((i:any) => {
                        return i.id !== item.id && i.y === item.y && i.x + i.w > (item.x - monster.speed) && (item.x - monster.speed) + item.w > i.x
                    })
                    if(flag) return;
                    item.img = item.img.slice(0, item.img.length - 5) + 'l' + item.img.slice(item.img.length - 4);
                    item.x -= monster.speed
               }
               checkFall(item);
            }
            if(monster.timer){
                checkImpact();
            }
         })
     },monster.time)
}
// 监测怪物是否落地 
const checkFall = (data:any) => {
    if(data.x <= 0) {
        data.x = data.x + monster.speed;
        return
    }
    if(data.x >= widthNum.value - data.w) {
        data.x = data.x - monster.speed;
        return
    }
    const transition = cloneDeep(data.transition);
    let arr = wall.list;
    // 监测是否碰到墙体
    let obj = arr.sort((a:any, b:any) => b.y - a.y).find((item:any) => {
        return data.x + data.w > item.x && data.x < item.x + item.w && data.y >= item.y + item.h && item.name === '墙'
    })
    if(obj){
        data.y = obj.y + obj.h;
    }else{
        data.transition = 0.3;
        data.y = 0;
        data.transition = transition;
    }
}
// 监测人物和怪物碰撞
const checkImpact = () => {
      let obj = monster.list.find((item:any) => {
          return item.y === mouse.y && item.x + item.w > mouse.x && mouse.x + mouse.w > item.x
      })
      if(obj){
        if(HP.value > 0){
            HP.value -= obj.ATK ? obj.ATK : 5;
        }
      }
}
onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', onKeyUp);
    nextTick(() => {
        moveMonster();
        // 浏览器有默认阻止自动播放，需要点击才能触发
        // store.dispatch('playAudio',audioB.value);
    })
})
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    mouse.jumpTimer && clearInterval(mouse.jumpTimer);
    mouse.jumpTimerTwo && clearInterval(mouse.jumpTimerTwo);
    monster.timer && clearInterval(monster.timer);
})

</script>

<style scoped lang="scss">
.mouse-game {
    width: 100%;
    height: 100vh;
    background-color: #000;
    position: relative;
    cursor: pointer;
    color: #d7e9ee;
    transition: transform  1s linear;
    .mouse {
        position: absolute;
        z-index: 999;
    }
    .wall {
        position: absolute;
    }
    .monster{
        position: absolute;
        .monster-container{
            position: relative;
            width: 100%;
            height: 100%;
            .monsterHP{
                position: absolute;
                height: 16px !important;
                width: 100%;
                transform: translateY(-16px);
            }
        }
    }
    .progress{
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        .progress-bar{
            font-weight: 600;
            line-height: 16px;
            .progress-HP{
                margin: 10px;
            }
            .progress-MP{
                margin: 10px;
            }
            .progress-ATK{
                margin: 10px;
            }
            .title{
                color:#54e97c;
                font-size: 15px;
            }
        }
        .skill{
            display: flex;
            align-items: center;
            margin-top: 20px;
            .skill-item{
                position: relative;
                border: 0.5px solid #7168f4;
                height: 60px;
                width: 60px;
                background-color: #080000;
                .cost{
                    position: absolute;
                    top: -20px;
                    right: 0;
                    width: 20px;
                    height: 20px;
                    font-size: 14px;
                    color: #cee7ee;
                }
                .kill{
                    position: absolute;
                    top: -20px;
                    left: 0;
                    width: 20px;
                    height: 20px;
                    font-size: 15px;
                    font-weight: bold;
                    color: #e9afaa;
                }
            }
        }
        .setting{
            width: 200px;
            display: flex;
            justify-content: space-around;
            margin: 20px;
            padding-top: 20px;
            .setting-item{
                width: 50px;
                height: 50px;
            }
        }
    }
    .map{
        position: absolute;
        width: 200px;  
        left: calc(50% - 100px);     
        top: 0;
        .map-item{
            display: flex;
            justify-content: center;
            align-items: center;
            height: 36px;
            border: 0.5px solid #7168f4;
            font-size: 17px;
            font-weight: bold;
        }
        .map-img{
            width: 100%;
            height: auto;
        }
    }
    .material{
        position: absolute;
        left: calc(50% + 100px);
        width: calc(50% - 100px);
        top: 0;
        height: 60px;
        border: 0.5px solid #7168f4;
        border-left: none;

    }
    .attack{
        position: absolute;
    }
}


</style>