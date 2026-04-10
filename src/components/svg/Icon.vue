<!-- components/Icon.vue -->
<template>
    <svg v-if="svgContent" class="icon" viewBox="0 0 1024 1024" :width="size" :height="size" v-html="svgContent"></svg>
</template>

<script setup lang="ts" name="Icon">
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    size: {
        type: [String, Number],
        default: 20,
    },
})

const svgContent = ref('')

// 动态导入所有 SVG 文件
const svgModules = import.meta.glob('@/assets/icons/svg/*.svg', {
    query: '?raw',
    import: 'default',
})

const loadSvg = async (name) => {
    try {
        const path = `/src/assets/icons/svg/${name}.svg`
        const module = await svgModules[path]()
        // 提取 path 部分
        const parser = new DOMParser()
        const doc = parser.parseFromString(module, 'text/html')
        const svg = doc.querySelector('svg')
        if (svg) {
            svgContent.value = svg.innerHTML
        }
    } catch (error) {
        console.error(`Failed to load SVG: ${name}`, error)
    }
}

watch(
    () => props.name,
    (newName) => {
        if (newName) loadSvg(newName)
    },
    { immediate: true }
)
</script>

<style scoped>
.icon {
    fill: currentColor;
    transition: all 0.3s;
}

.icon:hover {
    color: #409eff;
}
</style>
