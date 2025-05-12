/**
 * 旋转动画
 */
import { ref, onMounted, onUnmounted } from 'vue';

export function useOrbitEffect(elementRef, options = {}) {
  const defaultOptions = {
    imageUrl: '',          // 旋转的图片URL
    radius: 100,           // 旋转半径(px)
    speed: 1,              // 旋转速度(圈/秒)
    startAngle: 0,         // 起始角度(度)
    centerX: 0,            // 旋转中心X(相对于元素)
    centerY: 0,            // 旋转中心Y(相对于元素)
    autoStart: true        // 是否自动开始
  };

  const config = { ...defaultOptions, ...options };
  const currentAngle = ref(config.startAngle);
  const currentPosition = ref({ x: 0, y: 0 });
  let animationFrameId = null;
  let startTime = 0;

  // 创建旋转元素
  const createOrbitElement = () => {
    if (!elementRef.value) return;

    const orbitBox = document.createElement('div');
    orbitBox.className = 'orbit-box';
    orbitBox.style.cssText = `
      position: absolute;
      width: ${config.radius * 2}px;
      height: ${config.radius * 2}px;
      pointer-events: none;
      transform-origin: center;
    `;

    const img = document.createElement('img');
    img.src = config.imageUrl;
    img.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: contain;
      transform-origin: center;
    `;

    orbitBox.appendChild(img);
    elementRef.value.appendChild(orbitBox);
    return orbitBox;
  };

  // 更新旋转位置
  const updatePosition = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const elapsed = (timestamp - startTime) / 1000; // 转换为秒
    
    // 计算当前角度(弧度)
    const angle = currentAngle.value + elapsed * config.speed * Math.PI * 2;
    currentAngle.value = angle % (Math.PI * 2);
    
    // 计算坐标位置
    const x = Math.cos(angle) * config.radius + config.centerX;
    const y = Math.sin(angle) * config.radius + config.centerY;
    currentPosition.value = { x, y };
    
    // 应用变换
    const orbitBox = elementRef.value.querySelector('.orbit-box');
    if (orbitBox) {
      orbitBox.style.transform = `
        translate(${x}px, ${y}px)
        rotate(${angle}rad)
      `;
    }
    
    animationFrameId = requestAnimationFrame(updatePosition);
  };

  // 开始/停止动画
  const startAnimation = () => {
    if (!animationFrameId) {
      startTime = 0;
      animationFrameId = requestAnimationFrame(updatePosition);
    }
  };

  const stopAnimation = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  // 初始化
  onMounted(() => {
    createOrbitElement();
    if (config.autoStart) startAnimation();
  });

  onUnmounted(() => {
    stopAnimation();
  });

  return {
    currentPosition,  // 实时位置 { x, y }
    currentAngle,     // 当前角度(弧度)
    startAnimation,
    stopAnimation,
    // 更新配置
    updateConfig: (newConfig) => {
      Object.assign(config, newConfig);
    }
  };
}