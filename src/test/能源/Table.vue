<script lang="ts" setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { Plus, Delete, Edit, Search, Refresh } from '@element-plus/icons-vue';
import { queryStationList } from '@/api/depot'

const locale: any = zhCn

const loading: any = ref(false)

const props = withDefaults(defineProps<{ series: any, yAxis: any, times: any }>(), {
    series: [],
    yAxis: [],
    times: []
});
const {series, yAxis, times} = toRefs(props);
const emits = defineEmits(['delPoint']);

const size: any = ref(5)
const page: any = ref(1)
const total: any = ref(0)
const dataList: Ref<any[]> = ref([])
const colors: Ref<any[]> = ref([
    "#5470c6",
    "#91cc75",
    "#fac858",
    "#ee6666",
    "#73c0de",
    "#3ba272",
    "#fc8452",
    "#9a60b4",
    "#ea7ccc"
])
const selections: any = ref([])

const getAverage = (row: any) => {
    let num: any = 0
    row.data.map((e: any) => {
        num += Number(e)
        return false
    })
    return (num/row.data.length).toFixed(3)
}

const getTotal = (row: any) => {
    // let num: any = 0
    // row.data.map((e: any) => {
    //     num += Number(e)
    //     return false
    // })
    // return num.toFixed(3)
    return Math.max(...row.data.map((e: any) => Number(e))) - Math.min(...row.data.map((e: any) => Number(e)))
}

const getList = () => {
    const arr = series.value;
    arr.map((e: any, i: any) => {
        e.color = colors.value[i%9]
        return true
    })
    const result = [];
    for (let i = 0; i < arr.length; i += size.value) {
        result.push(arr.slice(i, i + size.value));
    }
    dataList.value = result
    total.value = arr.length
    getStationName()
}

// 获取场站名称
const getStationName = () => {
    queryStationList().then((res: any) => {
        const data = res.data.map((e: any) => {
            return {
                label: e.name,
                value: e.stationCode
            }
        })
        dataList.value.forEach((e: any) => {
            e.forEach((item: any) => {
                if(item.tagId) {
                    const tagId = item.tagId.split('.')[0]
                    console.log('-----------queryStationList-----------', tagId)
                    const row = data.find((i: any) => tagId.includes(i.value))
                    row && (item.stationName = row.label)
                }
            })
        })
        console.log('-----------queryStationList-----------', dataList.value, data)
       
    }).catch(err => {
        console.log('-----------queryStationList-----------', err)
    })
}

const confirmEvent = (row: any) => {
    emits('delPoint', row)
}

const selectionChange = (selection: any) => {
  selections.value = selection
}

const delMore = () => {
    selections.value.map((_: any) => {
        emits('delPoint', _)
        return false
    })
}

watch(
    () => series.value,
    (nVal: any) => {
        nextTick(() => {
            getList()
        })
    },
    { immediate: true, deep: true },
);

onMounted(() => {
    
})
</script>

<template>
    <div class="table">
        <el-config-provider :locale="locale">
            <el-button type="danger" :disable="!selections.length" :icon="Delete" @click="delMore">批量删除</el-button>
            <el-table
                v-loading="loading"
                :data="dataList[page - 1]"
                :cell-style="{borderColor:'rgb(2,167,240)'}"
                style="background: none !important;border-color: rgb(2,167,240) !important;box-sizing: border-box;max-height: 700px;"
                element-loading-background="rgba(122, 122, 122, 0.3)"
                @selection-change="selectionChange"
            >
                <!-- <el-table-column label="#" width="50">
                    <template #default="{ row }">
                        <span class="color" :style="{background: row.color}"></span>
                    </template>
                </el-table-column> -->
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column show-overflow-tooltip label="场站名称" prop="stationName" width="300"/>
                <el-table-column show-overflow-tooltip label="测点描述" prop="name" width="200" />
                <el-table-column show-overflow-tooltip label="单位" prop="unit" />
                <el-table-column show-overflow-tooltip label="量程上限" prop="highlimit" />
                <el-table-column show-overflow-tooltip label="量程下限" prop="lowlimit" />
                <!-- <el-table-column show-overflow-tooltip label="实时值" prop="alarmName" />
                <el-table-column show-overflow-tooltip label="数据时间" prop="alarmName" /> -->
                <el-table-column show-overflow-tooltip label="最大值">
                    <template #default="{ row }">
                        {{ Math.max(...row.data.map((e: any) => Number(e))) }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="最小值">
                    <template #default="{ row }">
                        {{ Math.min(...row.data.map((e: any) => Number(e))) }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="平均值">
                    <template #default="{ row }">
                        {{ getAverage(row) }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="累计值">
                    <template #default="{ row }">
                        {{ getTotal(row)?.toFixed(3) || '' }}
                    </template>
                </el-table-column>
                
                <el-table-column label="操作" prop="name" width="100px" align="center">
                    <template #default="{ row }">
                        <el-popconfirm :title="`确认删除该测点吗？`" placement="top" @confirm="confirmEvent(row)">
                        <template #reference>
                            <el-button type="danger" size="small" @click.stop>删除</el-button>
                        </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page">
                <el-pagination
                    v-model:page-size="size"
                    v-model:current-page="page"
                    :locale="zhCn"
                    :page-sizes="[5, 10, 20, 30, 50, 100]"
                    background
                    layout="total, prev, pager, next, sizes, jumper"
                    :total="total"
                    @size-change="getList"
                />
            </div>
        </el-config-provider>
    </div>
</template>

<style lang="scss" scoped>
.page {
    display: flex;
    justify-content: end;
    margin-top: 20px;
}
:deep(.el-table__body-wrapper) {
    height: calc(100% - 60px) !important;
    overflow-y: scroll;
}
:deep(.el-scrollbar__view) {
    height: 100%;
}
:deep(.color) {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 2px;
}
:deep(.cell) {
    display: flex;
    align-items: center;
}
</style>