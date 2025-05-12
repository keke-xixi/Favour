/**
 * 旋转动画
 */
import { onMounted, onUnmounted } from 'vue';

export function useRotateImage(elementRef, options = {}) {
  const defaultOptions = {
    imageUrl: '',          // 图片URL（必传）
    rotationSpeed: 1,      // 旋转速度（圈/秒）
    startAngle: 0,         // 起始角度（度）
    hoverEffect: true,     // 悬停加速效果
    clickEffect: false,    // 点击反弹效果
    size: 100              // 图片大小（px）
  };

  const config = { ...defaultOptions, ...options };
  let currentAngle = config.startAngle;
  let animationFrameId = null;
  let isHovering = false;
  let isAnimating = false;

  // 创建图片元素
  const createImageElement = () => {
    if (!elementRef.value || !config.imageUrl) return;

    elementRef.value.innerHTML = '';
    elementRef.value.style.width = `${config.size}px`;
    elementRef.value.style.height = `${config.size}px`;
    elementRef.value.style.position = 'relative';

    const img = document.createElement('img');
    img.src = config.imageUrl;
    img.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
      position: absolute;
      transition: transform 0.05s linear;
      user-select: none;
      pointer-events: none;
    `;

    elementRef.value.appendChild(img);
    return img;
  };

  // 旋转动画
  const rotate = () => {
    if (!elementRef.value) return;

    const img = elementRef.value.querySelector('img');
    if (!img) return;

    // 计算旋转角度（考虑悬停加速）
    const speedMultiplier = isHovering && config.hoverEffect ? 2 : 1;
    currentAngle += 360 * config.rotationSpeed / 60 * speedMultiplier;
    if (currentAngle >= 360) currentAngle -= 360;

    img.style.transform = `rotate(${currentAngle}deg)`;
    animationFrameId = requestAnimationFrame(rotate);
  };

  // 点击反弹动画
  const bounceAnimation = () => {
    if (!isAnimating) return;
    
    const img = elementRef.value.querySelector('img');
    if (!img) return;

    // 使用正弦函数实现弹性效果
    const progress = Math.min(1, (Date.now() - bounceStartTime) / 500);
    const elastic = Math.sin(progress * Math.PI * 2) * 0.2;
    
    img.style.transform = `
      rotate(${currentAngle}deg)
      scale(${1 + elastic})
    `;

    if (progress < 1) {
      requestAnimationFrame(bounceAnimation);
    } else {
      isAnimating = false;
    }
  };

  // 事件监听
  const setupEventListeners = () => {
    if (!elementRef.value) return;

    if (config.hoverEffect) {
      elementRef.value.addEventListener('mouseenter', () => {
        isHovering = true;
      });
      elementRef.value.addEventListener('mouseleave', () => {
        isHovering = false;
      });
    }

    if (config.clickEffect) {
      elementRef.value.addEventListener('click', () => {
        isAnimating = true;
        bounceStartTime = Date.now();
        bounceAnimation();
      });
    }
  };

  // 初始化
  onMounted(() => {
    const img = createImageElement();
    if (img) {
      setupEventListeners();
      rotate(); // 开始旋转
    }
  });

  onUnmounted(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });

  return {
    // 外部控制方法
    setRotationSpeed: (speed) => {
      config.rotationSpeed = speed;
    },
    setImage: (newUrl) => {
      config.imageUrl = newUrl;
      createImageElement();
    },
    // 手动触发旋转（角度制）
    rotateTo: (angle) => {
      currentAngle = angle;
    }
  };
}