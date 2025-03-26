<template>
    <div class="gamePass">
         <div class="top">
           <div class="back">
              <el-icon :size="28" color="#0199eb" style="font-weight: bold;" @click="emit('back')"><Back /></el-icon>
           </div>
           <h1 class="gradient-text" style="color: #0bbde3;">第十关</h1>
           <div class="light" @click="lightChange" :style="{ color: light === '开灯' ? '#0bbde3' : 'red' }">
              <div class="flex_c" style="margin-left: 50px;">
                {{ light }}
              </div>
           </div>
           <div class="score">
                <span class="text">金币：</span>
                <span class="value">{{ gold }}</span>
                <span class="text"> 积分：</span>
                <span class="value">{{ score }}</span>
                <span class="text"> 钻石：</span>
                <span class="value">{{ diam }}</span>
           </div>
           <div class="kill">
                <span class="text">冰封 × {{ kills.kill1 || 0 }}</span>
                <span class="text" v-if="stopStatus" style="font-size: 22px;">---{{ killTimer1 }}s</span>
                <span class="text" style="margin-left: 20px;color: #8c3b2d">无敌 × {{ kills.kill2 || 0 }}</span>
                <span class="text" style="color: #8c3b2d;font-size: 22px;" v-if="bodyStatus">---{{ killTimer2 }}s</span>
            </div>
         </div>
         <div class="content" ref="content" @keydown="handleKeyDown" :style="{ background: light === '开灯' ? '#000' : '#8c382b'}">
           <!-- 城墙 -->
            <div class="wall" v-for="a in wallList.list" :key="a.id" 
            :style="{ left: width(a.x),top: height(a.y),width: width(1),height: height(1),display: loading ? 'none' : 'block'}">
                <img :src="a.img"/>
            </div>
           <!-- 金币 -->
            <div class="gold" v-for="a in goldList.list" :key="a.id" 
            :style="{ left: width(a.x),top: height(a.y),width: width(1),height: height(1),display: loading ? 'none' : 'block'}">
                <img :src="a.img"/>
            </div>
           <!-- 敌人 -->
            <div class="enemy" v-for="a in enemyList.list" :key="a.id" 
            :style="{ left: width(a.x),top: height(a.y),width: width(1),height: height(1),display: loading ? 'none' : 'block'}">
                <img :src="a.img"/>
            </div>
            <!-- 自己的坦克 -->
           <div class="owner" :style="{height: height(1),width: width(1),
              left: owner.x +'px',bottom: owner.y +'px',transition:owner.transition,display: loading ? 'none' : 'block'
           }">
              <img :src="TKImg" style=""/>
           </div>
           <!-- 子弹盒子 -->
           <div class="bullet" :style="{height: height(0.5),width: width(0.5),
              left: bullet.x + 'px',bottom: bullet.y +'px',transition:bullet.transition,display: loading ? 'none' : 'block'
           }" v-if="bullet.show">
              <img :src="BTImg" style=""/>
           </div>
         </div>
         <img class="wait" src="/img/tank/wait.png" v-if="loading"  alt=""/>
         <default-dialog v-model:show="show" @back="emit('back')"/>
         <default-dialog v-model:show="showSucess" @back="emit('back')" text="闯关成功"/>
    </div>
  </template>
  <!-- 游戏区间按照 18:9 来计算  记住这个属性，很重要-->
  <script setup lang="ts">
  import {ref,reactive, onMounted, onBeforeUnmount, computed, watch} from "vue"
  import { Back } from '@element-plus/icons-vue';
  import { KEY } from '@/constants/key.ts';
  import defaultDialog from "@/components/dialog/defaultDialog.vue";
  import { 
    TenthWall as MapList,
} from './components/apiData';

