<template>
  <div class="boll circle">
       <div class="suboll circle" style="background-color: red;border: 1px solid #000">子盒子</div>
    </div>
</template>
<script setup lang="ts">
import {ref,reactive} from "vue"




</script>
<style lang="scss" scoped>
.content{
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
}
.boll {
  margin: 200px;
  animation: moveX 2s linear infinite; /* 动画名称，动画时长，动画速度曲线，动画循环次数 */
  background-color: #fff;
}
.suboll {
  animation: moveY 2s cubic-bezier(0.5, -1 , 1 , 1) infinite;
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes moveX {
  to {
    transform: translateX(200px); /* 动画结束时的位置 */
  }
}
@keyframes moveY {
  to {
    transform: translateY(400px); /* 动画结束时的位置 */
  }
}

</style>
