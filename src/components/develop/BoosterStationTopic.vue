<template>
    <el-dialog v-model="dialogVisible" title="添加升压站Topic" width="80%">
        <div class="dialog-content">
            <!-- 添加导入区域 -->
            <div class="import-section">
                <div class="title">Excel批量导入</div>
                <div class="import-area">
                    <el-upload
                        class="upload-demo"
                        drag
                        :before-upload="handleBeforeUpload"
                        :show-file-list="false"
                        accept=".xlsx,.xls,.csv"
                        :auto-upload="false"
                        :on-change="handleFileChange"
                    >
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">将Excel文件拖到此处，或<em>点击上传</em></div>
                        <template #tip>
                            <div class="el-upload__tip">支持 .xlsx, .xls, .csv 格式</div>
                        </template>
                    </el-upload>

                    <!-- 数据预览 -->
                    <div v-if="importedData.length > 0" class="data-preview">
                        <div class="preview-header">
                            <span>已导入 {{ importedData.length }} 条数据</span>
                            <el-button type="primary" link @click="clearImportedData">清空</el-button>
                        </div>
                        <el-table :data="importedData.slice(0, 5)" border stripe height="300">
                            <el-table-column
                                v-for="col in previewColumns"
                                :key="col"
                                :prop="col"
                                :label="col"
                                show-overflow-tooltip
                            />
                        </el-table>
                        <div v-if="importedData.length > 5" class="preview-tip">
                            仅显示前5条数据，共 {{ importedData.length }} 条
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <el-button type="primary" @click="createAllTopic">一键生成</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as XLSX from 'xlsx'
import { useAppStore } from '@/store/modules/app'
import { addTopic, importPoint } from '@/services/api/index'
import { createStation, getBoard, extractAllTagIds } from '@/utils/stationData'
import { StationTypeEnum, TopicMaxNum } from '@/utils/constant'
import chunk from 'lodash/chunk'

const store = useAppStore()
const emit = defineEmits(['refresh'])

// 参数
const dialogVisible = ref<boolean>(false)
const stationList = ref<StationsObject[]>(store.stations)

// Excel导入相关数据
const importedData = ref<any[]>([]) // 存储导入的原始数据
const previewColumns = computed(() => {
    if (importedData.value.length === 0) return []
    return Object.keys(importedData.value[0])
})

// 文件上传前的验证
const handleBeforeUpload = (file: File) => {
    const isValidType = ['.xlsx', '.xls', '.csv'].some((ext) => file.name.toLowerCase().endsWith(ext))
    if (!isValidType) {
        ElMessage.error('只能上传 Excel 或 CSV 文件')
        return false
    }
    return true
}

// 处理文件选择
const handleFileChange = async (file: any) => {
    const rawFile = file.raw
    if (!rawFile) return

    try {
        await parseExcelToJson(rawFile)
    } catch (error) {
        console.error('解析失败:', error)
        ElMessage.error('文件解析失败，请检查文件格式')
    }
}

// 解析Excel为JSON
const parseExcelToJson = (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer)
                const workbook = XLSX.read(data, { type: 'array' })
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
                    defval: '', // 空单元格默认值
                    blankrows: false, // 跳过空行
                })

                // 转换数据格式（根据你的需求自定义）
                const transformedData = transformExcelData(jsonData)
                importedData.value = transformedData

                ElMessage.success(`成功导入 ${transformedData.length} 条数据`)
                resolve(transformedData)
            } catch (error) {
                reject(error)
            }
        }

        reader.onerror = reject
        reader.readAsArrayBuffer(file)
    })
}

// 自定义数据转换函数 - 根据你的Excel列名和业务需求修改
const transformExcelData = (data: any[]): any[] => {
    console.log('原始数据:', data)
    // 方式1: 直接返回原始数据
    // return data

    // 方式2: 根据列名映射到需要的字段
    return data.map((row, index) => {
        // 根据你的Excel实际列名修改映射关系
        return {
            // 示例映射，请根据实际情况修改
            stationCode: row['场站编码'] || row['stationCode'] || '',
            stationName: row['场站名称'] || row['stationName'] || '',
            topicName: row['Topic名称'] || row['topicName'] || '',
            topicDesc: row['Topic描述'] || row['topicDesc'] || '',
            // 添加其他需要的字段
            // ...row // 如果需要保留所有字段
        }
    })
}

// 清空导入的数据
const clearImportedData = () => {
    importedData.value = []
    ElMessage.info('已清空导入数据')
}

