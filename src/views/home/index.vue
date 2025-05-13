<template>
  <div class="homePage">
    <menu-card/>
    <div class="contents">
      <tab-card/>
      <router-view></router-view>
    </div>  
  </div>
</template>
<script setup lang="ts">
import {ref,reactive} from "vue"
import MenuCard from "./components/menuIndex.vue";
import TabCard from "./components/tabIndex.vue";




</script>
<style lang="scss" scoped>
.homePage{
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, .9);
  display: flex;
  .contents{
    flex: 1;
    height: 100vh;
  }

}



</style>
