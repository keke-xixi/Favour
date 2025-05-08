/*
    直接把div的ref作为参数传过来，可以获取盒子实时的位置 （相对父盒子）

    <div ref="draggableBox" class="box">拖拽我！</div>
    <div>当前位置：left: {{ position.left }}, top: {{ position.top }}</div>

    import { useDraggable } from '@/utils/dragPostion.js';

    const draggableBox = ref<any>(null);  // draggableBox.value 就是 DOM 元素
    const { position } = useDraggable(draggableBox); // 获取位置
*/

import { ref, onMounted } from 'vue';

export function useDraggable(elementRef) {
  const position = ref({ left: '0px', top: '0px' });

  onMounted(() => {
    const el = elementRef.value;
    if (!el) return;

    let isDragging = false;
    let offsetX, offsetY;

    const updatePosition = () => {
      position.value = {
        left: el.style.left || '0px',
        top: el.style.top || '0px',
      };
    };

    const startDrag = (e) => {
      isDragging = true;
      if (e.type === 'mousedown') {
        offsetX = e.clientX - el.getBoundingClientRect().left;
        offsetY = e.clientY - el.getBoundingClientRect().top;
      } else if (e.type === 'touchstart') {
        const touch = e.touches[0];
        offsetX = touch.clientX - el.getBoundingClientRect().left;
        offsetY = touch.clientY - el.getBoundingClientRect().top;
      }
      e.preventDefault();
    };

    const drag = (e) => {
      if (!isDragging) return;
      let clientX, clientY;
      if (e.type === 'mousemove') {
        clientX = e.clientX;
        clientY = e.clientY;
      } else if (e.type === 'touchmove') {
        const touch = e.touches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
      }
      el.style.left = `${clientX - offsetX}px`;
      el.style.top = `${clientY - offsetY}px`;
      updatePosition(); // 更新位置
    };

    const endDrag = () => {
      isDragging = false;
    };

    el.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    el.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', endDrag);

    el.style.position = 'absolute';
    el.style.cursor = 'grab';
  });

  return { position }; // 返回位置信息
}