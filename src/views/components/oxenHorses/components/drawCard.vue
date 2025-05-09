<template>
    <div>
        <div ref="gachaButton" class="gacha-button">
            点击抽卡
        </div>
        <div class="controls">
            <button @click="triggerThreeStar">三星角色</button>
            <button @click="triggerFourStar">四星角色</button>
            <button @click="triggerFiveStar">五星角色</button>
        </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useGachaEffect } from '@/utils/drawCard.js';
//   import threeStar from '@/assets/img/card/card1.png';
  const threeStar = import.meta.env.BASE_URL + '/img/game/card1.png';
  import fourStar from '@/assets/img/card/card1.png';
  import fiveStar from '@/assets/img/card/card1.png';
  
  const gachaButton = ref(null);
  const { triggerGacha, setRarity, setCardImage } = useGachaEffect(gachaButton, {
    effectRange: 400, // 扩大效果范围
    cardImages: {
        3: threeStar,
        4: fourStar,
        5: fiveStar
    }
  });


  // 预加载图片
  onMounted(() => {
    [threeStar, fourStar, fiveStar].forEach(imgUrl => {
        const img = new Image();
        img.src = imgUrl;
    });
  });
  
  // 三星角色抽卡
  const triggerThreeStar = () => {
    setRarity(3);
    const rect = gachaButton.value.getBoundingClientRect();
    triggerGacha(rect.left + rect.width/2, rect.top + rect.height/2);
  };
  
  // 四星角色抽卡
  const triggerFourStar = () => {
    setRarity(4);
    const rect = gachaButton.value.getBoundingClientRect();
    triggerGacha(rect.left + rect.width/2, rect.top + rect.height/2);
  };
  
  // 五星角色抽卡
  const triggerFiveStar = () => {
    setRarity(5);
    const rect = gachaButton.value.getBoundingClientRect();
    triggerGacha(rect.left + rect.width/2, rect.top + rect.height/2);
  };
  </script>
  
  <style>
  .gacha-button {
    width: 150px;
    height: 60px;
    background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    cursor: pointer;
    font-weight: bold;
    font-size: 18px;
    box-shadow: 0 4px 20px rgba(255, 107, 107, 0.4);
    transition: transform 0.2s;
    margin: 30px auto;
  }
  
  .gacha-button:hover {
    transform: scale(1.05);
  }
  
  .gacha-button:active {
    transform: scale(0.95);
  }
  
  .controls {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
  }
  
  .controls button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background: #4a6fa5;
    color: white;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s;
  }
  
  .controls button:hover {
    background: #3a5a8a;
    transform: translateY(-2px);
  }
  </style>