/* 
  爆炸动画：点击完成后，元素会变成一个粒子系统，粒子会以随机速度和方向散开，形成爆炸效果。
  使用方法：
  <div ref="explodingBox" class="box3">点击我爆炸！💥</div>
  const explodingBox = ref(null);
    useExplosion(explodingBox, {
    particleCount: 30,      // 粒子数量
    duration: 1500,         // 动画持续时间（毫秒）
    colors: ['#ff0000', '#ff9900', '#ffff00', '#ffffff'], // 粒子颜色
  });
*/
import { onMounted } from 'vue';

export function useExplosion(elementRef, options = {}) {
  const defaultOptions = {
    particleCount: 20,
    duration: 1000,
    colors: ['#ff0000', '#ff8800', '#ffff00', '#ffffff'],
    size: 8,
    distance: 150
  };
  
  const config = { ...defaultOptions, ...options };

  // 动态插入全局动画样式
  const setupGlobalStyles = () => {
    if (!document.getElementById('explosion-animation')) {
      const style = document.createElement('style');
      style.id = 'explosion-animation';
      style.textContent = `
        .explosion-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: particle-explode var(--duration) ease-out forwards;
        }
        
        @keyframes particle-explode {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty));
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  };

  // 创建单个粒子
  const createParticle = (x, y) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * config.distance;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    const particle = document.createElement('div');
    particle.className = 'explosion-particle';
    particle.style.cssText = `
      left: ${x}px;
      top: ${y}px;
      width: ${config.size}px;
      height: ${config.size}px;
      background: ${config.colors[Math.floor(Math.random() * config.colors.length)]};
      --tx: ${tx}px;
      --ty: ${ty}px;
      --duration: ${config.duration}ms;
    `;
    
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), config.duration);
  };

  // 爆炸效果主函数
  const explode = (el) => {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 隐藏原盒子
    el.style.opacity = '0';
    
    // 创建粒子
    for (let i = 0; i < config.particleCount; i++) {
      createParticle(centerX, centerY);
    }

    // 恢复盒子
    setTimeout(() => {
      el.style.opacity = '1';
    }, config.duration);
  };

  onMounted(() => {
    setupGlobalStyles();
    const el = elementRef.value;
    if (el) {
      el.style.position = 'absolute';
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => explode(el));
    }
  });
  // 返回方法供外部调用
  return {
    explode,  // 手动触发爆炸
  };
}