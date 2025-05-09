// src/composables/useBoxCollision.js
import { onMounted, onUnmounted } from 'vue';

export function useBoxCollision(containerRef, options = {}) {
  const defaultOptions = {
    boxSize: 60,
    initialSpeed: 3,
    bounceFactor: 0.9,
    friction: 0.995,
    colors: ['#3498db', '#e74c3c'],
    collisionAnimationDuration: 300
  };
  
  const config = { ...defaultOptions, ...options };
  let animationId;
  let boxes = [];
  let containerRect = { width: 0, height: 0 };

  // 初始化两个盒子
  const initBoxes = () => {
    boxes = [
      {
        x: 50,
        y: 50,
        vx: config.initialSpeed,
        vy: config.initialSpeed,
        color: config.colors[0],
        element: null,
        scale: 1
      },
      {
        x: containerRect.width - 50 - config.boxSize,
        y: containerRect.height - 50 - config.boxSize,
        vx: -config.initialSpeed,
        vy: -config.initialSpeed,
        color: config.colors[1],
        element: null,
        scale: 1
      }
    ];
  };

  // 物理碰撞检测
  const checkCollision = (box1, box2) => {
    return (
      box1.x < box2.x + config.boxSize &&
      box1.x + config.boxSize > box2.x &&
      box1.y < box2.y + config.boxSize &&
      box1.y + config.boxSize > box2.y
    );
  };

  // 碰撞反应（动量守恒简化版）
  const handleCollision = (box1, box2) => {
    // 交换速度（简化物理）
    [box1.vx, box2.vx] = [
      box2.vx * config.bounceFactor, 
      box1.vx * config.bounceFactor
    ];
    [box1.vy, box2.vy] = [
      box2.vy * config.bounceFactor, 
      box1.vy * config.bounceFactor
    ];
    
    // 碰撞动画效果
    box1.scale = 1.2;
    box2.scale = 1.2;
    setTimeout(() => {
      box1.scale = 1;
      box2.scale = 1;
    }, config.collisionAnimationDuration);
  };

  // 更新盒子位置和状态
  const updateBoxes = () => {
    boxes.forEach(box => {
      // 应用摩擦力
      box.vx *= config.friction;
      box.vy *= config.friction;
      
      // 更新位置
      box.x += box.vx;
      box.y += box.vy;
      
      // 边界检测
      if (box.x < 0) {
        box.x = 0;
        box.vx = -box.vx * config.bounceFactor;
      } else if (box.x > containerRect.width - config.boxSize) {
        box.x = containerRect.width - config.boxSize;
        box.vx = -box.vx * config.bounceFactor;
      }
      
      if (box.y < 0) {
        box.y = 0;
        box.vy = -box.vy * config.bounceFactor;
      } else if (box.y > containerRect.height - config.boxSize) {
        box.y = containerRect.height - config.boxSize;
        box.vy = -box.vy * config.bounceFactor;
      }
    });
    
    // 检测盒子间碰撞
    if (checkCollision(boxes[0], boxes[1])) {
      handleCollision(boxes[0], boxes[1]);
    }
  };

  // 渲染盒子到DOM
  const renderBoxes = () => {
    boxes.forEach((box, index) => {
      if (box.element) {
        box.element.style.transform = `
          translate(${box.x}px, ${box.y}px)
          scale(${box.scale})
        `;
      }
    });
  };

  // 动画循环
  const animate = () => {
    updateBoxes();
    renderBoxes();
    animationId = requestAnimationFrame(animate);
  };

  // 创建DOM元素
  const createBoxElements = () => {
    const container = containerRef.value;
    if (!container) return;
    
    container.innerHTML = '';
    containerRect = container.getBoundingClientRect();
    
    boxes.forEach((box, index) => {
      const boxEl = document.createElement('div');
      boxEl.className = 'collision-box';
      boxEl.textContent = index === 0 ? 'A' : 'B';
      
      boxEl.style.cssText = `
        position: absolute;
        width: ${config.boxSize}px;
        height: ${config.boxSize}px;
        background: ${box.color};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        font-weight: bold;
        font-size: 18px;
        transform: translate(${box.x}px, ${box.y}px);
        transition: 
          transform 0.1s ease-out, 
          background-color 0.3s ease;
        will-change: transform;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        z-index: 10;
      `;
      
      container.appendChild(boxEl);
      box.element = boxEl;
    });
  };

  // 重置动画
  const resetAnimation = () => {
    cancelAnimationFrame(animationId);
    initBoxes();
    createBoxElements();
    animate();
  };

  onMounted(() => {
    const container = containerRef.value;
    if (container) {
      container.style.position = 'relative';
      container.style.overflow = 'hidden';
      
      // 初始化
      initBoxes();
      createBoxElements();
      animate();
      
      // 点击重置
      container.addEventListener('click', resetAnimation);
      
      // 窗口大小变化时重置
      window.addEventListener('resize', resetAnimation);
    }
  });

  onUnmounted(() => {
    cancelAnimationFrame(animationId);
    const container = containerRef.value;
    if (container) {
      container.removeEventListener('click', resetAnimation);
    }
    window.removeEventListener('resize', resetAnimation);
  });
}