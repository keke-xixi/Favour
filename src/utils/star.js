/*
  流星动画： 也可以触发事件调用
*/
import { onMounted, onUnmounted } from 'vue';

export function useMeteorEffect(elementRef, options = {}) {
  const defaultOptions = {
    meteorCount: 8,
    duration: 1000,
    size: 4,
    tailLength: 100,
    colors: ['#ff3366', '#33ccff', '#ffcc33', '#9966ff'],
    maxAngle: 30 // 最大偏离角度
  };
  
  const config = { ...defaultOptions, ...options };
  let meteors = [];

  // 创建单个流星
  const createMeteor = (originX, originY) => {
    const angle = (Math.random() * 2 - 1) * config.maxAngle * (Math.PI / 180);
    const distance = Math.max(window.innerWidth, window.innerHeight) * 1.5;
    const endX = originX + Math.cos(angle) * distance;
    const endY = originY + Math.sin(angle) * distance;
    
    const meteor = document.createElement('div');
    meteor.className = 'meteor';
    
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    
    meteor.style.cssText = `
      position: fixed;
      left: ${originX}px;
      top: ${originY}px;
      width: ${config.size}px;
      height: ${config.size}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      transform-origin: left center;
      z-index: 1000;
      box-shadow: 0 0 ${config.tailLength}px ${config.tailLength/2}px ${color};
      opacity: 0;
      animation: meteor-fly ${config.duration}ms linear forwards;
    `;
    
    // 动态创建动画
    const animation = document.createElement('style');
    animation.textContent = `
      @keyframes meteor-fly {
        0% {
          transform: translate(0, 0) rotate(${angle}rad);
          opacity: 1;
        }
        100% {
          transform: translate(${endX - originX}px, ${endY - originY}px) rotate(${angle}rad);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(animation);
    
    document.body.appendChild(meteor);
    meteors.push({ element: meteor, animation });
    
    // 动画结束后移除
    setTimeout(() => {
      meteor.remove();
      animation.remove();
      meteors = meteors.filter(m => m.element !== meteor);
    }, config.duration);
  };

  // 触发流星雨
  const triggerMeteorShower = (x, y) => {
    for (let i = 0; i < config.meteorCount; i++) {
      setTimeout(() => {
        createMeteor(x, y);
      }, i * 100); // 稍微错开发射时间
    }
  };

  // 点击处理
  const handleClick = (e) => {
    const rect = elementRef.value.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    triggerMeteorShower(centerX, centerY);
    
    // 添加点击动画
    if (elementRef.value) {
      elementRef.value.style.transform = 'scale(0.9)';
      setTimeout(() => {
        if (elementRef.value) {
          elementRef.value.style.transform = 'scale(1)';
        }
      }, 200);
    }
  };

  // 手动触发流星雨（暴露给外部使用）
  const triggerMeteor = (x, y) => {
    triggerMeteorShower(x, y);
  };

  onMounted(() => {
    const el = elementRef.value;
    if (el) {
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 0.2s ease';
      el.addEventListener('click', handleClick);
    }
  });

  onUnmounted(() => {
    const el = elementRef.value;
    if (el) {
      el.removeEventListener('click', handleClick);
    }
    // 清理所有流星
    meteors.forEach(meteor => {
      meteor.element.remove();
      meteor.animation.remove();
    });
    meteors = [];
  });

  // 返回方法供外部调用
  return {
    triggerMeteor,  // 手动触发流星雨
    handleClick     // 也可以直接暴露 handleClick
  };
}