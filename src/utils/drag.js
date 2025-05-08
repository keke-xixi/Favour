/**
 * 使一个 div 可拖拽 (鼠标和触摸)
 * @param {HTMLElement} div - 要拖拽的 div 元素  父盒子使用的是 position: relative;
 * const box = document.getElementById('your-div-id');
   makeDraggable(box);
   或者
   <div ref="box"></div>  const box = ref(null); makeDraggable(box.value);
 */
export function makeDraggable(div) {
    let isDragging = false;
    let offsetX, offsetY;
  
    // 鼠标/触摸开始拖拽
    const startDrag = (e) => {
      isDragging = true;
  
      // 计算鼠标/触摸点相对于 div 左上角的偏移
      if (e.type === 'mousedown') {
        offsetX = e.clientX - div.getBoundingClientRect().left;
        offsetY = e.clientY - div.getBoundingClientRect().top;
      } else if (e.type === 'touchstart') {
        const touch = e.touches[0];
        offsetX = touch.clientX - div.getBoundingClientRect().left;
        offsetY = touch.clientY - div.getBoundingClientRect().top;
      }
  
      // 防止文本选中或页面滚动
      e.preventDefault();
    };
  
    // 拖拽中
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
  
      // 设置 div 的新位置（相对视口）
      div.style.left = `${clientX - offsetX}px`;
      div.style.top = `${clientY - offsetY}px`;
    };
  
    // 结束拖拽
    const endDrag = () => {
      isDragging = false;
    };
  
    // 添加鼠标事件监听
    div.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
  
    // 添加触摸事件监听（移动端支持）
    div.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', endDrag);
  
    // 初始化样式（确保 div 可以自由定位）
    div.style.position = 'absolute';
    div.style.cursor = 'grab'; // 鼠标悬停时显示抓取手势
  }
  