<!-- 
   下拉搜索 + 查询更多 + 多选 + 输入值进入下拉条件
-->
<template>
    <div class="tableSelector">
        <el-select
            ref="selectRef"
            v-model="selectValue"
            multiple
            filterable
            :placeholder="params.placeholder"
            :loading="loading"
            @keydown.space.prevent
            @change="selectChange"
            @input="selectInput"
        >
            <el-option
                v-for="item in selectOpts"
                :key="item[params.value]"
                :label="item[params.label]"
                :value="item[params.value]"
            />
            <template #loading>
                <el-button link type="text" loading></el-button>
                <div>加载中</div>
            </template>
            <template #footer>
                <div style="display: flex; justify-content: center; ">
                    <el-link type="primary" class="select-footer" @click="handleMore">
                        <span>查看更多</span>
                        <el-icon :size="14" style="margin-left: 4px;"><Search /></el-icon>
                    </el-link>
                </div>
            </template>
        </el-select>

        <!-- 弹窗 -->
        <!-- <tabsTable ref="tabsTableRef" @updateSelect="updateSelect"/> -->
    </div>
</template>

<script setup lang="ts" name="tableSelector">
import { onMounted, ref, nextTick, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';
import request from '/@/utils/request';

// 弹窗组件
// import tabsTable from './componet/tabsTable.vue';

const emit = defineEmits(['update:modelValue']);

// 组件接受参数
const props = defineProps({
    modelValue:{
        type: null,
        required: true,
    },
    params: {  // 下拉框其它参数，一般情况用默认，不传
        type: null,  
        default: {
            label: 'testNo',  // 显示字段
            value: 'testNo',   // 值字段
            placeholder: '化验编码',
        }
    },
    config: {  // 配置参数，一般情况用默认，不传
       type: null,
       default: {
            url: '/api/qualityResult/summaryDataPage',
            method: 'post',
            data: {
                page: 1,
                pageSize: 10,
            }
       }
    }
})

// 组件实例
const tabsTableRef = ref<any>(null);
const selectRef = ref<any>(null);

// 下拉框加载
const loading = ref(false);

// 下拉框值
const selectValue = ref<any>([]);

// 下拉框选项
const selectOpts = ref<any>([]);

// 下拉框选中值
const selectChange = (val: any) => {
    if(val.includes(inputValue.value)){
        const inputElement = selectRef.value?.$el?.querySelector('input');
        inputValue.value = "";
        inputElement.value = '';
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
    emit('update:modelValue', val);
}

// 下拉框输入值
const inputValue = ref<any>('');  

// 下拉框输入
const selectInput = () => {
    const inputElement = selectRef.value?.$el?.querySelector('input');
    let value = inputElement?.value;
    if(value.trim() === "") { // 全是空格
        let row = selectOpts.value.find((item:any) => item[props.params.value] === inputValue.value);
        if(row) {
            selectOpts.value = selectOpts.value.filter((item:any) => item[props.params.value] !== inputValue.value);
        }
        inputValue.value = '';
        return;
    }
    if(inputValue.value === '') { // 新增
        inputValue.value = value;
        selectOpts.value.unshift({
            [props.params.label]: value,
            [props.params.value]: value
        });
    }else {  // 修改
        let row = selectOpts.value.find((item:any) => item[props.params.value] === inputValue.value);
        if(row) {
            row[props.params.label] = value;
            row[props.params.value] = value;
            inputValue.value = value;
        }
    }
    
}


// 从弹窗选择数据
const updateSelect = (val: any) => {
    selectOpts.value = mergeArrays(selectOpts.value, val, props.params.value);
    let filterValue = val.map((item:any) => item[props.params.value]);
    selectValue.value = filterValue;
    emit('update:modelValue', filterValue);
}

// 合并两个数组、根据数组对象中的key值去重
const mergeArrays = (a:any, b:any, key = 'id') => {
  const existingKeys = new Set(a.map((item:any) => item[key]));
  const newItems = b.filter((item:any) => !existingKeys.has(item[key]));
  return [...a, ...newItems];
};

// 查询
const query = () => {
    loading.value = true;
    let params = props.config;
    request(params).then((res: any) => {
       let result = res.data.result?.items || [];
       result.forEach((element:any) => {
          if(selectOpts.value.some((i:any) => i[props.params.value] === element[props.params.value])) {
             return;
          }
          selectOpts.value.push(element);
       });
    }).finally(() => {
        loading.value = false;
    })
}

// 查询更多
const handleMore = () => {
    tabsTableRef.value?.openDialog();
}

// 监听 v-model 变化
watch(() => props.modelValue, (newVal, oldVal) => {
    selectValue.value = newVal;
})

// 初始化
onMounted(() => {
    query();
})

</script>

<style lang="scss" scoped>
.tableSelector {
    height: 100%;
    width: 100%;
}
.select-footer {
    color: #409eff;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    text-align: center;
}
</style>