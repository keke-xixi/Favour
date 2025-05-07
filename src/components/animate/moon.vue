<!-- 
  月亮动画 
-->
<template>
  <div class="moon">
    <div class="small-moon"></div>

  </div>
</template>
<script setup lang="ts">
import {ref,reactive} from "vue"




</script>
<style lang="scss" scoped>

.moon {
  position: fixed;
  width: 100px;
  height: 100px;
  top: 20px;
  left: 20px;
  background: radial-gradient(circle,#1d85e3, #1675d4); 
  border-radius: 50%;
  clip-path: inset(0 50px 0 0); /* 控制弯月效果 顺序都是 上-右-下-左 */ 
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(-45deg);
  // animation: move 0.5s infinite;
  .small-moon{
    background-color: #080822;
    width: 50%;
    height: 100%;
    border-radius: 50%;
  }
}
@keyframes move {
            0% {
                transform: rotate(-72deg);
            }
            25% {
                transform: rotate(-144deg);
            }
            50% {
                transform: rotate(-216deg);
            }
            75% {
                transform: rotate(-288deg);
            }
            100% {
                transform: rotate(-360deg);
            }
        }

</style>
