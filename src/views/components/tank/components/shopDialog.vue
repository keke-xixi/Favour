<template>
    <el-dialog v-model="showDialog" width="60%" :align-center="true" :show-close="false"
    :style="{ backgroundColor: '#000 !important',postion: 'relative'}">
        <div class="dialog-content">
             <div v-for="(skill,i) in skills" :key="skill.name" class="skill-item">
                <div class="skill-name">{{skill.name}}</div>
                <div class="skill-desc">{{skill.desc}}</div>
                <div class="skill-price">{{skill.price}}</div>
                <div class="skill-key">{{skill.key}}</div>
                <img :src="skill.img" alt="" v-if="skill.img" >
                <div v-else style="width: 60px;text-align: center;">货币</div>
                <button class="z-button" style="height: 36px;margin-left: 25px;font-size: 14px;" @click="goShop(skill)" v-if="i!==0">购买</button>
             </div>
        </div>
        <div class="money-content">
            <span>金币：{{ wealth.money }}</span>
            <span style="margin-left: 50px;">钻石：{{ wealth.diam }}</span>
        </div>
        <template #footer>
            <div class="dialog-footer">
               
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { ElMessage } from "element-plus";
import { nextTick, onMounted, reactive, ref, watch } from "vue"
import { useStore } from "vuex";

const store = useStore()
const emit = defineEmits(['save', 'update:show','add']);
const props = defineProps({
    show: {
        type: Boolean,
        required: true
    }
});
const showDialog = ref(props.show);
const wealth = reactive({
    money: 0,
    diam: 0,
})
const skills = ref([
    {
        name: '技能',
        desc: '技能介绍',
        img: '',
        key:'按键',
        price: '价格',
    },
    {
        name: '冻结吧',
        desc: '冻结敌方坦克，使其无法移动10秒',
        img: '/img/game/gold.png',
        id: 'money',
        key:'K',
        price: 5
    },
    {
        name: '金刚不坏',
        desc: '使己方坦克获得10秒无敌状态',
        img: '/img/game/zs.png',
        id: 'diam',
        key:'L',
        price: 1
    },
])

const goShop = (skill: any) => {
    if(!skill.id) return;
    let userInfo:any = store.getters.getOnlineUser;
    if(skill.id === 'money'){
        if(wealth.money < skill.price) return ElMessage.warning({ message: '金币不足', duration: 1000});
        wealth.money -= skill.price;
        userInfo.money -= skill.price;
        store.dispatch('updatePlayerInfo',userInfo);
        emit('add',{type: 'kill1'})
    }else{
        if(wealth.diam < skill.price) return ElMessage.warning({ message: '钻石不足', duration: 1000});
        wealth.diam -= skill.price
        userInfo.diam -= skill.price;
        store.dispatch('updatePlayerInfo',userInfo);
        emit('add',{type: 'kill2'})
    }
    
}
watch(() => props.show, (val) => {
    showDialog.value = val;
    nextTick(() => {
       // 获取当前在线用户信息
       let info:any = store.getters.getOnlineUser
       wealth.money = info.money ? info.money : 0
       wealth.diam = info.diam ? info.diam : 0
   })
});
watch(() => showDialog.value, (val) => {
    if (!val) {
        emit('update:show', val)
    }
})
onMounted(() => {
   
})

</script>

<style lang="scss" scoped>
.dialog-content {
    width: 100%;
    color: #9cdcfe;
    .skill-item{
        display: flex;
        height: 60px;
        align-items: center;
        .skill-name{
            width: 100px;
            text-align: center;
        }
        .skill-desc{
            width: 300px;
            text-align: center;
        }
        .skill-price{
            width: 100px;
            text-align: center;
        }
        .skill-key{
            width: 100px;
            text-align: center;
        }
        img{
            width: 80px;
            height: 60px;
        }
    }
}
.dialog-footer {
    width: 100%;
}
.money-content{
    position: absolute;
    right: 20px;
    top: 10px;
    color: #9cdcfe;
    width: 50%;
    text-align: right;
}
</style>