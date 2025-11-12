<!-- 移动组件 -->
<template>
	<div class="container" ref="containerRef" @keydown="handleKeyDown" tabindex="0">
		<!-- 控制面板 -->
		<div class="controls">
			<button @click="zoomOut">-</button>
			<span>缩放: {{ (scale * 100).toFixed(0) }}%</span>
			<button @click="zoomIn">+</button>
			<button @click="resetView">重置视图</button>
			<button @click="toggleGrid">{{ showGrid ? '隐藏网格' : '显示网格' }}</button>
		</div>
		
		<!-- 世界容器 -->
		<div class="world" ref="worldRef" 
			:style="{
				width: worldWidth + 'px',
				height: worldHeight + 'px',
				transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`,
				'transition': isAnimating ? 'transform 0.3s ease' : 'none',
				'background-size': `${cellSize}px ${cellSize}px`,
				'background-image': showGrid ? gridBackground : 'none'
			}">
			
			<!-- 移动的盒子 -->
			<div class="user" 
				:style="{
					width: cellSize + 'px',
					height: cellSize + 'px',
					left: (state.x - worldBounds.left) * cellSize + 'px',
					top: (state.y - worldBounds.top) * cellSize + 'px',
					'transition': isMoving ? 'left 0.2s ease, top 0.2s ease' : 'none'
				}">
				<div class="box-content">
					{{ state.x }}, {{ state.y }}
				</div>
			</div>
			
			<!-- 边界指示器 -->
			<div class="boundary-indicators">
				<div class="boundary top" v-if="worldBounds.top > 0">上边界: {{ worldBounds.top }}</div>
				<div class="boundary bottom" v-if="worldBounds.bottom > 0">下边界: {{ worldBounds.bottom }}</div>
				<div class="boundary left" v-if="worldBounds.left > 0">左边界: {{ worldBounds.left }}</div>
				<div class="boundary right" v-if="worldBounds.right > 0">右边界: {{ worldBounds.right }}</div>
			</div>
		</div>
		
		<!-- 信息显示 -->
		<div class="info-panel">
			<div>位置: ({{ state.x }}, {{ state.y }})</div>
			<div>世界大小: {{ worldWidth / cellSize }} × {{ worldHeight / cellSize }}</div>
			<div>世界边界: 左{{ worldBounds.left }} 右{{ worldBounds.right }} 上{{ worldBounds.top }} 下{{ worldBounds.bottom }}</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue';

const containerRef = ref(null);
const worldRef = ref(null);

// 基础参数
const cellSize = 50; // 每个单元格大小
const extendAmount = 5; // 每次扩展的格子数量

// 世界状态
const worldBounds = reactive({
	left: 0,    // 世界左边界（格子数）
	right: 20,  // 世界右边界（格子数）
	top: 0,     // 世界上边界（格子数）
	bottom: 20  // 世界下边界（格子数）
});

// 视图状态
const scale = ref(1);
const offsetX = ref(0);
const offsetY = ref(0);
const isAnimating = ref(false);
const isMoving = ref(false);
const showGrid = ref(true);

// 盒子状态
const state = reactive({
	x: 10, // 初始位置在中心
	y: 10
});

// 计算世界尺寸
const worldWidth = computed(() => (worldBounds.right - worldBounds.left) * cellSize);
const worldHeight = computed(() => (worldBounds.bottom - worldBounds.top) * cellSize);

// 网格背景
const gridBackground = computed(() => {
	return `
		linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
		linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
	`;
});

// 处理键盘输入
const handleKeyDown = (event) => {
	// 阻止默认行为
	if (['w', 'a', 's', 'd', ' '].includes(event.key)) {
		event.preventDefault();
	}
	
	let newX = state.x;
	let newY = state.y;
	
	switch(event.key) {
		case 'w':
			newY = state.y - 1;
			break;
		case 'a':
			newX = state.x - 1;
			break;
		case 's':
			newY = state.y + 1;
			break;
		case 'd':
			newX = state.x + 1;
			break;
		case ' ':
			// 空格键传送到随机位置
			newX = Math.floor(Math.random() * (worldBounds.right - worldBounds.left)) + worldBounds.left;
			newY = Math.floor(Math.random() * (worldBounds.bottom - worldBounds.top)) + worldBounds.top;
			break;
		default:
			return;
	}
	
	// 移动盒子
	moveTo(newX, newY);
};

// 移动盒子到指定位置
const moveTo = (x, y) => {
	// 检查是否需要扩展世界
	const extended = extendWorldIfNeeded(x, y);
	
	// 更新位置
	isMoving.value = true;
	state.x = x;
	state.y = y;
	
	// 如果有扩展，调整视图
	if (extended) {
		adjustViewAfterExtension();
	} else {
		// 否则确保盒子在视图中
		ensureBoxInView();
	}
	
	// 结束移动状态
	setTimeout(() => {
		isMoving.value = false;
	}, 200);
};

// 检查并扩展世界边界
const extendWorldIfNeeded = (x, y) => {
	let extended = false;
	
	// 检查左边界
	if (x < worldBounds.left) {
		worldBounds.left -= extendAmount;
		extended = true;
	}
	
	// 检查右边界
	if (x >= worldBounds.right) {
		worldBounds.right += extendAmount;
		extended = true;
	}
	
	// 检查上边界
	if (y < worldBounds.top) {
		worldBounds.top -= extendAmount;
		extended = true;
	}
	
	// 检查下边界
	if (y >= worldBounds.bottom) {
		worldBounds.bottom += extendAmount;
		extended = true;
	}
	
	return extended;
};

// 扩展世界后调整视图
const adjustViewAfterExtension = () => {
	// 根据盒子位置调整视图偏移
	const boxScreenX = (state.x - worldBounds.left) * cellSize * scale.value;
	const boxScreenY = (state.y - worldBounds.top) * cellSize * scale.value;
	
	// 计算需要的偏移量，使盒子保持在视图中心附近
	if (!containerRef.value) return;
	
	const containerWidth = containerRef.value.clientWidth;
	const containerHeight = containerRef.value.clientHeight;
	
	const targetOffsetX = -((state.x - worldBounds.left) * cellSize - containerWidth / (2 * scale.value));
	const targetOffsetY = -((state.y - worldBounds.top) * cellSize - containerHeight / (2 * scale.value));
	
	// 应用偏移量
	isAnimating.value = true;
	offsetX.value = targetOffsetX;
	offsetY.value = targetOffsetY;
	
	setTimeout(() => {
		isAnimating.value = false;
	}, 300);
};

// 确保盒子在视图中
const ensureBoxInView = () => {
	if (!containerRef.value) return;
	
	const containerWidth = containerRef.value.clientWidth;
	const containerHeight = containerRef.value.clientHeight;
	
	// 计算盒子在屏幕上的位置
	const boxScreenX = (state.x - worldBounds.left) * cellSize * scale.value + offsetX.value * scale.value;
	const boxScreenY = (state.y - worldBounds.top) * cellSize * scale.value + offsetY.value * scale.value;
	
	// 盒子尺寸（缩放后）
	const boxSize = cellSize * scale.value;
	
	// 边界阈值
	const threshold = 100;
	
	let newOffsetX = offsetX.value;
	let newOffsetY = offsetY.value;
	
	// 检查是否需要调整X轴偏移
	if (boxScreenX < threshold) {
		newOffsetX += (threshold - boxScreenX) / scale.value;
	} else if (boxScreenX + boxSize > containerWidth - threshold) {
		newOffsetX -= (boxScreenX + boxSize - (containerWidth - threshold)) / scale.value;
	}
	
	// 检查是否需要调整Y轴偏移
	if (boxScreenY < threshold) {
		newOffsetY += (threshold - boxScreenY) / scale.value;
	} else if (boxScreenY + boxSize > containerHeight - threshold) {
		newOffsetY -= (boxScreenY + boxSize - (containerHeight - threshold)) / scale.value;
	}
	
	// 应用新的偏移量（如果有变化）
	if (newOffsetX !== offsetX.value || newOffsetY !== offsetY.value) {
		isAnimating.value = true;
		offsetX.value = newOffsetX;
		offsetY.value = newOffsetY;
		
		setTimeout(() => {
			isAnimating.value = false;
		}, 300);
	}
};

// 缩放功能
const zoomIn = () => {
	isAnimating.value = true;
	scale.value = Math.min(3, scale.value + 0.1);
	setTimeout(() => {
		isAnimating.value = false;
		ensureBoxInView();
	}, 300);
};

const zoomOut = () => {
	isAnimating.value = true;
	scale.value = Math.max(0.3, scale.value - 0.1);
	setTimeout(() => {
		isAnimating.value = false;
		ensureBoxInView();
	}, 300);
};

// 重置视图
const resetView = () => {
	isAnimating.value = true;
	scale.value = 1;
	offsetX.value = 0;
	offsetY.value = 0;
	
	// 重置世界边界
	worldBounds.left = 0;
	worldBounds.right = 20;
	worldBounds.top = 0;
	worldBounds.bottom = 20;
	
	// 重置盒子位置
	state.x = 10;
	state.y = 10;
	
	setTimeout(() => {
		isAnimating.value = false;
	}, 300);
};

// 切换网格显示
const toggleGrid = () => {
	showGrid.value = !showGrid.value;
};

onMounted(() => {
	// 确保容器获得焦点
	containerRef.value.focus();
	
	// 初始调整视图
	setTimeout(() => {
		adjustViewAfterExtension();
	}, 100);
});
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100vh;
	position: relative;
	overflow: hidden;
	background: #f0f2f5;
	
	// 控制面板
	.controls {
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 10;
		background: rgba(255, 255, 255, 0.9);
		padding: 10px;
		border-radius: 5px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		gap: 10px;
		
		button {
			padding: 5px 10px;
			border: 1px solid #ddd;
			background: white;
			border-radius: 3px;
			cursor: pointer;
			
			&:hover {
				background: #f5f5f5;
			}
		}
	}
	
	// 世界容器
	.world {
		position: absolute;
		top: 0;
		left: 0;
		transform-origin: 0 0;
		background-color: rgba(255, 255, 255, 0.8);
		
		// 移动的盒子
		.user {
			position: absolute;
			background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
			border-radius: 8px;
			box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;
			font-weight: bold;
			font-size: 14px;
			
			.box-content {
				transform: scale(calc(1 / v-bind(scale)));
			}
			
			&::after {
				content: '';
				position: absolute;
				top: -5px;
				left: -5px;
				right: -5px;
				bottom: -5px;
				border: 2px solid rgba(255, 255, 255, 0.5);
				border-radius: 12px;
				animation: pulse 2s infinite;
			}
		}
		
		// 边界指示器
		.boundary-indicators {
			.boundary {
				position: absolute;
				padding: 5px 10px;
				background: rgba(255, 0, 0, 0.7);
				color: white;
				font-size: 12px;
				border-radius: 3px;
				z-index: 5;
			}
			
			.top {
				top: 10px;
				left: 50%;
				transform: translateX(-50%);
			}
			
			.bottom {
				bottom: 10px;
				left: 50%;
				transform: translateX(-50%);
			}
			
			.left {
				left: 10px;
				top: 50%;
				transform: translateY(-50%);
			}
			
			.right {
				right: 10px;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}
	
	// 信息面板
	.info-panel {
		position: absolute;
		bottom: 10px;
		left: 10px;
		background: rgba(0, 0, 0, 0.7);
		color: white;
		padding: 10px 15px;
		border-radius: 5px;
		font-size: 14px;
		line-height: 1.5;
	}
}

// 脉冲动画
@keyframes pulse {
	0% {
		transform: scale(1);
		opacity: 1;
	}
	50% {
		transform: scale(1.05);
		opacity: 0.7;
	}
	100% {
		transform: scale(1);
		opacity: 1;
	}
}
</style>