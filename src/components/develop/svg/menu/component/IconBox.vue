<template>
    <div>
        <div v-if="error" class="error">图标加载失败: {{ name }}</div>
        <svg v-else ref="svgRef" class="icon" :viewBox="viewBox" :width="size" :height="size" :style="nowStyle"></svg>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'

const props = defineProps({
    name: String,
    size: { type: [String, Number], default: 20 },
    custom: {
        type: Object,
        default: () => {},
    },
})

const nowStyle = computed(() => ({ ...props.custom }))

const svgRef = ref<SVGSVGElement | null>(null)
const viewBox = ref('0 0 1024 1024')
const error = ref(false)

// 清理 SVG 并返回 viewBox 和 处理后的 DOM 节点
const processSvg = (svgDoc: Document): { viewBox: string; svgElement: SVGSVGElement } | null => {
    const svg = svgDoc.querySelector('svg')
    if (!svg) return null

    // 获取 viewBox
    let vb = svg.getAttribute('viewBox')
    if (!vb) {
        const width = svg.getAttribute('width')
        const height = svg.getAttribute('height')
        if (width && height) {
            vb = `0 0 ${parseInt(width)} ${parseInt(height)}`
        } else {
            vb = '0 0 1024 1024'
        }
    }

    // 递归清理颜色属性
    const clean = (el: Element) => {
        // 处理 fill
        const fill = el.getAttribute('fill')
        if (fill && fill !== 'none' && fill !== 'currentColor') {
            el.removeAttribute('fill')
        }
        // 处理 stroke
        const stroke = el.getAttribute('stroke')
        if (stroke && stroke !== 'none') {
            el.setAttribute('stroke', 'currentColor')
        }
        // 清理 style
        const style = el.getAttribute('style')
        if (style) {
            const newStyle = style
                .replace(/fill:[^;]+;?/g, '')
                .replace(/stroke:[^;]+;?/g, '')
                .trim()
            if (newStyle) el.setAttribute('style', newStyle)
            else el.removeAttribute('style')
        }
        // 递归
        Array.from(el.children).forEach(clean)
    }

    Array.from(svg.children).forEach(clean)

    // 移除 svg 自带的 width/height，避免冲突
    svg.removeAttribute('width')
    svg.removeAttribute('height')

    // 克隆节点以避免引用问题
    const clonedSvg = svg.cloneNode(true) as SVGSVGElement
    return { viewBox: vb, svgElement: clonedSvg }
}

const loadIcon = async (name: string) => {
    if (!name) return
    error.value = false
    try {
        const module = await import(`@/assets/icons/svg/${name}.svg?raw`)
        const rawSvg = module.default
        const parser = new DOMParser()
        const doc = parser.parseFromString(rawSvg, 'image/svg+xml')
        const result = processSvg(doc)
        if (!result) throw new Error('Invalid SVG')

        const { viewBox: vb, svgElement } = result
        viewBox.value = vb

        // 清空并重新挂载处理后的 SVG 元素
        if (svgRef.value) {
            // 清空原有内容
            while (svgRef.value.firstChild) {
                svgRef.value.removeChild(svgRef.value.firstChild)
            }
            // 将处理后的子节点转移过来
            while (svgElement.firstChild) {
                svgRef.value.appendChild(svgElement.firstChild)
            }
            // 复制其他属性（如 viewBox 已经通过 props 设置，但这里确保一下）
            svgRef.value.setAttribute('viewBox', vb)
        }
    } catch (err) {
        console.warn(`Icon load error: ${name}`, err)
        error.value = true
    }
}

onMounted(() => {
    if (props.name) loadIcon(props.name)
})

watch(
    () => props.name,
    (newName) => {
        if (newName) loadIcon(newName)
    }
)
</script>

<style scoped>
.icon {
    display: inline-block;
    transition: all 0.3s;
}

/* 强制所有图形元素默认继承颜色 */
.icon :deep(path),
.icon :deep(circle),
.icon :deep(rect),
.icon :deep(polygon),
.icon :deep(polyline),
.icon :deep(g) {
    fill: currentColor;
}

/* 对于 stroke 类型的图标，描边也继承颜色 */
.icon :deep([stroke]) {
    stroke: currentColor;
}

/* 保留 fill="none" 的特殊性 */
.icon :deep([fill='none']) {
    fill: none;
}

/* 保留 stroke="none" 的特殊性 */
.icon :deep([stroke='none']) {
    stroke: none;
}

.icon:hover {
    color: #409eff;
}

.error {
    color: #f56c6c;
    font-size: 12px;
}
</style>
