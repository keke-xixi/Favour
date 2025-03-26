<template>
  <div class="tab" @click="searchStatus = false">
     <div class="tab-input" >
       <ZInput placeholder="请输入搜索内容"  rightIcon :customStyle="{background:'#020203',color:'#fff'}"
        focus @focusChange="focusChange" @submit="submit"/>
     </div>
     <div class="tab-icon">
      <img src="/img/game/xx.png" alt="" style="width: 40px;height: 40px;cursor: pointer;">
      <el-dropdown :hide-on-click="false">
            <span class="dropdown-link">
              玩家 {{ userData.username || '' }}<el-icon class="el-icon--right" ><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="router.push('/home')">首页</el-dropdown-item>
                  <el-dropdown-item>个人信息</el-dropdown-item>
                  <el-dropdown-item divided @click="leave">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
      </el-dropdown>
     </div>
     
     <div v-show="searchStatus" class="search-alert" @click.stop="keepStatus" @mouseleave="status = false">
        <h4>最近搜索</h4>
        <div v-if="searchList.length" style="max-height: 360px;">
           <div v-for="item in searchList" :key="item" class="search-item" @click.stop="toGame(item)">
              <div>{{ item }}</div>
              <el-icon style="margin-top: 5px;" :size="20" @click.stop="removeSearch(item)"><Close /></el-icon>
           </div>
        </div>
        <div v-else style="display: flex;max-height: 360px;justify-content: center;align-items: center;">
          <p>暂无搜索记录</p>
        </div>
        <div class="more-search">
          <img src="/img/game/ls.png" alt="" style="width: 30px;height: 30px;margin-top: 5px;">
          <span style="font-size: 14px;margin-left: 10px;">更多热门搜索</span>
        </div>
     </div>
  </div>
</template>
<script setup lang="ts">
import {ref,reactive, computed, onMounted,nextTick } from "vue"
import { ArrowDown,Close } from '@element-plus/icons-vue'
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();
const searchStatus = ref(false);
const status = ref(false)
const searchList:any = reactive([])
const userData = computed(() => store.state.userInfo)
const leave = () => {
  localStorage.setItem('onlineUser','{}');
  router.push('/login')
}
const focusChange = (val: boolean) => {
   setTimeout(() => {
    if(status.value) return
    searchStatus.value = val
   },200)
  //  nextTick(() => {
  //   if(status.value) return
  //   searchStatus.value = val
  //  })
}
const sortHistory = (val: string) => {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
  const index = searchHistory.indexOf(val);
  searchHistory.splice(index,1);
  searchHistory.unshift(val);
  localStorage.setItem('searchHistory',JSON.stringify(searchHistory));
  searchList.splice(0, searchList.length, ...searchHistory);
}
const submit = (val: string) => {
  if(!val) return
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
  if(searchHistory.length){
    searchHistory.includes(val) ? sortHistory(val)  : searchHistory.unshift(val)
    if(searchHistory.length > 7){
      searchHistory.pop()
    }
    searchList.splice(0, searchList.length, ...searchHistory);
    localStorage.setItem('searchHistory',JSON.stringify(searchHistory));
  }else{
    localStorage.setItem('searchHistory',JSON.stringify([val]))
    searchList.push(val)
  }
}
const toGame = (val:any) => {
  keepStatus();
}
const keepStatus = () => {
  status.value = true
}
const removeSearch = (val:any) => {
  keepStatus();
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
  const index = searchHistory.indexOf(val);
  searchHistory.splice(index,1);
  localStorage.setItem('searchHistory',JSON.stringify(searchHistory));
  searchList.splice(0, searchList.length, ...searchHistory);
}
onMounted(() => {
  const searchHistory:Array<any> = JSON.parse(localStorage.getItem('searchHistory') || '[]');
  if(searchHistory.length){
    // 给reactive 数据赋值
    searchList.splice(0, searchList.length, ...searchHistory);
  }
})

</script>
<style lang="scss" scoped>
.tab{
    position: relative;
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    .tab-input{
      width: 500px;
      height: 60px;
      padding: 10px;
      padding-left: 0;
    }
    .tab-icon{
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .dropdown-link{
         color: #fff;
         height: 36px;
         line-height: 36px;
         text-align: center;
         margin-right: 30px;
         padding: 0 10px;
        //  border: 1px solid var(--main-color);
         border-radius: 4px;
      }
    }
}
.search-alert{
  width: 420px;
  height: 400px;
  background-color: rgba(0,0,0,0.8);
  position: absolute;
  top: 70px;
  left: 40px;
  z-index: 999;
  border-radius: 10px;
  color: #fff;
  padding:0 15px;
  .more-search{
    position: absolute;
    height: 40px;
    line-height: 40px;
    bottom: 15px;
    left: 15px;
    display: flex;
    cursor: pointer;
  }
}
.search-item{
  color: #fff;
  font-size: 15px;
  line-height: 40px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}
</style>
