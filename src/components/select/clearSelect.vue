<!-- 
   组件：
   功能：当下拉框的不在下拉列表中时，显示空，但是实际值不会丢失 （一个显示效果），其它情况和正常功能一致
   用途：禁用按钮，禁用字典时候，打开弹窗下拉框，任然显示ID,但是实际下拉列表中没有这个ID了,应该优化成显示空
-->
<template>
    <el-select v-model="selectValue" :placeholder="placeholder" clearable filterable @change="changeValue">
        <el-option v-for="item in list" :key="item[params.value]" :label="item[params.label]" :value="item[params.value]">
            <slot></slot>
        </el-option>
    </el-select>
</template>

<script lang="ts" setup name="ClearSelect">

import {ref, watch,nextTick } from 'vue';

const emit = defineEmits(['update:customValue']);

const props = defineProps({
    customValue: {
        type: [String, Number, null],
        required: true
    },
    list: {
        type: Array as any,
        default: []
    },
    placeholder: {
        type: String,
        default: '请选择'
    },
    params: {
        type: Object,
        default: {
            label: 'label',
            value: 'value'
        }
    }
})

// 下拉框值
const selectValue = ref(props.customValue);

// 下拉框列表
const selectList = ref(props.list);

// 监听下拉框值变化
watch([() => props.customValue,() => props.list], (newVal, oldVal) => {
    let [val, list] = newVal;
    selectList.value = list;
    if (val === null || val === undefined || val === '') {
        selectValue.value = val;
         return;
    }
    let value = selectList.value?.some((item: any) => item[props.params.value] === val) || false;  // 下拉列表中没有select框的值，则清空
    if (!value) {
        selectValue.value = "";
    }else {
        selectValue.value = val;
    }
},{immediate: true,deep: true})


// 下拉框值变化
const changeValue = (val: any) => {
   emit('update:customValue', val);
}

</script>

<style scoped lang="scss">

</style>
