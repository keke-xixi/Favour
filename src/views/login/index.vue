<template>
  <div class="loginContainer">
    <div style="width: 50%;height: 100%;display: flex;align-items: center;justify-content: center;">
          <div  class="z-3d" >
            <span style="--i: 1;"><img src="/img/game/data/img10.png" alt=""/></span>
            <span style="--i: 2;"><img src="/img/game/data/img2.png" alt=""/></span>
            <span style="--i: 3;"><img src="/img/game/data/img9.png" alt=""/></span>
            <span style="--i: 4;"><img src="/img/game/data/img4.png" alt=""/></span>
            <span style="--i: 5;"><img src="/img/game/data/img5.png" alt=""/></span>
            <span style="--i: 6;"><img src="/img/game/data/img6.png" alt=""/></span>
            <span style="--i: 7;"><img src="/img/game/data/img7.png" alt=""/></span>
            <span style="--i: 8;"><img src="/img/game/data/img8.png" alt=""/></span>
          </div>
    </div>
    <div class="login flex_c" style="width: 50%;height: 100%;">
   <div class="login-content" :style="{transform: statusKey == 'register' ? 'rotateY(360deg)':''}">
       <div class="login-title" >
           <h1 class="text_s" v-show="statusKey === 'login'">
             <span style="color: #4b73f1;">L</span>
             <span style="color: #ea4335;">O</span>
             <span style="color: #fbbc05;">G</span>
             <span style="color: #34a853;">I</span>
             <span style="color: #ea4335;">N</span>
           </h1>
           <h1 class="text_s" v-show="statusKey === 'register'">
             <span style="color: #4b73f1;">R</span>
             <span style="color: #ea4335;">E</span>
             <span style="color: #fbbc05;">G</span>
             <span style="color: #34a853;">I</span>
             <span style="color: #ea4335;">S</span>
             <span style="color: #ff8f00;">T</span>
             <span style="color: #ea4335;">E</span>
             <span style="color: #7178dc;">R</span>
           </h1>
       </div>
       <div class="flex_l">
            <ZInput label="账号" v-model="username" width="60%" @submit="submitEnter" />
       </div>
       <div class="flex_l">
           <ZInput type="password" label="密码" v-model="password" width="60%" @submit="submitEnter"/>
       </div>
       <div class="login-submit" >
           <el-button type="primary" :loading="loading" @click="login" v-show="statusKey === 'login'"
           :style="{color:loading ? '#033a9a':''}">
                <div v-show="!loading">
                    <span style="color: #ea4335;">登</span>
                    &nbsp;
                    <span style="color: #ea4335;">录</span>
                </div>
            </el-button>
            <el-button type="primary" :loading="loading" @click="register" v-show="statusKey === 'register'"
           :style="{color:loading ? '#033a9a':''}">
                <div v-show="!loading">
                    <span style="color: #7178dc;">注</span>
                    &nbsp;
                    <span style="color: #7178dc;">册</span>
                </div>
            </el-button>
       </div>
       <div class="login-tips" style="justify-content: space-between;">
            <span class="over-font" style="color: #ea4335;" v-if="statusKey === 'login'" @click="statusKey = 'register'">注册</span>
            <span class="over-font" style="color: #7178dc;" v-if="statusKey === 'register'" @click="statusKey = 'login'">登录</span>
            <span class="over-font" v-show="loadingStatusKey" @click="retrieveStatus = true"  @mouseenter="mouseenter"  @mouseleave="mouseleave" :style="{color:statusKey === 'login' ? '#ea4335':'#7178dc'}">找回密码</span>
       </div>
       <div class="login-introduce">
        <el-tooltip placement="left" :show-arrow="false">
            <template #content>
                <div style="padding: 15px;font-size: 14px;color:#d3e3fd">
                    <p>1. 免费游戏网站、纯前端、无需介绍、注册后可直接入手玩</p>
                    <p>2. 新号注册送 100金币，100积分，60钻石</p>
                </div>
            </template>
            <img src="/img/game/info.svg" alt="" style="width: 22px;height: 22px;cursor: pointer;">
        </el-tooltip>
       </div>
   </div>
   <div class="login-alerts" v-show="retrieveStatus" :style="alertsStyle"  @mouseenter="showPopup = true" @mouseleave="showPopup = false,retrieveStatus = false">
       <el-card style="background-color: #292929;color: #fff;border:none;height: 100%;width: 100%;">
           <div>
                <span style="font-size: 16px;">
                <el-icon><Warning /></el-icon>
                找回密码</span>
           </div>
           <z-input placeholder="请输入账号" style="margin-top: 15px;" @submit="lookFor" v-model="account" width="70%"/>
           <el-button type="primary" class="find-box" @click="lookFor">
             找回
          </el-button>
       </el-card>
    </div>
    </div>
