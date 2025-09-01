/**
 *  旋转 - 仅使用spiral(旋转)运动方式
 */
import { ref, onMounted, onUnmounted } from 'vue';

export function useGalacticBoxAnimation(containerRef, options = {}) {
  const defaultOptions = {
    boxCount: 5,                   // 盒子数量
    trailLength: 20,               // 运动轨迹长度
    baseSpeed: 0.5,                // 基础移动速度
    sizeVariation: [30, 30],       // 盒子尺寸范围[最小,最大]
    palette: ['#7FDBFF', '#FFDC00', '#FF851B', '#B10DC9', '#2ECC40'],
    enableTrails: true,            // 是否显示运动轨迹
    enableCollisions: false        // 是否启用碰撞检测
  };

  const config = { ...defaultOptions, ...options };
  const boxes = ref([]);
  const particles = ref([]);
  const animationId = ref(null);
  const lastTimestamp = ref(0);
  const containerSize = ref({ width: 0, height: 0 });

  // 生成随机属性
  const randomInRange = (min, max) => 
    Math.random() * (max - min) + min;

  // 仅保留spiral路径生成器
  const pathGenerator = (t) => ({
    x: Math.cos(t * Math.PI * 4) * t,
    y: Math.sin(t * Math.PI * 4) * t,
    z: t * 30
  });

  // 初始化容器
  const initContainer = () => {
    if (!containerRef.value) return;
    
    containerSize.value = {
      width: containerRef.value.offsetWidth,
      height: containerRef.value.offsetHeight
    };

    containerRef.value.style.position = 'relative';
    containerRef.value.style.overflow = 'hidden';
    containerRef.value.style.perspective = '1000px';
  };

  // 创建盒子元素
  const createBoxes = () => {
    boxes.value = Array.from({ length: config.boxCount }).map((_, i) => {
      const size = randomInRange(...config.sizeVariation);
      const color = config.palette[i % config.palette.length];
      
      const box = document.createElement('div');
      box.className = 'galactic-box';
      box.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${size / 5}px;
        transform-style: preserve-3d;
        box-shadow: 0 0 ${size / 2}px ${color};
        filter: brightness(1.2);
        will-change: transform;
        z-index: 5;
      `;

      containerRef.value.appendChild(box);

      return {
        element: box,
        size,
        color,
        progress: Math.random(),
        speed: config.baseSpeed * randomInRange(0.8, 1.2),
        position: { x: 0, y: 0, z: 0 },
        trail: []
      };
    });
  };

  // 更新盒子位置
  const updateBoxPosition = (box, deltaTime) => {
    const t = box.progress;
    const { x, y, z } = pathGenerator(t);

    // 转换为屏幕坐标
    box.position = {
      x: (x * 0.5 + 0.5) * containerSize.value.width,
      y: (y * 0.5 + 0.5) * containerSize.value.height,
      z
    };

    // 记录轨迹点
    if (config.enableTrails) {
      box.trail.unshift({ ...box.position });
      if (box.trail.length > config.trailLength) {
        box.trail.pop();
      }
    }

    // 更新进度
    box.progress += (deltaTime / 1000) * box.speed;
    if (box.progress > 1) box.progress = 0;
  };

  // 渲染盒子
  const renderBox = (box) => {
    const { x, y, z } = box.position;
    box.element.style.transform = `
      translate3d(${x - box.size / 2}px, ${y - box.size / 2}px, ${z}px)
      rotateX(${z * 0.2}deg)
      rotateY(${z * 0.3}deg)
      scale(${1 + z / 200})
    `;
    box.element.style.opacity = 1 - Math.abs(z) / 100;

    // 渲染轨迹
    if (config.enableTrails) {
      box.trail.forEach((pos, i) => {
        const trailDot = document.createElement('div');
        trailDot.className = 'trail-dot';
        trailDot.style.cssText = `
          position: absolute;
          width: ${box.size * (0.3 + 0.7 * i / box.trail.length)}px;
          height: ${box.size * (0.3 + 0.7 * i / box.trail.length)}px;
          background: ${box.color};
          border-radius: 50%;
          left: ${pos.x - box.size / 2}px;
          top: ${pos.y - box.size / 2}px;
          opacity: ${0.1 + 0.9 * i / box.trail.length};
          filter: blur(${i / 2}px);
          transform: translateZ(${pos.z}px);
        `;
        containerRef.value.appendChild(trailDot);
        setTimeout(() => trailDot.remove(), 100);
      });
    }
  };

  // 碰撞检测（简易版）
  const checkCollisions = () => {
    if (!config.enableCollisions) return;

    for (let i = 0; i < boxes.value.length; i++) {
      for (let j = i + 1; j < boxes.value.length; j++) {
        const a = boxes.value[i];
        const b = boxes.value[j];
        const dx = a.position.x - b.position.x;
        const dy = a.position.y - b.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (a.size + b.size) / 2) {
          // 碰撞反应 - 简单反弹
          [a.speed, b.speed] = [b.speed * 0.8, a.speed * 0.8];
          a.progress += 0.02;
          b.progress -= 0.02;
          
          // 碰撞粒子效果
          createCollisionParticles(
            (a.position.x + b.position.x) / 2,
            (a.position.y + b.position.y) / 2,
            a.color,
            b.color
          );
        }
      }
    }
  };

  // 创建碰撞粒子
  const createCollisionParticles = (x, y, color1, color2) => {
    for (let i = 0; i < 10; i++) {
      particles.value.push({
        x,
        y,
        size: randomInRange(2, 6),
        color: Math.random() > 0.5 ? color1 : color2,
        vx: randomInRange(-2, 2),
        vy: randomInRange(-2, 2),
        life: 100
      });
    }
  };

  // 主动画循环
  const animate = (timestamp) => {
    if (!lastTimestamp.value) lastTimestamp.value = timestamp;
    const deltaTime = timestamp - lastTimestamp.value;
    lastTimestamp.value = timestamp;

    // 清除旧轨迹
    document.querySelectorAll('.trail-dot').forEach(el => el.remove());

    // 更新所有盒子
    boxes.value.forEach(box => {
      updateBoxPosition(box, deltaTime);
      renderBox(box);
    });

    // 更新并渲染粒子
    particles.value = particles.value.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      
      if (p.life > 0) {
        const particle = document.createElement('div');
        particle.style.cssText = `
          position: absolute;
          width: ${p.size}px;
          height: ${p.size}px;
          background: ${p.color};
          border-radius: 50%;
          left: ${p.x}px;
          top: ${p.y}px;
          opacity: ${p.life / 100};
          filter: blur(1px);
        `;
        containerRef.value.appendChild(particle);
        setTimeout(() => particle.remove(), 16);
        return true;
      }
      return false;
    });

    // 碰撞检测
    checkCollisions();

    animationId.value = requestAnimationFrame(animate);
  };

  // 初始化
  onMounted(() => {
    initContainer();
    createBoxes();
    animationId.value = requestAnimationFrame(animate);
  });

  onUnmounted(() => {
    if (animationId.value) cancelAnimationFrame(animationId.value);
  });

  return {
    // 添加新盒子
    addBox: () => {
      const size = randomInRange(...config.sizeVariation);
      const color = config.palette[boxes.value.length % config.palette.length];
      
      const box = document.createElement('div');
      box.className = 'galactic-box';
      box.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${size / 5}px;
        transform-style: preserve-3d;
        box-shadow: 0 0 ${size / 2}px ${color};
        filter: brightness(1.2);
      `;

      containerRef.value.appendChild(box);

      boxes.value.push({
        element: box,
        size,
        color,
        progress: Math.random(),
        speed: config.baseSpeed * randomInRange(0.8, 1.2),
        position: { x: 0, y: 0, z: 0 },
        trail: []
      });
    },
    // 移除所有盒子
    clearAll: () => {
      boxes.value.forEach(box => box.element.remove());
      boxes.value = [];
    }
  };
}