const props = defineProps({
    wealth: {
      type: Object,
      default: () => ({})
    }
})
 
  let kills:any = reactive(props.wealth);
  const show = ref(false);
  const showSucess = ref(false);
  const gold = ref(0); // 当前金币
  const diam = ref(0); // 当前钻石
  const score = ref(0); // 当前得分
  const goldNum = ref(1); // 本关金币数量
  const enemyNum = ref(10); // 本关敌人数量
  const loading = ref(true);
  const emit = defineEmits(['back','increase','reduce','pass']);
  const light = ref("开灯");
  const TKImg = ref('/img/tank/tkl.png');
  const BTImg = ref('/img/tank/zdl.png');
  const direct = ref('LEFT');
  let enemyTimer:any = ref(null);  // 监测我方子弹与地方坦克的碰撞
  const bodyStatus = ref(false); // 让我方坦克处于无敌状态
  const stopStatus = ref(false); // 停止敌方坦克运动
  const killTimer1:any = ref(0); // 冰封状态时间
  const killTimer2:any = ref(0); // 无敌状态时间
  const Timer1 :any = ref(null);  //  冰封状态定时器
  const Timer2 :any = ref(null);   // 无敌状态定时器

  
  // 游戏资源
  const content:any = ref(null)
  // 默认unit px
  const width:any = (rate = 1,unit = 'px')=> {
    return content.value ? (content.value.offsetWidth / 18) * rate + unit : 0 + unit
  }
  const height:any = (rate = 1,unit = 'px')=> {
     return content.value ? (content.value.offsetHeight / 9)  * rate + unit : 0 + unit
  }
  const wallList:any =reactive({
    // x <=17 y <=8
      list: []
  })
  const goldList:any =reactive({
    // x <=17 y <=8
      list: []
  })
  const enemyList:any =reactive({
    // x <=17 y <=8
      list: [],
  })
  const owner:any = reactive({
      // 距离左边距离
      x: 0,
      // 距离底部距离
      y: 0,
      transition: 'all 0.2s linear'
  });
  const bullet:any = reactive({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      show: false,
      // 子弹速度
      speed: 50,
      transition: 'all 0.05s linear',
      timer: null,
      status: false,  //  status为true时，子弹在运动(不允许点头)
  })
  watch(() => owner.x, (newValue, oldValue) => {
      if (newValue < 0) {
          owner.x = 0;
      }else if (newValue > width(17,0)) {
          owner.x = width(17,0)
      }
  });
  watch(() => owner.y, (newValue, oldValue) => {
      if( newValue < 0){
          owner.y = 0
      }else if(newValue > height(8,0)){
          owner.y = height(8,0)
      }
  })
  watch(() => bullet.x, (newValue, oldValue) => {
      if (newValue < -width(0.5,0)) {
         resertBullent()
      }else if (newValue > width(17.5,0)) {
        resertBullent()
      }
      bullet.left = Number((bullet.x / width(1,0)).toFixed(0));
  });
  watch(() => bullet.y, (newValue, oldValue) => {
      if( newValue < 0){
        resertBullent()
      }else if(newValue > height(9,0)){
        resertBullent()
      }
      bullet.top = Number((bullet.y / height(1,0)).toFixed(0));
  })
  watch(() => enemyList.list, (newValue, oldValue) => {
     if(enemyList.list.length === 0){
        clearInterval(enemyTimer.value); 
     }
  },{ deep: true })
  watch(() =>props.wealth, (newValue, oldValue) => {
       kills = newValue;
  },{ deep: true })
  // 重置子弹位置
  const resertBullent = () => {
        bullet.x = 0;
        bullet.y = 0;
        bullet.show = false;
        bullet.status = false;
        clearInterval(bullet.timer)
        bullet.timer = null;
  }
  const lightChange = () => {
      if(light.value === "开灯"){
          light.value = "关灯"
      }else{
          light.value = "开灯"
      }
  }
  const handleKeyDown = (event: KeyboardEvent) => {
      if(!event.key) return
      // 障碍物
      const arr = MapList.map((item:any) => {
        return {
            x: item.x * width(1,0),
            y: item.y * height(1,0)
        }
      })
      const gold = goldList.list.map((item:any) => {
        return {
            x: item.x * width(1,0),
            y: item.y * height(1,0),
            id: item.id
        }
      })
      let flag = true;
      if(KEY['UP'].includes(event.key)){
            TKImg.value = '/img/tank/tkt.png'
            direct.value = 'UP'
            arr.forEach((item:any) => {
                if(Math.abs(item.x - owner.x) < 1 && Math.abs(height(7,0) - owner.y - item.y) < 1){
                    flag = false;
                }
            })
            if(!flag) return;
            owner.y += height(1,0);
            boom(null,null, enemyList.list)
            gold.forEach((item:any) => {
                if(Math.abs(item.x - owner.x) < 1 && Math.abs(height(8,0) - owner.y - item.y) < 1){
                    eatingGold(item.id)
                }
            })
      } else if(KEY['DOWN'].includes(event.key)){
          TKImg.value = '/img/tank/tkb.png'
          direct.value = 'DOWN'
          arr.forEach((item:any) => {
                if(Math.abs(item.x - owner.x) < 1 && Math.abs(height(9,0) - owner.y - item.y) < 1){
                    flag = false;
                }
            })
            if(!flag) return;
            owner.y -= height(1,0);
            boom(null,null, enemyList.list)
            gold.forEach((item:any) => {
                if(Math.abs(item.x - owner.x) < 1 && Math.abs(height(8,0) - owner.y - item.y) < 1){
                    eatingGold(item.id)
                }
            })
      } else if(KEY['LEFT'].includes(event.key)){
          TKImg.value = '/img/tank/tkl.png'
          direct.value = 'LEFT'
          arr.forEach((item:any) => {
                if(Math.abs(item.x - owner.x + width(1,0)) < 1 && Math.abs(height(8,0) - owner.y - item.y) < 1){
                    flag = false;
                }
          })
          if(!flag) return;
          owner.x -= width(1,0);
          boom(null,null, enemyList.list)
          gold.forEach((item:any) => {
                if(Math.abs(item.x - owner.x) < 1 && Math.abs(height(8,0) - owner.y - item.y) < 1){
                    eatingGold(item.id)
                }
          })
      } else if(KEY['RIGHT'].includes(event.key)){
          TKImg.value = '/img/tank/tkr.png'
          direct.value = 'RIGHT'
          arr.forEach((item:any) => {
                if(Math.abs(item.x - owner.x - width(1,0)) < 1 && Math.abs(height(8,0) - owner.y - item.y) < 1){
                    flag = false;
                }
          })
          if(!flag) return;
          owner.x += width(1,0);
          boom(null,null, enemyList.list)
          gold.forEach((item:any) => {
                if(Math.abs(item.x - owner.x) < 1 && Math.abs(height(8,0) - owner.y - item.y) < 1){
                    eatingGold(item.id)
                }
          })
      }else if(KEY['ATTACK'].includes(event.key)){
          bullet.show = true;
          bullet.status = true;
          let arrz:any = 10000;
          let arrd:any = 0;
          let i:any = 0;
          if(bullet.timer) return;
          if(direct.value === 'UP'){
              BTImg.value = '/img/tank/zdt.png'
              bullet.y = owner.y + height(1,0);
              bullet.x = owner.x + width(0.2,0);
              bullet.timer = setInterval(() => {
                arr.forEach((item:any) => {
                    if(flag && bullet.x <= item.x + width(1,0) && bullet.x >= item.x && Math.abs(bullet.y + item.y - height(8,0)) < 1 ){
                        flag = false;
                        resertBullent();
                    }
                })
                if(flag) bullet.y += height(0.5,0)
              },bullet.speed)
          } else if(direct.value === 'DOWN'){
              BTImg.value = '/img/tank/zdb.png'
              bullet.y = owner.y - height(0.5,0);
              bullet.x = owner.x + width(0.2,0);
              let ownerBackX = owner.x;
              let ownerBackY = owner.y;
              bullet.timer = setInterval(() => {
                arr.forEach((item:any , index:any) => {
                if(Math.abs(item.x - ownerBackX) < 1 ){
                            if(item.y > (height(8,0) - ownerBackY) && (item.y - height(8,0) + ownerBackY) < arrz) {
                                arrz = (item.y - height(8,0) + ownerBackY);
                            };
                        };
                
                });  
                arrd = (arrz / height(1,0)).toFixed(0) * 1 - 1;
                bullet.y -= height(0.5,0)
                i++;
                if (i == arrd*2 || arrd == 0){
                        i = 0;
                        arrz = 10000;
                        arrd = 0;
                        resertBullent()
                    }
              },bullet.speed)
          } else if(direct.value === 'LEFT'){
              BTImg.value = '/img/tank/zdl.png'
              bullet.y = owner.y + height(0.2,0);
              bullet.x = owner.x - width(0.5,0);
              let ownerBackX = owner.x;
              let ownerBackY = owner.y;
              bullet.timer = setInterval(() => {arr.forEach((item:any , index:any) => {
               if(Math.abs(height(8,0) - item.y - ownerBackY) < 1 ){
                        if(item.x < ownerBackX && ownerBackX - item.x < arrz) arrz = ownerBackX - item.x;
                   }
                });  
                arrd = (arrz / width(1,0)).toFixed(0) * 1 - 1;
                bullet.x -= width(0.5,0)
                i++;
                if  (i == arrd*2 || arrd == 0){
                    i = 0;
                    arrz = 10000;
                    arrd = 0;
                    resertBullent()
                }
              },bullet.speed)
          } else if(direct.value === 'RIGHT'){
              BTImg.value = '/img/tank/zdr.png'
              bullet.x = owner.x + width(1,0);
              bullet.y = owner.y + height(0.2,0);
              let ownerBackX = owner.x;
              let ownerBackY = owner.y;
              bullet.timer = setInterval(() => {
                arr.forEach((item:any , index:any) => {
                if(Math.abs(height(8,0) - item.y - ownerBackY) < 1 ){
                        if(item.x > ownerBackX && item.x - ownerBackX < arrz) arrz = item.x - ownerBackX;
                    };
                });  
                arrd = (arrz/width(1,0)).toFixed(0)*1 - 1;
                bullet.x += width(0.5,0)
                i++;
                if  (i == arrd*2 || arrd == 0){
                        i = 0;
                        arrz = 10000;
                        arrd = 0;
                        resertBullent()
                }
              },bullet.speed)
          }
          
      }else if(KEY['K'].includes(event.key)){
         if(kills.kill1 > 0){ 
            killTimer1.value += 10;
            stopStatus.value = true;
            emit('reduce', {type: 'kill1'});
            if(Timer1.value) return;
            Timer1.value = setInterval(() => {
                killTimer1.value -= 1;
                if(killTimer1.value === 0) {
                    stopStatus.value = false;
                    clearInterval(Timer1.value)
                }
            },1000)
         }
      }else if(KEY['L'].includes(event.key)){
         if(kills.kill2 > 0){ 
            killTimer2.value += 10;
            bodyStatus.value = true;
            emit('reduce', {type: 'kill2'});
            if(Timer2.value) return;
            Timer2.value = setInterval(() => {
                killTimer2.value -= 1;
                if(killTimer2.value === 0) {
                    bodyStatus.value = false;
                    clearInterval(Timer2.value)
                }
            },1000)
         }
      }   
      if(bodyStatus.value){
         TKImg.value = '/img/tank/bang.png'
      }
  }
  const eatingGold = (id:any)=>{
    if(!id) return;
    const index = goldList.list.findIndex((item:any) => item.id === id);
    if (index !== -1) {
        goldList.list.splice(index, 1);
        gold.value += 1;
        emit('increase', {type: 'money',num: 1});
        passGame()
    }
  }
  const eatingEnemy = (id:any)=>{
    if(!id) return;
    const index = enemyList.list.findIndex((item:any) => item.id === id);
    if (index !== -1) {
        enemyList.list[index].timer && clearInterval(enemyList.list[index].timer);
        enemyList.list[index].img = '/img/tank/bang.png';
        setTimeout(() => {
            enemyList.list.splice(index, 1);
            score.value += 1;
            emit('increase', {type: 'score',num: 1});
            passGame()
        },500)
    }
  }
  // 下一关
  const passGame = () => {
      if(enemyList.list.length === 0 && goldList.list.length === 0){
         diam.value += 10;
         emit('increase', {type: 'diam',num: 10});
         setTimeout(() => {
            emit('pass');
            showSucess.value = true;
         },1000)
      }
  }
  // 初始化位置
  const setLocation = () => {
      owner.x = width(7,0);
      owner.y = height(0,0);
  }
  // 赋值砖块
