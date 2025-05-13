<template>
    <div class="components-container">
        <div class="layer1"></div>
        <div class="layer2"></div>
        <div class="layer3"></div>
        <div class="layer4"></div>
        <div class="layer5"></div>
        <div class="z-title"></div>
       <div class="menuItem">
            <div v-for="item in list" :key="item.id" class="item">
                <div class="item-card">
                    <el-card @click="changeComponent(item)" :style="item.id === activeId ? activeStyle : customstyle">
                        {{ item.name }}
                    </el-card>
                </div>
            </div>
       </div>
       <div v-if="activeComponent" class="content">
            <component :is="activeComponent" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref,onMounted,shallowRef } from 'vue';
import animateExplode from './components/animateExplode.vue'
import dragPostion from './components/dragPostion.vue'
import move from './components/move.vue'
import crash from './components/crash.vue'
import star from './components/star.vue'
import drawCard from './components/drawCard.vue'
import rotate from './components/rotate.vue'
import rotate2 from './components/rotate2.vue'
import walk from './components/walk.vue'
import muchDiv from './components/muchDiv.vue'
import secondJump from './components/secondJump.vue'
import css from './components/css.vue'
import walk2 from './components/walk2.vue'
import translation from './components/translation.vue'
import background from './components/background.vue'
import background2 from './components/background2.vue'

// 当前激活的组件
const activeId = ref<number>(1)
const activeComponent = ref<any>(animateExplode)

// 所有组件列表
const list = ref<any>([
    { path: 'animateExplode', name: '爆炸动画', component: shallowRef(animateExplode),id: 1 },
    { path: 'dragPostion', name: '拖拽盒子', component: shallowRef(dragPostion) ,id: 2 },
    { path: 'move', name: '随机移动', component: shallowRef(move) ,id: 3 },
    { path: 'crash', name: '碰撞', component: shallowRef(crash) ,id: 4 },
    { path: 'star', name: '流星', component: shallowRef(star) ,id: 5 },
    { path: 'drawCard', name: '抽卡', component: shallowRef(drawCard) ,id: 6 },
    { path: 'rotate', name: '旋转', component: shallowRef(rotate) ,id: 7 },
    { path: 'rotate2', name: '周围旋转', component: shallowRef(rotate2) ,id: 8 },
    { path: 'walk', name: '走路', component: shallowRef(walk) ,id: 9 },
    { path: 'muchDiv', name: '生成大量盒子', component: shallowRef(muchDiv) ,id: 10 },
    { path: 'secondJump', name: '二段跳', component: shallowRef(secondJump) ,id: 11 },
    { path: 'css', name: 'css', component: shallowRef(css) ,id: 12 },
    { path: 'walk2', name: '移动盒子', component: shallowRef(walk2) ,id: 13 },
    { path: 'translation', name: '穿梭', component: shallowRef(translation) ,id: 14 },
    { path: 'background', name: '背景', component: shallowRef(background) ,id: 15 },
    { path: 'background2', name: '背景2', component: shallowRef(background2) ,id: 16 },
])

// 切换组件
const changeComponent = (item: any) => {
    activeId.value = item.id;
    activeComponent.value = item.component;
}

const activeStyle = ref<any>({
    backgroundColor: '#0078d4 !important',
    color: '#edf2fa',
})

// 样式
const customstyle = ref<any>({

})

onMounted(() => {
 
})

</script>

<style scoped lang="scss">
.components-container {
    height: 100%;
    width: 100%;
    display: flex;
    background-color: #1d1624;
    padding: 50px;
    color: #fff;
    .menuItem {
        height: calc(100vh - 100px);
        overflow-y: scroll;
        overflow-x: hidden;
        .item {
            width: 200px;
            display: flex;
            align-items: center;
            .item-card {
                margin: auto;
                width: 80%;
                height: 60px;
                background-color: #faebd7;
                cursor: pointer;
                z-index: 5;
            }
        }
    }
    .content {
        flex: 1;
        height: 80%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
.menuItem::-webkit-scrollbar {
  width: 10px;
}

.menuItem::-webkit-scrollbar-track {
  background: #fff;  // 轨道颜色
}

.menuItem::-webkit-scrollbar-thumb {
  background: #0077d4; // 滚动条颜色
  border-radius: 3px;
}

.menuItem::-webkit-scrollbar-thumb:hover {
  background: #fff;
}
</style>