/*
  抽卡动画
*/
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


 // 卡片动画（直接展示图片和星级）
const createCardFlip = (x, y) => {
    const card = document.createElement('div');
    card.className = 'gacha-card';
    
    // 调整卡片尺寸为正方形
    const cardSize = config.rarity === 5 ? 200 : 
                    config.rarity === 4 ? 180 : 160;
  
    card.style.cssText = `
      position: fixed;
      left: ${x - cardSize/2}px;
      top: ${y - cardSize/2}px;
      width: ${cardSize}px;
      height: ${cardSize}px;
      background: rgba(255,255,255,0.1);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      pointer-events: none;
      z-index: 10000;
      transform-style: preserve-3d;
      overflow: hidden;
      animation: card-reveal ${config.duration}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
      border: 2px solid rgba(255,255,255,0.3);
    `;
  
    // 添加卡片图片
    if (config.cardImages[config.rarity]) {
      const img = document.createElement('img');
      img.src = config.cardImages[config.rarity];
      
      // 图片样式
      img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        filter: brightness(0.9);
        transition: transform 0.3s;
      `;
      
      // 添加光晕效果
      const glow = document.createElement('div');
      glow.style.cssText = `
        position: absolute;
        width: 150%;
        height: 150%;
        background: radial-gradient(circle at center, 
          ${config.rarity === 5 ? 'rgba(255,215,0,0.3)' : 
           config.rarity === 4 ? 'rgba(156,39,176,0.3)' : 
           'rgba(160,160,160,0.3)'} 0%, 
          transparent 70%);
        pointer-events: none;
      `;
      
      card.appendChild(img);
      card.appendChild(glow);
    }
  
    // 添加星级显示（居中悬浮效果）
    const starContainer = document.createElement('div');
    starContainer.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      display: flex;
      gap: 8px;
      font-size: ${config.rarity === 5 ? '42px' : 
                 config.rarity === 4 ? '36px' : '30px'};
      color: ${config.rarity === 5 ? 'rgba(255,235,59,0.9)' : 
              config.rarity === 4 ? 'rgba(225,190,231,0.9)' : 
              'rgba(255,255,255,0.9)'};
      text-shadow: 0 2px 8px rgba(0,0,0,0.5);
      animation: star-float 2s ease-in-out infinite;
    `;
    
    // 创建动态星星
    '★'.repeat(config.rarity).split('').forEach((star, index) => {
      const starElem = document.createElement('span');
      starElem.textContent = star;
      starElem.style.cssText = `
        transform: rotate(${index * 12}deg);
        display: inline-block;
        transition: transform 0.3s;
      `;
      starContainer.appendChild(starElem);
    });
  
    card.appendChild(starContainer);
  
    // 创建动画样式
    const animation = document.createElement('style');
    animation.textContent = `
      @keyframes card-reveal {
        0% {
          transform: scale(0.5) rotate(-15deg);
          opacity: 0;
          filter: blur(8px);
        }
        80% {
          transform: scale(1.05) rotate(5deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
          opacity: 1;
          filter: blur(0);
        }
      }
  
      @keyframes star-float {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.1); }
      }
    `;
  
    document.head.appendChild(animation);
    document.body.appendChild(card);
    animationElements.push({ element: card, animation });
  
    // 自动移除
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