// 使用导入的数据创建Topic
const createTopicsFromImport = async () => {
    if (importedData.value.length === 0) {
        ElMessage.warning('请先导入Excel数据')
        return false
    }

    let successCount = 0
    let failCount = 0

    for (const item of importedData.value) {
        try {
            // 根据导入的数据创建Topic
            const params = {
                topicName: item.topicName || `v_import_${Date.now()}_${successCount}`,
                topicDesc: item.topicDesc || '通过Excel导入',
                stationName: item.stationName || 'default_station',
                stationDesc: item.stationDesc || '',
                createBy: store.userInfo?.username || '',
                updateBy: store.userInfo?.username || '',
                createTime: new Date().toISOString(),
                updateTime: new Date().toISOString(),
            }

            const res = await addTopic(params)

            // 如果有点位信息，导入点位
            if (item.pointList && Array.isArray(item.pointList)) {
                await importPoint({
                    topicId: res.data.id,
                    pointList: item.pointList,
                })
            }

            successCount++
        } catch (error) {
            console.error('创建失败:', item, error)
            failCount++
        }
    }

    if (failCount > 0) {
        ElMessage.warning(`成功创建 ${successCount} 个，失败 ${failCount} 个`)
    } else {
        ElMessage.success(`成功创建 ${successCount} 个Topic`)
    }

    return successCount > 0
}

// 修改原有的 createAllTopic 函数，集成导入功能
const createAllTopic = async () => {
    try {
        await ElMessageBox.confirm(
            importedData.value.length > 0
                ? `检测到已导入 ${importedData.value.length} 条数据，确认使用这些数据创建Topic吗？`
                : '确认一键生成所有Topic吗？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )

        // 如果导入了数据，优先使用导入的数据创建
        if (importedData.value.length > 0) {
            const result = await createTopicsFromImport()
            if (result) {
                emit('refresh')
                dialogVisible.value = false
                clearImportedData()
            }
        } else {
            // 原有的创建逻辑
            const promises = createList.value.map(async (item: CreateItem) => {
                // ... 保留你原有的创建逻辑
                if (item.stationType === StationTypeEnum.GF) {
                    const list = stationList.value
                        .filter((e) => e.stationType === StationTypeEnum.GF)
                        .map((e) => e.stationCode)
                    const methodsPromises = list.map(async (code: string) => {
                        formData.stationCode = code
                        return item.method({ ...item }).catch(() => false)
                    })
                    return Promise.all(methodsPromises)
                }
                if (item.stationType === StationTypeEnum.FD) {
                    const list = stationList.value
                        .filter((e) => e.stationType === StationTypeEnum.FD)
                        .map((e) => e.stationCode)
                    const methodsPromises = list.map(async (code: string) => {
                        formData.stationCode = code
                        return item.method({ ...item }).catch(() => false)
                    })
                    return Promise.all(methodsPromises)
                }
                if (item.needStation) {
                    const list = stationList.value.map((e) => e.stationCode)
                    const methodsPromises = list.map(async (code: string) => {
                        formData.stationCode = code
                        return item.method({ ...item }).catch(() => false)
                    })
                    return Promise.all(methodsPromises)
                }
                return await item.method(item)
            })
            await Promise.all(promises)
            emit('refresh')
            ElMessage.success('操作成功')
        }
    } catch (error) {
        console.log(error)
    }
}

// ... 保留你原有的所有创建函数 (dashboardAdd, fdGfAdd, createNbq 等)
// 为了简洁，这里省略，请保留原有代码

// 生成列表 - 保留原有
const createList = ref<CreateItem[]>([
    // ... 保留原有的所有配置项
])

const openDialog = () => {
    dialogVisible.value = true
    // 打开弹窗时清空之前导入的数据
    clearImportedData()
}

const closeDialog = () => {
    dialogVisible.value = false
}

defineExpose({
    openDialog,
    closeDialog,
})
</script>

<style scoped lang="scss">
.dialog-content {
    padding: 20px;
    min-height: 600px;

    .import-section {
        margin-bottom: 30px;

        .title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #409eff;
            padding-left: 10px;
            border-left: 4px solid #409eff;
        }

        .import-area {
            padding: 20px;
            border: 1px solid #dcdfe6;
            border-radius: 8px;
            background: #fafafa;
        }

        .data-preview {
            margin-top: 20px;

            .preview-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                font-size: 14px;
                color: #606266;
            }

            .preview-tip {
                margin-top: 10px;
                font-size: 12px;
                color: #909399;
                text-align: center;
            }
        }
    }

    .container {
        padding-top: 20px;

        .btn-group {
            display: flex;
            flex-wrap: wrap;
            margin: 20px;
            gap: 20px;
            padding: 20px;
            border: 1px solid #409eff;
        }

        .title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #409eff;
        }
    }
}
</style>
