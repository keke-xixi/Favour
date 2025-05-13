// useGridBoxAnimation.js
import { ref, onMounted, onUnmounted } from 'vue';

export function useGridBoxAnimation(elementRef, options = {}) {
  const defaultOptions = {
    gridColumns: 20,        // 水平格子数
    gridRows: 20,           // 垂直格子数
    moveDuration: 300,      // 移动动画时长(ms)
    boxColor: '#3498db',    // 盒子颜色
    activeColor: '#e74c3c'  // 激活格子颜色
  };

  const config = { ...defaultOptions, ...options };
  const gridRef = ref(null);
  const currentPos = ref({ x: 10, y: 10 }); // 初始居中位置
  const isMoving = ref(false);
  const visitedCells = ref([]);
  let animationFrameId = null;

  // 初始化网格
  const initGrid = () => {
    if (!elementRef.value) return;

    elementRef.value.innerHTML = '';
    elementRef.value.style.display = 'grid';
    elementRef.value.style.gridTemplateColumns = `repeat(${config.gridColumns}, 1fr)`;
    elementRef.value.style.gridTemplateRows = `repeat(${config.gridRows}, 1fr)`;
    elementRef.value.style.gap = '1px';
    elementRef.value.style.width = '100vmin';
    elementRef.value.style.height = '100vmin';
    elementRef.value.style.backgroundColor = '#eee';

    // 创建网格单元格
    for (let y = 0; y < config.gridRows; y++) {
      for (let x = 0; x < config.gridColumns; x++) {
        const cell = document.createElement('div');
        cell.dataset.x = x;
        cell.dataset.y = y;
        cell.style.backgroundColor = 'white';
        cell.style.transition = 'background-color 0.3s';
        elementRef.value.appendChild(cell);
      }
    }

    // 创建移动盒子
    const box = document.createElement('div');
    box.style.gridColumn = `${currentPos.value.x + 1}`;
    box.style.gridRow = `${currentPos.value.y + 1}`;
    box.style.backgroundColor = config.boxColor;
    box.style.transition = `all ${config.moveDuration}ms ease-in-out`;
    box.style.borderRadius = '4px';
    elementRef.value.appendChild(box);
    gridRef.value = box;

    // 标记初始位置
    markVisitedCell(currentPos.value.x, currentPos.value.y);
  };

  // 标记访问过的格子
  const markVisitedCell = (x, y) => {
    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    if (cell) {
      cell.style.backgroundColor = config.activeColor;
      visitedCells.value.push({ x, y });
    }
  };

  // 移动盒子
  const moveBox = (direction) => {
    if (isMoving.value) return;

    const newPos = { ...currentPos.value };
    switch (direction) {
      case 'up': newPos.y = Math.max(0, newPos.y - 1); break;
      case 'down': newPos.y = Math.min(config.gridRows - 1, newPos.y + 1); break;
      case 'left': newPos.x = Math.max(0, newPos.x - 1); break;
      case 'right': newPos.x = Math.min(config.gridColumns - 1, newPos.x + 1); break;
    }

    // 检查是否移动
    if (newPos.x === currentPos.value.x && newPos.y === currentPos.value.y) return;

    isMoving.value = true;
    gridRef.value.style.gridColumn = `${newPos.x + 1}`;
    gridRef.value.style.gridRow = `${newPos.y + 1}`;

    setTimeout(() => {
      currentPos.value = newPos;
      markVisitedCell(newPos.x, newPos.y);
      isMoving.value = false;
    }, config.moveDuration);
  };

  // 键盘控制
  const handleKeyDown = (e) => {
    if (isMoving.value) return;
    switch (e.key) {
      case 'ArrowUp': moveBox('up'); break;
      case 'ArrowDown': moveBox('down'); break;
      case 'ArrowLeft': moveBox('left'); break;
      case 'ArrowRight': moveBox('right'); break;
    }
  };

  // 初始化
  onMounted(() => {
    initGrid();
    window.addEventListener('keydown', handleKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  });

  return {
    currentPos,
    visitedCells,
    moveBox,
    // 重置网格
    resetGrid: () => {
      visitedCells.value = [];
      document.querySelectorAll('[data-x][data-y]').forEach(cell => {
        cell.style.backgroundColor = 'white';
      });
      markVisitedCell(currentPos.value.x, currentPos.value.y);
    }
  };
}