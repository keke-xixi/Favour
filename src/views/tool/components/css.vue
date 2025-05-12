<template>
    <div class="component-container">
      <!-- 星空效果 -->
     <div class="layer1"></div>
     <div class="layer2"></div>
     <div class="layer3"></div>
     <div class="layer4"></div>
     <div class="layer5"></div>
     <div class="z-title">星空</div>
      <!-- 文本擦除效果  -->
      <div class="line">
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
      </div>
      <!-- 卡片 -->
      <div class="line" style="display: flex;align-items: center;justify-content: center;">
        <div class="card">
          <div class="card-content">开发中的游戏...</div>
        </div>
      </div>
      <!-- 按钮 -->
      <div class="line" style="display: flex;align-items: center;justify-content: center;">
        <button class="z-button">返回首页</button>
      </div>
      <!-- 字体颜色 -->
      <div class="line" style="display: flex;align-items: center;justify-content: center;">
        <div style="font-size: 20px;font-weight: bold;" class="flex_c">
          <span class="z-text">C</span>
          <span class="z-text">O</span>
          <span class="z-text">L</span>
          <span class="z-text">O</span>
          <span class="z-text">R</span>
        </div>
      </div>
      <!-- 卡片 -->
      <div class="line">
        <div class="z-card" style="margin-top: 50px;">
          <div class="pointer" ref="pointer" :style="pointerStyle"></div>
          <div class="z-card-item">
            <img ref="imgs" src="/img/game/kt.png" alt="">
          </div>
          <div class="z-card-item">
            <img ref="imgs" src="/img/game/kt.png" alt="">
          </div>
          <div class="z-card-item">
            <img ref="imgs" src="/img/game/kt.png" alt="">
          </div>
          <div class="z-card-item">
            <img ref="imgs" src="/img/game/kt.png" alt="">
          </div>
        </div>
      </div>
      <!-- 轮播图 -->
      <div class="line">
        <div class="z-carousel">
          <div class="inner">
            <img src="/img/game/kt.png" style="width: 100%;height: auto;" alt="">
            <img src="/img/game/kt.png" style="width: 100%;height: auto;" alt="">
            <img src="/img/game/kt.png" style="width: 100%;height: auto;" alt="">
            <img src="/img/game/kt.png" style="width: 100%;height: auto;" alt="">
            <img src="/img/game/kt.png" style="width: 100%;height: auto;" alt="">
            <img src="/img/game/kt.png" style="width: 100%;height: auto;" alt="">
            <img src="/img/game/kt.png" style="width: 100%;height: auto;" alt="">
          </div>
        </div>
      </div>
      <!-- 图片旋转 -->
      <div class="line" style="display: flex;align-items: center;justify-content: center;">
        <div class="z-rotate">
          <div class="item">
            <img src="/img/game/bg3.png" alt="">
          </div>
          <div class="item">
            <img src="/img/game/bg3.png" alt="">
          </div>
          <div class="item">
            <img src="/img/game/bg3.png" alt="">
          </div>
          <div class="item">
            <img src="/img/game/kt.png" alt="">
          </div>
          <div class="item">
            <img src="/img/game/bg3.png" alt="">
          </div>
        </div>
      </div>
      <!-- h1效果 -->
      <div class="line" style="display: flex;align-items: center;justify-content: center;">
        <h1 class="z-h1">蒙娜丽莎</h1>
      </div>
      <!-- 3D翻转 -->
      <div class="line" style="display: flex;align-items: center;justify-content: center;">
        <div class="z-3d">
          <span style="--i: 1;"><img src="/img/game/data/img1.png" alt="" /></span>
          <span style="--i: 2;"><img src="/img/game/data/img2.png" alt="" /></span>
          <span style="--i: 3;"><img src="/img/game/data/img3.png" alt="" /></span>
          <span style="--i: 4;"><img src="/img/game/data/img4.png" alt="" /></span>
          <span style="--i: 5;"><img src="/img/game/data/img5.png" alt="" /></span>
          <span style="--i: 6;"><img src="/img/game/data/img6.png" alt="" /></span>
          <span style="--i: 7;"><img src="/img/game/data/img7.png" alt="" /></span>
          <span style="--i: 8;"><img src="/img/game/data/img8.png" alt="" /></span>
        </div>
      </div>
      
    </div>
  </template>
  <script setup lang="ts">
  import { ref, reactive, onMounted } from "vue"
  const imgs: any = ref([]);
  const pointer: any = ref(null);
  
  const pointerStyle = ref({
    '--s': `${240}px`,
    '--x': `${0}px`,
    '--y': `${0}px`,
  });
  
  
  onMounted(() => {
    imgs.value = Array.from(document.querySelectorAll('.z-card-item img'));
    imgs.value.forEach((img: any) => {
      img.addEventListener('mouseenter', () => {
        pointerStyle.value['--s'] = `${img.offsetWidth}px`;
        pointerStyle.value['--x'] = `${img.offsetLeft}px`;
        pointerStyle.value['--y'] = `${img.offsetTop}px`;
      });
    });
  });
  
  </script>
  <style lang="scss" scoped>
  .component-container {
    width: 95%;
    height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;
    padding-top: 120px;
    .line {
      border: 2px solid #50ec7b;
      height: 300px;
      width: 100%;
    }
  }
  </style>
  