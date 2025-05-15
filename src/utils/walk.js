/**
 * 走路移动动画
 */
import { ref, onMounted, onUnmounted } from 'vue';

export function useCharacterAnimation(elementRef, options = {}) {
  const defaultOptions = {
    spriteSheet: '',       // 精灵图路径
    frameWidth: 64,        // 单帧宽度
    frameHeight: 64,       // 单帧高度
    frameCount: 4,         // 行走动画帧数
    fps: 60,               // 动画帧率
    speed: 2,              // 移动速度(像素/帧)
    direction: 'right'     // 初始方向
  };
  
  var animationFrameId = null;
  const config = { ...defaultOptions, ...options };
  const currentFrame = ref(0);
  const position = ref({ x: 0, y: 0 });
  const isWalking = ref(false);
  let animationInterval = null;
  let lastTimestamp = 0;

  // 设置精灵图样式
  const initSprite = () => {
    if (!elementRef.value) return;
    
    elementRef.value.style.cssText = `
      position: absolute;
      width: ${config.frameWidth}px;
      height: ${config.frameHeight}px;
      background-image: url(${config.spriteSheet});
      background-repeat: no-repeat;
      image-rendering: pixelated;
    `;
    updateFrame();
  };

  // 更新当前动画帧
  const updateFrame = () => {
    const frameX = currentFrame.value * config.frameWidth;
    const frameY = config.direction === 'right' ? 0 : config.frameHeight;
    
    elementRef.value.style.backgroundPosition = `-${frameX}px -${frameY}px`;
    elementRef.value.style.transform = `scaleX(${config.direction === 'left' ? -1 : 1})`;
  };

  // 更新位置
  const updatePosition = (timestamp) => {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (isWalking.value) {
      const distance = config.speed * (deltaTime / 16); // 标准化到60fps
      position.value.x += config.direction === 'right' ? distance : -distance;
      elementRef.value.style.left = `${position.value.x}px`;
      
      // 动画帧切换
      currentFrame.value = (currentFrame.value + 1) % config.frameCount;
      updateFrame();
    }

    animationFrameId = requestAnimationFrame(updatePosition);
  };

  // 控制方法
  const startWalking = (direction) => {
    if (direction) config.direction = direction;
    isWalking.value = true;
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(updatePosition);
    }
    updateFrame();
  };

  const stopWalking = () => {
    isWalking.value = false;
    currentFrame.value = 0;
    updateFrame();
  };

  // 初始化
  onMounted(() => {
    initSprite();
    elementRef.value.style.left = `${position.value.x}px`;
    elementRef.value.style.top = `${position.value.y}px`;
  });

  onUnmounted(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (animationInterval) clearInterval(animationInterval);
  });

  return {
    position,
    isWalking,
    startWalking,
    stopWalking,
    // 改变方向但不改变移动状态
    setDirection: (dir) => {
      config.direction = dir;
      updateFrame();
    },
    // 跳跃动作
    jump: () => {
      // 简化的跳跃实现
      const jumpHeight = 50;
      const originalY = position.value.y;
      
      for (let i = 0; i < jumpHeight; i++) {
        setTimeout(() => {
          position.value.y = originalY - Math.sin(i/jumpHeight * Math.PI) * jumpHeight;
          elementRef.value.style.top = `${position.value.y}px`;
        }, i * 10);
      }
    }
  };
}