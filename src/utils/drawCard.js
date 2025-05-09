import { onMounted, onUnmounted } from 'vue';

export function useGachaEffect(elementRef, options = {}) {
  const defaultOptions = {
    rarity: 3, // 默认3星
    duration: 1500, // 动画持续时间
    particleCount: 50, // 粒子数量增加
    effectRange: 300, // 效果范围扩大
    colors: {
      3: ['#a0a0a0', '#c0c0c0', '#d3d3d3'], // 三星灰色系
      4: ['#9c27b0', '#673ab7', '#9575cd'], // 四星紫色系
      5: ['#ff9800', '#ffeb3b', '#ffc107']  // 五星金色系
    },
    starSizes: {
      3: 3,
      4: 4,
      5: 5
    },
    cardImages: {
      3: null, // 默认无图片
      4: null,
      5: null
    }
  };
  
  const config = { ...defaultOptions, ...options };
  let particles = [];
  let animationElements = [];

  // 创建粒子效果
  const createParticles = (x, y) => {
    const colorSet = config.colors[config.rarity];
    const baseSize = config.starSizes[config.rarity];
    const range = config.effectRange;
    
    for (let i = 0; i < config.particleCount; i++) {
      const particle = document.createElement('div');
      const size = baseSize + Math.random() * 3;
      const color = colorSet[Math.floor(Math.random() * colorSet.length)];
      const angle = Math.random() * Math.PI * 2;
      const distance = range * 0.3 + Math.random() * range * 0.7;
      const duration = 800 + Math.random() * 1200;
      
      particle.className = 'gacha-particle';
      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transform: translate(0, 0);
        animation: particle-fly-${i} ${duration}ms ease-out forwards;
      `;
      
      // 动态创建粒子动画
      const animation = document.createElement('style');
      animation.textContent = `
        @keyframes particle-fly-${i} {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px);
            opacity: 0;
          }
        }
      `;
      
      document.head.appendChild(animation);
      document.body.appendChild(particle);
      particles.push({ element: particle, animation });
      
      // 动画结束后移除
      setTimeout(() => {
        particle.remove();
        animation.remove();
        particles = particles.filter(p => p.element !== particle);
      }, duration);
    }
  };

  // 创建稀有度特效光效
  const createRarityLight = (x, y) => {
    const light = document.createElement('div');
    const size = config.rarity === 5 ? 300 : 
                config.rarity === 4 ? 200 : 150;
    const color = config.rarity === 5 ? 'rgba(255,215,0,0.8)' :
                 config.rarity === 4 ? 'rgba(156,39,176,0.8)' :
                 'rgba(160,160,160,0.8)';
    
    light.className = 'rarity-light';
    light.style.cssText = `
      position: fixed;
      left: ${x - size/2}px;
      top: ${y - size/2}px;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 70%);
      pointer-events: none;
      z-index: 9998;
      opacity: 0;
      animation: rarity-light 1000ms ease-out forwards;
    `;
    
    const animation = document.createElement('style');
    animation.textContent = `
      @keyframes rarity-light {
        0% {
          transform: scale(0.5);
          opacity: 0;
        }
        50% {
          opacity: 0.8;
        }
        100% {
          transform: scale(1.5);
          opacity: 0;
        }
      }
    `;
    
    document.head.appendChild(animation);
    document.body.appendChild(light);
    animationElements.push({ element: light, animation });
    
    setTimeout(() => {
      light.remove();
      animation.remove();
      animationElements = animationElements.filter(e => e.element !== light);
    }, 1000);
  };

  // 卡片翻转动画（支持自定义图片）
  const createCardFlip = (x, y) => {
    const card = document.createElement('div');
    card.className = 'gacha-card';
    const cardSize = config.rarity === 5 ? 120 : 
                    config.rarity === 4 ? 110 : 100;
    
    card.style.cssText = `
      position: fixed;
      left: ${x - cardSize/2}px;
      top: ${y - cardSize*1.5/2}px;
      width: ${cardSize}px;
      height: ${cardSize * 1.5}px;
      background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      pointer-events: none;
      z-index: 10000;
      transform-style: preserve-3d;
      animation: card-flip ${config.duration}ms ease-in-out forwards;
    `;
    
    // 卡片正面
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    cardFront.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
      overflow: hidden;
    `;
    
    // 卡片背面
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      transform: rotateY(180deg);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: ${config.rarity === 5 ? 'linear-gradient(135deg, #ffd700 0%, #ff9800 100%)' : 
                 config.rarity === 4 ? 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)' :
                 'linear-gradient(135deg, #a0a0a0 0%, #707070 100%)'};
      color: white;
      font-weight: bold;
      overflow: hidden;
    `;
    
    // 添加卡片图片（如果有）
  if (config.cardImages[config.rarity]) {
        const img = document.createElement('img');
        img.src = config.cardImages[config.rarity]; // 确保使用配置的图片
        
        // 添加样式确保图片正确显示
        img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        top: 0;
        left: 0;
        `;
        
        // 清空可能存在的旧图片
        cardBack.innerHTML = '';
        cardBack.appendChild(img);
        
        // 添加星级显示（放在图片上层）
        const starContainer = document.createElement('div');
        starContainer.style.cssText = `
        position: absolute;
        bottom: 10px;
        width: 100%;
        text-align: center;
        z-index: 2;
        font-size: ${config.rarity === 5 ? '24px' : 
                    config.rarity === 4 ? '20px' : '16px'};
        color: ${config.rarity === 5 ? '#ffeb3b' : 
                config.rarity === 4 ? '#e1bee7' : 'white'};
        text-shadow: 0 0 5px rgba(0,0,0,0.8);
        `;
        starContainer.textContent = '★'.repeat(config.rarity);
        cardBack.appendChild(starContainer);
    }
    
    // 添加星级显示
    const starContainer = document.createElement('div');
    starContainer.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      height: 30%;
      font-size: ${config.rarity === 5 ? '24px' : 
                 config.rarity === 4 ? '20px' : '16px'};
      color: ${config.rarity === 5 ? '#ffeb3b' : 
              config.rarity === 4 ? '#e1bee7' : 'white'};
      text-shadow: 0 0 5px rgba(0,0,0,0.5);
    `;
    starContainer.textContent = '★'.repeat(config.rarity);
    cardBack.appendChild(starContainer);
    
    card.appendChild(cardFront);
    card.appendChild(cardBack);
    
    const animation = document.createElement('style');
    animation.textContent = `
      @keyframes card-flip {
        0% {
          transform: rotateY(0deg) scale(0.5);
          opacity: 0;
        }
        20% {
          opacity: 1;
        }
        50% {
          transform: rotateY(90deg) scale(1);
        }
        100% {
          transform: rotateY(180deg) scale(1);
          opacity: 1;
        }
      }
    `;
    
    document.head.appendChild(animation);
    document.body.appendChild(card);
    animationElements.push({ element: card, animation });
    
    // 动画结束后移除
    setTimeout(() => {
      card.remove();
      animation.remove();
      animationElements = animationElements.filter(e => e.element !== card);
    }, config.duration);
  };

  // 触发抽卡动画
  const triggerGacha = (x, y) => {
    createParticles(x, y);
    createRarityLight(x, y);
    createCardFlip(x, y);
  };

  // 点击处理
  const handleClick = (e) => {
    const rect = elementRef.value.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    triggerGacha(centerX, centerY);
  };

  onMounted(() => {
    const el = elementRef.value;
    if (el) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', handleClick);
    }
  });

  onUnmounted(() => {
    const el = elementRef.value;
    if (el) {
      el.removeEventListener('click', handleClick);
    }
    // 清理所有动画元素
    particles.forEach(p => p.element.remove());
    animationElements.forEach(e => {
      e.element.remove();
      e.animation.remove();
    });
    particles = [];
    animationElements = [];
  });

  // 返回方法供外部调用
  return {
    triggerGacha,
    setRarity: (rarity) => { config.rarity = rarity; },
    setCardImage: (rarity, imageUrl) => { config.cardImages[rarity] = imageUrl; },
    setOptions: (newOptions) => { Object.assign(config, newOptions); }
  };
}