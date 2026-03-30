<template>
    <component :is="as" v-bind="$attrs" @contextmenu.stop.prevent="handleRightClick" class="point-right-click">
        <slot />
        <Dialog
            :top="state.top"
            :left="state.left"
            :tagId="state.tagId"
            v-if="showDialog"
            @close="closeDown"
            @detail="openDetail"
            @trend="openTrend"
            @click.stop.prevent
        />

        <!-- 查看详情 -->
        <Detail v-if="showDetail" :tag-id="state.tagId" @close="showDetail = false" />

        <!-- 趋势分析 （趋势分析作为全局点位共用的弹窗、放到 Layout 中） -->
    </component>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/store/modules/app'

import Dialog from './component/Dialog.vue'
import Detail from './component/Detail.vue'

const store = useAppStore()

interface Props {
    as?: string // 组件类型
    tagId: string // 点位 tagId
}

interface State {
    top: number
    left: number
    tagId: string | null
}

const props = withDefaults(defineProps<Props>(), {
    as: 'div',
    tagId: '',
})

const state = reactive<State>({
    top: 0,
    left: 0,
    tagId: null,
})

const showDialog = ref(false)
const showDetail = ref(false)

// 右击
const handleRightClick = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    state.top = event.clientY
    state.left = event.clientX
    state.tagId = props.tagId
    showDialog.value = true
}

const closeDown = (event?: Event) => {
    if (event?.target) {
        const dialogEl = document.querySelector('.down')
        const detailEl = document.querySelector('.paramDetail')
        const targetNode = event.target as Node
        if (dialogEl?.contains(targetNode) || detailEl?.contains(targetNode)) {
            return
        }
    }
    showDialog.value = false
}

// 趋势分析弹窗
const openTrend = () => {
    store.setTrend(true)
}

// 查看详情弹窗
const openDetail = () => {
    showDetail.value = true
}

onMounted(() => {
    window.addEventListener('click', closeDown)
    window.addEventListener('wheel', closeDown)
})

onUnmounted(() => {
    window.removeEventListener('click', closeDown)
    window.removeEventListener('wheel', closeDown)
})

defineExpose({
    closeDown,
})
</script>

<style lang="scss" scoped>
.point-right-click {
    cursor: pointer;
    z-index: 1000;
}
</style>
