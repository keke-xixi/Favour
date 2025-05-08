/*
  随机移动盒子，传入盒子的 ref ,让盒子随机移动
  const movingBox = ref(null);
  useRandomMove(movingBox, { interval: 200, speed: 0.16 }); // 随机移动 interval 每隔多少毫秒移动一次 speed 动画时长
*/

import { onMounted, onUnmounted } from 'vue';

export function useRandomMove(elementRef, options = {}) {
  const { interval = 2000, speed = 0.5 } = options; // 默认每2秒移动一次，速度中等

  onMounted(() => {
    const el = elementRef.value;
    if (!el) return;

    // 初始化样式
    el.style.position = 'absolute';
    el.style.transition = `all ${speed}s ease-in-out`; // 平滑动画
    el.style.left = '0px';
    el.style.top = '0px';

    // 获取可移动区域（视口 - 盒子尺寸）
    const getMovementBounds = () => {
      const boxWidth = el.offsetWidth;
      const boxHeight = el.offsetHeight;
      return {
        maxX: window.innerWidth - boxWidth,
        maxY: window.innerHeight - boxHeight,
      };
    };

    // 生成随机位置
    const moveToRandomPosition = () => {
      const { maxX, maxY } = getMovementBounds();
      const randomX = Math.floor(Math.random() * maxX);
      const randomY = Math.floor(Math.random() * maxY);
      el.style.left = `${randomX}px`;
      el.style.top = `${randomY}px`;
    };

    // 开始自动移动
    const timer = setInterval(moveToRandomPosition, interval);

    // 组件卸载时清除定时器
    onUnmounted(() => clearInterval(timer));
  });
}