</div>
  
</template>
<script setup lang="ts">
import { ref,reactive,Ref,watch, computed } from "vue";
import { useRouter } from 'vue-router';
import { RefreshRight,Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus'
import Moon from '@/components/animate/moon.vue';
import { useStore } from 'vuex';
const store = useStore();
const router = useRouter();

const username:Ref<String> = ref('');
const password:Ref<String> = ref('');
const account:Ref<String> = ref('');
const showPopup:Ref<Boolean> = ref(true);
const retrieveStatus:Ref<Boolean> = ref(false);
const loadingStatusKey:Ref<Boolean> = ref(true);
interface User {
  username: string; 
  password: string;
  money: number;
  score: number;
  diam: number;
}
const alertsStyle:any = ref({
    left: 0,
    top: 0
});

const gold = ref(100);  // 注册送的金币数量
const score = ref(100);  // 注册送的积分数量
const diam = ref(60);  // 注册送的钻石数量
const loading = ref(false);
const statusKey:any = ref('login');
const setUser = (info: any) => store.commit('setUser',info);

const login = () => {
    if(!username.value || !password.value) {
        ElMessage({
            message: '请输入账户名和密码',
            type: 'warning',
        })
    }else{
        const playerInfo = JSON.parse(localStorage.getItem('playerInfo') || '{}');
        if(playerInfo[username.value.toString()] && playerInfo[username.value.toString()].password === password.value.toString()) {
            loading.value = true
            setUser({
                username:username.value.toString(),
                password:password.value.toString(),
            })
            localStorage.setItem('onlineUser',JSON.stringify({
                username:username.value.toString(),
                password:password.value.toString(),
            }))
                setTimeout(() => {
                    loading.value = false;
                    router.push('/home')
                }, 1000);
        }else{
            ElMessage({
                message: '账号或密码错误',
                type: 'error',
            })
        }
    }
}
const register = () => {
    if(!username.value || !password.value) {
        ElMessage({
            message: '请输入账户名和密码',
            type: 'warning',
        })
    }else{
        const playerInfo = JSON.parse(localStorage.getItem('playerInfo') || '{}');
        if (Object.keys(playerInfo).length > 100) {
            ElMessage({
                message: '服务器人数已满,请稍后再试',
                type: 'error',
            })
        }
        const data:User = {
            username:username.value.toString(),
            password:password.value.toString(),
            money: gold.value,
            score: score.value,
            diam: diam.value,
        }
        if(playerInfo[username.value.toString()]) {
            // playerInfo[username.value.toString()].password = password.value.toString();
            ElMessage({
                message: '该账户已注册',
                type: 'warning',
            })
            return
        }else{
            playerInfo[username.value.toString()] = data;
            delete playerInfo.password
        }
        
        localStorage.setItem('playerInfo',JSON.stringify(playerInfo))
        loading.value = true
        setTimeout(() => {
            loading.value = false;
            statusKey.value = 'login'
            ElMessage({
                message: '注册成功,请登录',
                type: 'success',
                plain: true,
            })
        }, 1000);
    }
    
}
const submitEnter = () => {
    statusKey.value === 'login' ? login() : register()
}
const mouseenter = (e:any) => {
    const { clientX , clientY } = e;
    retrieveStatus.value = true
    alertsStyle.value.left = clientX + 20 + 'px'
    alertsStyle.value.top = clientY - 180 + 'px'
}
const mouseleave = (e:any) => {
    setTimeout(() => {
        if(showPopup.value) return
        retrieveStatus.value = false
        account.value = ''
    },500)
}
const lookFor = () => {
    if(!account.value) return
    const playerInfo = JSON.parse(localStorage.getItem('playerInfo') || '{}');
    if(playerInfo[account.value.toString()]) {
        ElMessage({
            message: '账号'+account.value+'的密码为: ' + playerInfo[account.value.toString()].password,
            type: 'success',
            plain: true,
        })
        showPopup.value = false
    }else{
        ElMessage({
            message: '该账号不存在',
            type: 'warning',
            plain: true,
        })
    }
}
watch(() => statusKey.value, () => {
    username.value = ''
    password.value = ''
    loadingStatusKey.value = false
    showPopup.value = false
    setTimeout(() => {
        loadingStatusKey.value = true
    },600)
})


</script>
<style lang="scss" scoped>
.loginContainer{
    display: flex;
    height: 100vh;
    background-image: url('/img/game/bg.jpg');
    background-position: 100%;
    background-repeat: no-repeat;
    background-size: cover;
}
.login{
    height: 100%;
    .login-content{
        position: relative;
        overflow: visible;
        width: 40vw;
        height: 370px;
        // background-color: rgba(121, 187, 255,0.6);
        background-color: rgba(0, 0, 0, .4);
        // background-image: url('/img/game/mofa4.jpg');
        // background-position: 100%;
        // background-repeat: no-repeat;
        // background-size: cover;
        border-radius: 5px;
        text-align: center;
        overflow: hidden;
        transition: all 0.6s;
        transform-style: preserve-3d;
        .login-title{
            width: 100%;
            height: 60px;
            margin-top: 60px;
            font-style: italic;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        .login-submit{
            margin-top: 20px;
            button{
                width: 160px;
                height: 40px;
                border-radius: 5px;
                font-size: 18px;
                font-weight: 600;
                background-color: #ddf2fb;
                color: #fff;
                margin-top: 20px;
                border: none;
                cursor: pointer;
                &:hover{
                    width: 166px;
                    height: 44px;
                    font-size: 19px;
                    background-color: #fff;
                    color: #0447b9;
                    border: 2px solid #2878ff;
                }
            }
        }
        &::before {
            content: '';
            position: absolute;
            top: 0;
            right: -50px;
            width: 100px;
            height: 50px;
            border-radius: 0 0 50px 50px;
            // background:  radial-gradient(circle,#5e60ce,#79bbff,#c6e2ff, #fff);
            // background:  radial-gradient(circle,#fff,#79bbff,#c6e2ff, #ea4335);
            transform: rotate(0);
            transform-origin: top right;
        }
        .login-tips{
            width: 160px;
            margin-left: calc(50% - 80px);
            margin-top: 20px;
            font-size: 14px;
            color: #ea4335;
            display: flex;
            justify-content: space-around;
        }
        .login-introduce{
            position: absolute;
            right: 20px;
            top: 20px;
        }
    }
}
.login-alerts{
    position: fixed;
    width: 300px;
    height: 180px;
    z-index: 999;
    ::after{
        content: '';
        position: absolute;
        bottom: 5px;         /* 放置在底部 */
        left: -9px;           /* 放置在左侧 */
        width: 0;          /* 三角形的宽度 */
        height: 0;         /* 三角形的高度 */
        border-top: 10px solid transparent;    /* 上边透明 */
        border-bottom: 10px solid transparent; /* 下边透明 */
        border-right: 10px solid #292929;    
    }
}
.find-box{
    background-color: #ff6022;
    height: 30px;
    line-height: 30px;
    border: none;
    font-size: 14px;
    border-radius: 15px;
    margin: 20px;
    width: 100px;
    text-align: center;
}
</style>
