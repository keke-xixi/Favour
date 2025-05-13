// useStarfieldAnimation.js
import { ref, onMounted, onUnmounted } from 'vue';

export function useStarfieldAnimation(containerRef, options = {}) {
  const defaultOptions = {
    starCount: 200,          // 星星数量
    shootingStarInterval: 3000, // 流星间隔(ms)
    starSpeed: 0.05,         // 星星移动速度
    nebulaCount: 3,          // 星云数量
    twinkleSpeed: 0.01,      // 星星闪烁速度
    colorPalette: {          // 颜色配置
      stars: ['#ffffff', '#d4e6ff', '#ffeb99', '#ffccf9'],
      nebulas: [
        'radial-gradient(circle, rgba(103,58,183,0.2) 0%, transparent 70%)',
        'radial-gradient(circle, rgba(76,175,80,0.15) 0%, transparent 70%)',
        'radial-gradient(circle, rgba(33,150,243,0.25) 0%, transparent 70%)'
      ]
    }
  };

  const config = { ...defaultOptions, ...options };
  const stars = ref([]);
  const nebulas = ref([]);
  let animationFrameId = null;
  let shootingStarTimer = null;

  class Star {
    constructor() {
      this.reset();
      this.z = Math.random() * 0.5 + 0.5; // 深度值(0.5-1)
    }

    reset() {
      this.x = Math.random() * 100;
      this.y = Math.random() * 100;
      this.size = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.8 + 0.2;
      this.color = config.colorPalette.stars[
        Math.floor(Math.random() * config.colorPalette.stars.length)
      ];
      this.speed = config.starSpeed * this.z;
      this.twinkleOffset = Math.random() * Math.PI * 2;
    }

    update(deltaTime) {
      // 视差移动效果
      this.y += this.speed * deltaTime;
      if (this.y > 100) {
        this.y = -5;
        this.x = Math.random() * 100;
      }

      // 闪烁效果
      this.opacity = 0.2 + 0.6 * (
        0.5 + 0.5 * Math.sin(Date.now() * config.twinkleSpeed + this.twinkleOffset)
      );
    }
  }

  class ShootingStar {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * 100;
      this.y = -10;
      this.angle = Math.random() * Math.PI / 4 + Math.PI / 8;
      this.speed = Math.random() * 3 + 2;
      this.size = Math.random() * 1 + 0.5;
      this.tailLength = Math.random() * 50 + 50;
      this.life = 100;
    }

    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.life--;

      if (this.x > 110 || this.y > 110 || this.life <= 0) {
        return false;
      }
      return true;
    }
  }

  const initStars = () => {
    stars.value = Array.from({ length: config.starCount }, () => new Star());
  };

  const initNebulas = () => {
    nebulas.value = Array.from({ length: config.nebulaCount }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 20,
      color: config.colorPalette.nebulas[i % config.colorPalette.nebulas.length],
      speed: Math.random() * 0.01 + 0.005
    }));
  };

  const createShootingStar = () => {
    const star = new ShootingStar();
    const tail = [];

    const draw = () => {
      if (!star.update()) return;

      tail.unshift({ x: star.x, y: star.y });
      if (tail.length > star.tailLength) tail.pop();

      // 绘制流星尾迹
      tail.forEach((pos, i) => {
        const opacity = i / tail.length;
        const element = document.createElement('div');
        element.style.cssText = `
          position: absolute;
          left: ${pos.x}%;
          top: ${pos.y}%;
          width: ${star.size * (1 - i / tail.length)}px;
          height: ${star.size * (1 - i / tail.length)}px;
          background: white;
          border-radius: 50%;
          opacity: ${opacity};
          filter: blur(${opacity * 2}px);
          transform: translate(-50%, -50%);
          pointer-events: none;
        `;
        containerRef.value.appendChild(element);
        setTimeout(() => element.remove(), 50);
      });

      requestAnimationFrame(draw);
    };

    draw();
  };

  const startShootingStars = () => {
    shootingStarTimer = setInterval(() => {
      if (Math.random() > 0.7) createShootingStar();
    }, config.shootingStarInterval);
  };

  const animate = (timestamp) => {
    if (!containerRef.value) return;

    // 清除上一帧
    containerRef.value.querySelectorAll('.star').forEach(el => el.remove());

    // 更新并渲染星星
    stars.value.forEach(star => {
      star.update(16); // 假设60fps，每帧16ms

      const element = document.createElement('div');
      element.className = 'star';
      element.style.cssText = `
        position: absolute;
        left: ${star.x}%;
        top: ${star.y}%;
        width: ${star.size * star.z}px;
        height: ${star.size * star.z}px;
        background: ${star.color};
        border-radius: 50%;
        opacity: ${star.opacity};
        filter: blur(${star.z * 0.5}px);
        transform: translate(-50%, -50%);
        pointer-events: none;
        will-change: transform, opacity;
      `;
      containerRef.value.appendChild(element);
    });

    // 更新星云
    nebulas.value.forEach(nebula => {
      nebula.x = (nebula.x + nebula.speed) % 100;
      const element = document.createElement('div');
      element.style.cssText = `
        position: absolute;
        left: ${nebula.x}%;
        top: ${nebula.y}%;
        width: ${nebula.size}%;
        height: ${nebula.size}%;
        background: ${nebula.color};
        transform: translate(-50%, -50%);
        pointer-events: none;
      `;
      containerRef.value.appendChild(element);
      setTimeout(() => element.remove(), 50);
    });

    animationFrameId = requestAnimationFrame(animate);
  };

  onMounted(() => {
    if (!containerRef.value) return;
    
    // 设置背景样式
    containerRef.value.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
      overflow: hidden;
      z-index: -1;
    `;

    initStars();
    initNebulas();
    startShootingStars();
    animate();
  });

  onUnmounted(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (shootingStarTimer) clearInterval(shootingStarTimer);
  });

  return {
    // 控制方法
    setStarCount: (count) => {
      config.starCount = count;
      initStars();
    },
    // 手动触发流星
    triggerShootingStar: () => {
      createShootingStar();
    }
  };
}