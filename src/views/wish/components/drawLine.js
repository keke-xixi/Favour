/**
 * 穿梭动画背景（支持手动控制）
 */
import { ref, onMounted, onUnmounted } from 'vue';

export function usePersistentStreakAnimation(containerRef, options = {}) {
  const defaultOptions = {
    maxStreaks: 100,             // 最大同时存在的线条数
    spawnRate: 5,                // 每帧生成概率(百分比)
    speedRange: [3, 10],         // 速度范围
    lengthRange: [50, 200],      // 长度范围
    thicknessRange: [1, 5],      // 粗细范围
    colorPalette: ['#FF2D75', '#00F2FF', '#FFEE00', '#00FF87', '#FF00F5'],
    fadeDuration: 60,            // 消失动画帧数
    angleVariation: 30,          // 角度变化范围(度)
    autoStart: false,            // 默认不自动启动（改为手动控制）
  };

  const config = { ...defaultOptions, ...options };
  const streaks = ref([]);
  let animationFrameId = null;
  const containerSize = ref({ width: 0, height: 0 });
  const isRunning = ref(false);  // 新增：动画运行状态

  class PersistentStreak {
    constructor() {
      this.init();
      this.life = 1;
      this.fading = false;
    }

    init() {
        this.speed = Math.random() * (config.speedRange[1] - config.speedRange[0]) + config.speedRange[0];
        this.length = Math.random() * (config.lengthRange[1] - config.lengthRange[0]) + config.lengthRange[0];
        this.thickness = Math.random() * (config.thicknessRange[1] - config.thicknessRange[0]) + config.thicknessRange[0];
        this.color = config.colorPalette[Math.floor(Math.random() * config.colorPalette.length)];
        
        // 从四边随机生成
        const side = Math.floor(Math.random() * 4);
        const baseAngle = Math.random() * Math.PI * 2;
        this.angle = baseAngle + (Math.random() * 2 - 1) * config.angleVariation * (Math.PI / 180);
  
        switch(side) {
          case 0: // 上边
            this.x = Math.random() * containerSize.value.width;
            this.y = -this.length;
            break;
          case 1: // 右边
            this.x = containerSize.value.width + this.length;
            this.y = Math.random() * containerSize.value.height;
            break;
          case 2: // 下边
            this.x = Math.random() * containerSize.value.width;
            this.y = containerSize.value.height + this.length;
            break;
          case 3: // 左边
            this.x = -this.length;
            this.y = Math.random() * containerSize.value.height;
            break;
        }
      }
  
      update() {
        if (this.fading) {
          this.life -= 1 / config.fadeDuration;
          if (this.life <= 0) {
            this.init();
            this.life = 1;
            this.fading = false;
          }
        } else {
          this.x += Math.cos(this.angle) * this.speed;
          this.y += Math.sin(this.angle) * this.speed;
          
          // 触发消失的条件（到达边界或随机消失）
          if (
            this.x < -this.length * 3 || 
            this.x > containerSize.value.width + this.length * 3 ||
            this.y < -this.length * 3 ||
            this.y > containerSize.value.height + this.length * 3 ||
            Math.random() < 0.002
          ) {
            this.fading = true;
          }
        }
      }
  
      draw() {
        const element = document.createElement('div');
        const blurRadius = Math.min(this.speed / 2, 5);
        const currentLength = this.length * (this.fading ? this.life : 1);
        element.style.cssText = ''
        element.style.cssText = `
          position: absolute;
          left: ${this.x}px;
          top: ${this.y}px;
          width: ${currentLength}px;
          height: ${this.thickness}px;
          background: linear-gradient(
            to right,
            transparent,
            ${this.color},
            transparent
          );
          opacity: ${this.opacity * this.life};
          transform-origin: left center;
          transform: rotate(${this.angle}rad);
          filter: blur(${blurRadius}px);
          will-change: transform, opacity;
          pointer-events: none;
          transition: opacity 0.1s linear;
        `;
        
        // 光晕效果
        element.style.boxShadow = `
          0 0 ${blurRadius * 3}px ${this.color},
          0 0 ${blurRadius * 6}px rgba(255,255,255,0.1)
        `;
        
        return element;
      }
    }
  
    const initContainer = () => {
      if (!containerRef.value) return;
      
      containerSize.value = {
        width: containerRef.value.offsetWidth,
        height: containerRef.value.offsetHeight
      };
  
      containerRef.value.style.position = 'relative';
      containerRef.value.style.overflow = 'hidden';
      // containerRef.value.style.background = 'radial-gradient(ellipse at center, #111 0%, #000 100%)';  // 添加背景色
    };
  
    const spawnNewStreaks = () => {
      if (streaks.value.length < config.maxStreaks && 
          Math.random() * 100 < config.spawnRate) {
        streaks.value.push(new PersistentStreak());
      }
    };

  const animate = () => {
    if (!isRunning.value) return; // 如果动画已停止，直接退出

    // 清除上一帧
    containerRef.value.querySelectorAll('.persistent-streak').forEach(el => el.remove());

    // 生成新线条
    spawnNewStreaks();

    // 更新并渲染
    streaks.value.forEach(streak => {
      streak.update();
      const el = streak.draw();
      el.className = 'persistent-streak';
      containerRef.value.appendChild(el);
    });

    animationFrameId = requestAnimationFrame(animate);
  };

  // 新增：手动启动动画
  const start = () => {
    if (isRunning.value) return; // 如果已经在运行，不重复启动
    isRunning.value = true;
    animate();
  };

  // 新增：手动停止动画
  const stop = () => {
    isRunning.value = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    // 清除所有线条
    if (containerRef.value) {
        const streaks = containerRef.value.querySelectorAll('.persistent-streak');
        streaks.forEach(el => el.remove());
    }
  };

  onMounted(() => {
    initContainer();
    // 初始填充（但不自动启动）
    for (let i = 0; i < config.maxStreaks / 2; i++) {
      streaks.value.push(new PersistentStreak());
    }
    
    if (config.autoStart) start(); // 如果配置了 autoStart，自动启动
    window.addEventListener('resize', initContainer);
  });

  onUnmounted(() => {
    stop(); // 确保组件卸载时停止动画
    window.removeEventListener('resize', initContainer);
  });

  return {
    start,      // 手动启动动画
    stop,       // 手动停止动画
    isRunning,  // 当前动画状态（true/false）
    setIntensity: (level) => {
      config.spawnRate = level * 10;
      config.maxStreaks = level * 50;
    }
  };
}