<!-- @author zhengjie -->
<template>
    <div class="icon-body">
        <el-input
            v-model="name"
            class="icon-search"
            clearable
            placeholder="请输入图标名称"
            @clear="filterIcons"
            @input="filterIcons"
        >
            <template #suffix>
                <i class="el-icon-search el-input__icon" />
            </template>
        </el-input>
        <div class="icon-list">
            <div class="list-container">
                <div
                    v-for="(item, index) in iconList"
                    :key="index"
                    class="icon-item-wrapper"
                    @click="selectedIcon(item.name)"
                >
                    <div :class="['icon-item', { active: activeIcon === item.name }]">
                        <IconBox :name="item.name" :size="22" :custom="customStyle" />
                        <span>{{ item.name }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import IconBox from './IconBox.vue'

import icons from './requireIcons'

// 定义 Props
const props = defineProps<{
    activeIcon?: string
}>()

// 定义 Emits
const emit = defineEmits<{
    (e: 'selected', name: string): void
}>()

interface IconItem {
    name: string
    isImg: boolean
}

// 响应式数据
const name = ref('')
const iconList = ref<IconItem[]>([])

// 样式
const customStyle = reactive({
    borderRadius: '5px',
})

// 过滤图标
const filterIcons = () => {
    iconList.value = icons.map((item) => {
        return {
            name: item,
            isImg: true,
        }
    })
    if (name.value) {
        iconList.value = iconList.value.filter((item) => item.name.includes(name.value))
    }
}

// 选择图标
const selectedIcon = (iconName: string) => {
    emit('selected', iconName)
    document.body.click()
}

// 重置搜索（暴露给父组件）
const reset = () => {
    name.value = ''
    iconList.value = icons.map((item) => {
        return {
            name: item,
            isImg: true,
        }
    })
}

onMounted(() => {
    iconList.value = icons.map((item) => {
        return {
            name: item,
            isImg: true,
        }
    })
})

// 暴露 reset 方法
defineExpose({
    reset,
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
    width: 100%;
    padding: 10px;

    .icon-search {
        position: relative;
        margin-bottom: 5px;
    }

    .icon-list {
        height: 200px;
        overflow: auto;

        .list-container {
            display: flex;
            flex-wrap: wrap;

            .icon-item-wrapper {
                width: calc(100% / 3);
                height: 25px;
                line-height: 25px;
                cursor: pointer;
                display: flex;

                .icon-item {
                    display: flex;
                    max-width: 100%;
                    height: 100%;
                    padding: 0 5px;

                    &:hover {
                        background: #ececec;
                        border-radius: 5px;
                        color: #181818;
                    }

                    .icon {
                        flex-shrink: 0;
                    }

                    span {
                        display: inline-block;
                        vertical-align: -0.15em;
                        fill: currentColor;
                        padding-left: 2px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }

                .icon-item.active {
                    // background: #ececec;
                    // border-radius: 5px;
                    color: #181818;
                }
            }
        }
    }
}

.svg-icon {
    width: 1em;
    height: 1em;
    position: relative;
    fill: currentColor;
    vertical-align: bottom;
}
</style>
