<template>
    <Teleport to="body">
        <div
            :style="{
                top: props.top < h * 0.6 ? props.top + 'px' : 'auto',
                bottom: props.top > h * 0.6 ? h - props.top + 'px' : 'auto',
                left: props.left + 'px',
            }"
            class="down"
            @click.stop
        >
            <div style="display: flex; flex-direction: column" @click.stop>
                <span
                    v-for="item in configs"
                    :key="item.id"
                    class="down-item"
                    @click.stop="(e) => clickConfig(item, e)"
                >
                    {{ item.operationName }}
                </span>
            </div>
        </div>
    </Teleport>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { session } from '@/utils/storage'

const emits = defineEmits(['close', 'detail', 'trend'])

interface Props {
    top: number
    left: number
    tagId: string | null
}

interface Configs {
    id: number
    operationName: string
}

interface Point {
    tagId: string
    tagName?: string
    tagValue?: number
}

const props = withDefaults(defineProps<Props>(), {
    top: 0,
    left: 0,
    tagId: null,
})

const h = ref<number>(window.innerHeight)
const configs = ref<Configs[]>([
    {
        id: 1,
        operationName: '查看详情',
    },
    {
        id: 2,
        operationName: '历史趋势',
    },
])

// 点击查看详情、趋势分析
const clickConfig = (item: Configs, e: MouseEvent) => {
    e.preventDefault()
    try {
        if (!props.tagId) {
            return ElMessage.error('缺失点位信息')
        }

        emits('close') // 关闭弹窗

        /** 查看详情 */
        if (item.operationName === '查看详情') {
            emits('detail', props.tagId)
            return
        }

        /** 趋势分析 */
        let ids = [] as Point[]
        const point = session.get('point')
        if (!point || point.length === 0) {
            ids = [
                {
                    tagId: props.tagId,
                },
            ]
        } else {
            const isExist = point.find((item: Point) => item.tagId === props.tagId)
            isExist ? (ids = [...point]) : (ids = [...point, { tagId: props.tagId }])
        }
        session.set('point', ids)
        emits('trend', ids)
    } catch {
        ElMessage.error('打开弹窗失败')
    }
}
</script>

<style lang="scss" scoped>
.down {
    padding: 10px;
    position: fixed;
    display: flex;

    background: #00000a !important;
    box-shadow:
        inset 0px 0px 80px 0px #264b64,
        inset 0px 0px 10px 0px rgba(28, 126, 242, 0.5) !important;
    border-radius: 6px !important;
    border: 1px solid #1b7ef2;
    z-index: 9999;

    div {
        padding: 10px 0;
        gap: 10px;
        min-width: 150px;
    }
    .box {
        margin-left: 10px;
    }

    span {
        display: flex;
        align-items: center;
        height: 32px;
        padding: 0 12px;
        cursor: pointer;
        border-radius: 4px;
        background: rgba(18, 155, 255, 0.2);
        justify-content: space-between;

        &:hover {
            background: rgba(18, 155, 255, 0.4);
        }
    }

    .child {
        background: none !important;

        &:hover {
            background: rgba(18, 155, 255, 0.4) !important;
        }
    }

    .select {
        background: rgba(18, 155, 255, 0.4) !important;
    }

    .green {
        background: #06c789 !important;

        &:hover {
            background: #06c789 !important;
        }
    }
    .red {
        background: #f84c53 !important;

        &:hover {
            background: #f84c53 !important;
        }
    }
    .orange {
        background: #f78d4b !important;

        &:hover {
            background: #f78d4b !important;
        }
    }
}

.down-item {
    color: #cfdce6;
}
</style>