const setWall = () => {
      wallList.list = MapList.map((item:any) => {
          const k = item.i ===0 ? 1 : item.i;
          return {
             x:item.x,
             y:item.y,
             img:`/img/tank/zk${k}.png`,
             id: item.x + '---' + item.y,
          }
      });
      let goldArr = []
      while(goldArr.length < goldNum.value){
          const arr = RandomData(1)
          let list = wallList.list.find((item:any) => {
              return item.x === arr[0].x && item.y === arr[0].y
          })
          if(arr[0].x === 7 && arr[0].y === 8) list = true;
          if(!list) {
              goldArr.push(arr[0])
          }
      }
      goldList.list = goldArr.map((item:any) => {
          return {
             x:item.x,
             y:item.y,
             img:`/img/tank/gold.png`,
             id: item.x + '---' + item.y,
          }
      });
      let enemyArr = []
      while(enemyArr.length < enemyNum.value){
          const arr = RandomData(1)
          let list = wallList.list.find((item:any) => {
              return item.x === arr[0].x && item.y === arr[0].y
          })
          if(arr[0].x === 7 && arr[0].y === 8) list = true;
          if(!list) {
              enemyArr.push(arr[0])
          }
      }
      enemyList.list = enemyArr.map((item:any) => {
          const k = item.i ===0 ? 1 : item.i;
          return {
             x:item.x,
             y:item.y,
             img:`/img/tank/tk${k}b.png`,
             id: item.x + '---' + item.y,
             timer:null,
          }
      });
      moveBy(enemyList.list)
}
// 碰撞敌方坦克爆炸
const boom = (x:any,y:any,arr:any) => {
    if(arr){
        arr.forEach((item:any) => {
                let arrr = ((height(8,0) - owner.y)/height(1,0)).toFixed(0) * 1;  //坦克的y转变为123
                let arrj = (owner.x/width(1,0)).toFixed(0) * 1;  //坦克的x转变为123
                if(Math.abs(item.y - arrr) < 1 && Math.abs(item.x - arrj) < 1) {
                    TKImg.value = '/img/tank/bang.png'
                    setTimeout(() => {
                        GameOver()
                    },500)
                }
        })
    }else{
        let arrr = ((height(8,0) - owner.y)/height(1,0)).toFixed(0) * 1;
        let arrj = (owner.x/width(1,0)).toFixed(0) * 1;
        if(Math.abs(y - arrr) < 1 && Math.abs(x - arrj) < 1) {
            TKImg.value = '/img/tank/bang.png'
            setTimeout(() => {
                GameOver()
            },500)
        }
    }
}
// 移动其它坦克
const moveBy = (list:any) => {
     list.forEach((item:any) => {
         item.timer = setInterval(() => {
             const random = Math.floor(Math.random() * 4);
             if(stopStatus.value) return;
             if(random === 0){
                 const flag =  MapList.find((i:any) => i.x === item.x && i.y === item.y + 1);
                 const flag2 = enemyList.list.find((i:any) => i.x === item.x && i.y === item.y + 1);
                 if(flag || flag2) return;
                 if(item.y + 1 > 8) return;
                 item.img = item.img.slice(0, item.img.length - 5) + 'b' + item.img.slice(item.img.length - 4);
                 item.y += 1;
                 boom(item.x,item.y,null);
             } else if(random === 1){
                const flag =  MapList.find((i:any) => i.x === item.x && i.y === item.y - 1)
                const flag2 = enemyList.list.find((i:any) => i.x === item.x && i.y === item.y - 1);
                 if(flag || flag2) return;
                if(item.y - 1 < 0) return;
                 item.img = item.img.slice(0, item.img.length - 5) + 't' + item.img.slice(item.img.length - 4);
                 item.y -= 1;
                 boom(item.x,item.y,null);
             } else if(random === 2){
                const flag =  MapList.find((i:any) => i.x === item.x - 1 && i.y === item.y)
                const flag2 = enemyList.list.find((i:any) => i.x === item.x - 1 && i.y === item.y);
                if(flag || flag2) return;
                if(item.x - 1 < 0) return;
                item.img = item.img.slice(0, item.img.length - 5) + 'l' + item.img.slice(item.img.length - 4);
                item.x -= 1;
                boom(item.x,item.y,null);
             } else if(random === 3){
                const flag =  MapList.find((i:any) => i.x === item.x + 1 && i.y === item.y)
                const flag2 = enemyList.list.find((i:any) => i.x === item.x + 1 && i.y === item.y);
                if(flag || flag2) return;
                if(item.x + 1 > 17) return;
                 item.img = item.img.slice(0, item.img.length - 5) + 'r' + item.img.slice(item.img.length - 4);
                 item.x += 1;
                 boom(item.x,item.y,null);
             }
      }, 1000)
     })
}
const RandomData = (num:number) => {
  const possiblePairs = [];
  for (let x = 0; x <= 17; x++) {
    for (let y = 0; y <= 8; y++) {
      possiblePairs.push({ x, y });
    }
  }
  const shuffledPairs = possiblePairs.sort(() => Math.random() - 0.5);
  const selectedPairs = shuffledPairs.slice(0, num);
  const randomData = selectedPairs.map(pair => ({
    ...pair,
    i: Math.floor(Math.random() * 5) === 0 ? 1 : Math.floor(Math.random() * 5), 
  }));
  return randomData;
}
// 监测子弹和敌方坦克的碰撞
const impact = (list:any) => {
    list.forEach((item:any) => {
        const x = item.x * width(1,0);
        const y = item.y * height(1,0);
        // 监测敌法坦克与我放子弹碰撞，子弹位置  (bullet.x,height(9,0) - bullet.y), 敌方坦克位置 (x,y)
        if(x <= bullet.x && x + width(1,0) >= bullet.x
          && height(9,0) - bullet.y >= y && height(9,0) - bullet.y  <= y + height(1,0)){
            eatingEnemy(item.id);
            resertBullent();
        }
    })
}
// 游戏结束
const GameOver = () => {
    if(bodyStatus.value) return;
    clearInterval(bullet.timer);
    clearInterval(enemyTimer.value);
    enemyList.list.forEach((item:any) => {
        clearInterval(item.timer)
    })
    show.value = true;
    bodyStatus.value = true;
}
  onMounted(() => {
      // 赋值坦克初始位置 
      setLocation();
      // 赋值砖块、 金币、敌人
      setWall();
      // 1000:设置一秒后执行一次
      loading.value = true
      setTimeout(() => {
          loading.value = false
      },1000)
      enemyTimer.value = setInterval(() => {
        impact(enemyList.list)
      },50)
      window.addEventListener('keydown', handleKeyDown);
  })
  
  onBeforeUnmount(() => {
      window.removeEventListener('keydown', handleKeyDown);
     //  清楚浏览器上的定时器
      clearInterval(bullet.timer);
      clearInterval(enemyTimer.value);
      enemyList.list.forEach((item:any) => {
          clearInterval(item.timer)
      })
  });
  
  </script>
  <style lang="scss" scoped>
  .gamePass{
      position: relative;
      color: #fff;
      background-color: #191919;
      height: 100vh;
      background-image: url('/img/tank/bg.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      .top{
          width: 96%;
          margin: 0 auto;
          height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          .light{
              display: flex;
              cursor: pointer;
              font-weight: bold;
              font-size: 18px;
          }
          .score{
            position: absolute;
            height: 60px;
            line-height: 60px;
            top: 0;
            right: 100px;
            width: 300px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            font-size: 18px;
            .text{
                color: #76311b;
            }
            .value{
                color: #fff;
            }
          }
          .kill{
            position: absolute;
            left: 100px;
            top: 0;
            line-height: 60px;
            height: 60px;
            color: #0bbde3;
            font-weight: bold;
            font-size: 20px;
          }
          .back{
              cursor: pointer;
          }
      }
      .content{
          height: calc(100vh - 120px);
          width: 96%;
          margin: 0 auto;
          background-color: #000;
          position: relative;
          .wall{
              position: absolute;
              img{
                  width: 100%;
                  height: 100%;
              }
          }
          .gold{
              position: absolute;
              transition: all 0.3s;
              img{
                  width: 100%;
                  height: 100%;
              }
          }
          .enemy{
              position: absolute;
              transition: all 1s;
              img{
                  width: 100%;
                  height: 100%;
              }
          }
          .boss{
              position: absolute;
              bottom: 0;
          }
          .owner{
              position: absolute;
              img{
                 width: 100%;
                 height: 100%;
              }
          }
          .bullet{
              position: absolute;
              img{
                 width: 100%;
                 height: 100%;
              }
          }
      }
      .wait{
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: auto;
      }
  }
  .gradient-text {
    font-weight: bold;
    text-shadow: 
      0 0 5px rgba(0, 0, 0, 0.8), 
      0 0 10px rgba(0, 0, 0, 0.8), 
      0 0 15px rgba(0, 0, 0, 0.8); /* 微妙的描边效果 */
      transform: skewX(-20deg); /* 倾斜文字 */
      animation: fadeIn 1.5s ease-out;
  }
  
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  </style>
  