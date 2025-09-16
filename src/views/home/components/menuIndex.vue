<template>
  <div class="menu">
    <div class="logo">
       <img src="/img/menu/logo.png" alt=""  style="width: 60px;height: 50px;"/>
       <h2 style="color: #fff;margin-left: 10px;">STUDY</h2>
    </div>

    <ul class="ul-box">
      <li v-for="a in menusList" :key="a.id" @click="toMenu(a)"
      :style="{
            color: nowIndex == a.id ? '#07c160' : '#fff', 
            fontSize: nowIndex == a.id ? '28px' : '18px', 
            fontWeight: nowIndex == a.id ? 'bold' : 'normal'}">
        {{  a.name  }}
      </li>
    </ul>
    
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted} from "vue"
import  menus  from "@/api/menu/index.js"
import { useRouter } from "vue-router";

const router = useRouter();
const menusList = ref(menus)
const nowIndex = ref(999)

const toMenu = (a:any)=>{
  nowIndex.value = a.id
  router.push(a.path)
}

onMounted(()=>{
   
   
})
</script>
<style lang="scss" scoped>
.menu{
    width: 200px;
    height: 100%;
    border: 2px solid#16825d;
    border-radius: 4px;
    .ul-box{
      list-style-type: none; /* 去掉项目符号 */
      color: #fff;
      padding: 0;
      margin:0 20px;
      li{
        padding: 20px 0;
        cursor: pointer;
        text-align: center;
        text-shadow: 1px -1px #fff,-1px 1px #999,-1px 5px 5px #07c160;
        &:hover{
          font-size: 28px !important;
          font-weight: bold !important;
        }
      }
    }
    .logo{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100px;
    }
}



</style>
