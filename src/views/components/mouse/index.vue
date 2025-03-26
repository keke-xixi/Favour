<template>
  <div class="mouseContainer">
    <div class="content">
      <div class="left">

      </div>
      <div class="right">
         <div class="z-paragraph">
          <p>
            在一个充满未知与冒险的世界里，你将踏上一段独一无二的旅程。无论是穿越古老的遗迹，探索神秘的森林，还是挑战凶猛的怪物，这款游戏将带你体验最真实的奇幻冒险。精美的画面、动人的音乐与引人入胜的剧情交织在一起，仿佛把你从现实世界带入一个生动的梦境。
            在这里，每一个选择都至关重要，每一次战斗都充满紧张与策略。你将与来自不同背景的伙伴并肩作战，携手突破一个又一个的难关，解开隐藏在世界深处的秘密。无论你是勇敢的战士、聪明的法师，还是巧妙的盗贼，丰富的角色成长系统将让你体验到无穷的可能性。
            这是一个属于你的故事，一个永不结束的冒险。加入我们，踏上这段传奇旅程，书写属于自己的辉煌篇章！
          </p>
          <p class="eraser">
            <span class="text">
            在一个充满未知与冒险的世界里，你将踏上一段独一无二的旅程。无论是穿越古老的遗迹，探索神秘的森林，还是挑战凶猛的怪物，这款游戏将带你体验最真实的奇幻冒险。精美的画面、动人的音乐与引人入胜的剧情交织在一起，仿佛把你从现实世界带入一个生动的梦境。
            在这里，每一个选择都至关重要，每一次战斗都充满紧张与策略。你将与来自不同背景的伙伴并肩作战，携手突破一个又一个的难关，解开隐藏在世界深处的秘密。无论你是勇敢的战士、聪明的法师，还是巧妙的盗贼，丰富的角色成长系统将让你体验到无穷的可能性。
            这是一个属于你的故事，一个永不结束的冒险。加入我们，踏上这段传奇旅程，书写属于自己的辉煌篇章！
        </span>
          </p>
         </div>
         <div class="skip">
            <h3 @click="router.push('/mouseMain')">skip</h3>
         </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {ref,reactive} from "vue"
import { useRouter } from "vue-router";
const router = useRouter();


</script>
<style lang="scss" scoped>
.mouseContainer{
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  position: relative;
  .content{
    width: 80%;
    height: 80%;
    display: flex;
    .left{
      width: 50%;
      height: 100%;
      background-color: #edf2fa;
    }
    .right{
      flex: 1;
      height: 100%;
      background-color: #000;
      position: relative;
      .skip{
        position: absolute;
        bottom: 0;
        right: 0;
        color: #d0efed;
        cursor: pointer;
      }
    }
  }
}



</style>
