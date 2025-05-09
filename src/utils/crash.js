/*
   碰撞动画
*/
import { onMounted, onUnmounted } from 'vue';

export function useBoxCollision(containerRef, options = {}) {
  const defaultOptions = {
    boxSize: 40,
    speed: 2,
    bounceFactor: 0.9,
    friction: 0.99,
    colors: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12']
  };
  
  const config = { ...defaultOptions, ...options };
  let animationId;
  let boxes = [
    {
      x: 0,
      y: 0,
      vx: config.speed,
      vy: config.speed,
      color: config.colors[0]
    },
    {
      x: 0,
      y: 0,
      vx: -config.speed,
      vy: -config.speed,
      color: config.colors[1]
    }
  ];

  const checkCollision = (box1, box2) => {
    return (
      box1.x < box2.x + config.boxSize &&
      box1.x + config.boxSize > box2.x &&
      box1.y < box2.y + config.boxSize &&
      box1.y + config.boxSize > box2.y
    );
  };

  const handleCollision = (box1, box2) => {
    // 简单物理碰撞反应
    const tempVx = box1.vx;
    const tempVy = box1.vy;
    
    box1.vx = box2.vx * config.bounceFactor;
    box1.vy = box2.vy * config.bounceFactor;
    box2.vx = tempVx * config.bounceFactor;
    box2.vy = tempVy * config.bounceFactor;
    
    // 改变颜色
    const newColor1 = config.colors[Math.floor(Math.random() * config.colors.length)];
    const newColor2 = config.colors[Math.floor(Math.random() * config.colors.length)];
    box1.color = newColor1;
    box2.color = newColor2;
  };

  const updatePositions = () => {
    const container = containerRef.value;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const maxX = containerRect.width - config.boxSize;
    const maxY = containerRect.height - config.boxSize;

    // 更新每个盒子的位置
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
      } else if (box.x > maxX) {
        box.x = maxX;
        box.vx = -box.vx * config.bounceFactor;
      }

      if (box.y < 0) {
        box.y = 0;
        box.vy = -box.vy * config.bounceFactor;
      } else if (box.y > maxY) {
        box.y = maxY;
        box.vy = -box.vy * config.bounceFactor;
      }
    });

    // 检测盒子间的碰撞
    if (checkCollision(boxes[0], boxes[1])) {
      handleCollision(boxes[0], boxes[1]);
    }

    // 更新DOM
    const boxElements = container.querySelectorAll('.collision-box');
    boxElements.forEach((el, index) => {
      const box = boxes[index];
      el.style.transform = `translate(${box.x}px, ${box.y}px)`;
      el.style.backgroundColor = box.color;
    });

    animationId = requestAnimationFrame(updatePositions);
  };

  const initBoxes = () => {
    const container = containerRef.value;
    if (!container) return;

    // 清空容器
    container.innerHTML = '';

    // 创建两个盒子
    boxes.forEach((box, index) => {
      const boxEl = document.createElement('div');
      boxEl.className = 'collision-box';
      boxEl.textContent = index === 0 ? 'A' : 'B';
      
      // 初始位置 - 放在容器对角
      box.x = index === 0 ? 0 : container.clientWidth - config.boxSize;
      box.y = index === 0 ? 0 : container.clientHeight - config.boxSize;
      
      boxEl.style.cssText = `
        position: absolute;
        width: ${config.boxSize}px;
        height: ${config.boxSize}px;
        background: ${box.color};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        font-weight: bold;
        transform: translate(${box.x}px, ${box.y}px);
        transition: transform 0.1s linear, background-color 0.3s ease;
        will-change: transform;
      `;
      
      container.appendChild(boxEl);
    });

    // 开始动画
    animationId = requestAnimationFrame(updatePositions);
  };

  const resetAnimation = () => {
    cancelAnimationFrame(animationId);
    initBoxes();
  };

  onMounted(() => {
    const container = containerRef.value;
    if (container) {
      container.style.position = 'relative';
      container.style.overflow = 'hidden';
      initBoxes();
      
      // 点击容器重置动画
      container.addEventListener('click', resetAnimation);
    }
  });

  onUnmounted(() => {
    cancelAnimationFrame(animationId);
    const container = containerRef.value;
    if (container) {
      container.removeEventListener('click', resetAnimation);
    }
  });
}