<template>
    <Teleport to="body">
        <div @click.stop>
            <div v-loading="loading" class="paramDetail">
                <div class="title">
                    <span>参数信息</span>
                    <el-icon @click="close"><Close style="font-size: 16px; cursor: pointer" /></el-icon>
                </div>
                <el-descriptions class="margin-top" :column="1" border>
                    <el-descriptions-item label="属性" class-name="aaa" label-class-name="aaa"
                        >值信息</el-descriptions-item
                    >
                    <el-descriptions-item label="测点名称">{{ info.pointDesc || '--' }}</el-descriptions-item>
                    <el-descriptions-item label="测点编码">
                        <div class="flex-box">
                            <div>{{ tagId || '--' }}</div>
                            <el-button type="primary" @click.stop="copyComponent(tagId)" class="copy-button"
                                >复制</el-button
                            >
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item label="实时值">{{
                        info.value == undefined ? '--' : info.value
                    }}</el-descriptions-item>
                    <el-descriptions-item label="时间">{{
                        info.time ? format(new Date(info.time), 'yyyy-MM-dd HH:mm:ss') : '--'
                    }}</el-descriptions-item>
                </el-descriptions>
            </div>

            <div class="mask" @click.stop.prevent="close"></div>
        </div>
    </Teleport>
</template>

<script lang="ts" setup>
import { Close } from '@element-plus/icons-vue'
import { format } from 'date-fns'
import { queryPointDetail } from '@/services/api/index'
import { ref, onMounted } from 'vue'

interface Props {
    tagId: string | null | undefined
}

const props = withDefaults(defineProps<Props>(), {
    tagId: '',
})

const emits = defineEmits(['close'])

const loading = ref(false)
const info = ref<Snapshot.PointDetail>({
    pointValueUnit: '',
    pointDesc: '',
    pointDataType: '',
    devicePath: '',
    deviceTag: '',
    deviceTypeName: '',
    value: '',
    time: 0,
})

// 关闭弹窗
const close = () => {
    emits('close')
}

// 复制
const copyComponent = async (text: any) => {
    copyText(text)
    showCopySuccess()
}

// 复制文本
const copyText = (function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return async (text: string) => {
            try {
                await navigator.clipboard.writeText(text)
                return true
            } catch (err) {
                return fallbackCopyText(text)
            }
        }
    } else {
        return (text: string) => {
            return fallbackCopyText(text)
        }
    }
})()

// 传统复制方法
const fallbackCopyText = (text: string): boolean => {
    try {
        const textArea = document.createElement('textarea')
        textArea.value = text

        textArea.style.position = 'fixed'
        textArea.style.top = '0'
        textArea.style.left = '0'
        textArea.style.width = '2em'
        textArea.style.height = '2em'
        textArea.style.padding = '0'
        textArea.style.border = 'none'
        textArea.style.outline = 'none'
        textArea.style.boxShadow = 'none'
        textArea.style.background = 'transparent'

        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)

        return successful
    } catch (err) {
        return false
    }
}

// 显示复制成功提示
const showCopySuccess = () => {
    const btn = document.querySelector('.copy-button')
    if (btn) {
        const originalText = btn.innerHTML
        btn.innerHTML = '✓ 已复制'
        btn.setAttribute('style', 'background-color: #4caf50;')

        setTimeout(() => {
            btn.innerHTML = originalText
            btn.setAttribute('style', '')
        }, 1500)
    }
}

const getDetail = () => {
    loading.value = true
    queryPointDetail({ pointName: props.tagId as string }).then((res) => {
        loading.value = false
        if (res.success) {
            info.value = res.data || {}
        }
    })
}

onMounted(() => {
    getDetail()
})
</script>

<style lang="scss" scoped>
.paramDetail {
    width: 800px;
    padding: 15px;
    padding-top: 0;
    // border-radius: 5px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // background: #074277;
    z-index: 1002;
    // box-shadow: 0 0 10px 2px rgba(0,0,0,0.2);

    background: #00000a !important;
    box-shadow:
        inset 0px 0px 80px 0px #264b64,
        inset 0px 0px 10px 0px rgba(28, 126, 242, 0.5) !important;
    border-radius: 6px !important;
    border: 1px solid #1b7ef2;
    z-index: 9999;

    .title {
        width: 100%;
        height: 54px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        span {
            font-size: 18px;
            font-weight: bold;
        }
    }
}
.mask {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9998;
}

:deep(.el-descriptions) * {
    border-color: #1b7ef2 !important;
}

:deep(.el-descriptions__cell),
:deep(.el-descriptions__body) {
    background: transparent !important;
    color: #fff !important;
    font-size: 14px !important;
}
:deep(.el-descriptions__cell) {
    padding: 12px !important;
}
:deep(.aaa) {
    font-weight: bold !important;
    font-size: 18px !important;
}
.flex-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
