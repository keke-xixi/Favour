<template>
    <div class="app-container">
        <!-- 搜索表单 -->
        <el-form ref="queryFormRef" :model="queryParams" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="菜单名称" prop="menuName">
                <el-input
                    v-model="queryParams.menuName"
                    placeholder="请输入菜单名称"
                    clearable
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="菜单状态" clearable style="width: 240px">
                    <el-option
                        v-for="dict in sys_normal_disable"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :icon="Search" size="mini" @click="handleQuery"> 搜索 </el-button>
                <el-button :icon="Refresh" size="mini" @click="resetQuery"> 重置 </el-button>
            </el-form-item>
        </el-form>

        <!-- 操作按钮组 -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" :icon="Plus" size="mini" @click="handleAdd" v-hasPermi="['system:menu:add']">
                    新增
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="info" plain :icon="Sort" size="mini" @click="toggleExpandAll"> 展开/折叠 </el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
        </el-row>

        <!-- 菜单表格 -->
        <el-table
            v-if="refreshTable"
            v-loading="loading"
            :data="menuList"
            row-key="menuId"
            :default-expand-all="isExpandAll"
            style="border: 1px solid rgb(2, 167, 240) !important; margin: 20px; width: 99%"
            element-loading-background="rgba(122, 122, 122, 0.3)"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160" />
            <el-table-column prop="icon" label="图标" align="center" width="100">
                <template #default="{ row }">
                    <svg-icon :icon-class="row.icon" />
                </template>
            </el-table-column>
            <el-table-column prop="orderNum" label="排序" width="60" />
            <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" />
            <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true" />
            <el-table-column prop="status" label="状态" width="80">
                <template #default="{ row }">
                    {{ sys_normal_disable.find((item: SysOperType) => item.value === row.status)?.label || '-' }}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime">
                <template #default="{ row }">
                    <span>{{ parseTime(row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template #default="{ row }">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(row)"
                        v-hasPermi="['system:menu:edit']"
                    >
                        修改
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-plus"
                        @click="handleAdd(row)"
                        v-hasPermi="['system:menu:add']"
                    >
                        新增
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(row)"
                        v-hasPermi="['system:menu:remove']"
                    >
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加或修改菜单对话框 -->
        <el-dialog v-model="open" :title="title" width="800px" append-to-body>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="上级菜单" prop="parentId">
                            <treeselect
                                v-model="form.parentId"
                                :options="menuOptions"
                                :normalizer="normalizer"
                                :show-count="true"
                                placeholder="选择上级菜单"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="菜单类型" prop="menuType">
                            <el-radio-group v-model="form.menuType" style="width: 100%" size="large">
                                <el-radio label="M">目录</el-radio>
                                <el-radio label="C">菜单</el-radio>
                                <el-radio label="F">按钮</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" v-if="form.menuType != 'F'">
                        <el-form-item label="菜单图标" prop="icon">
                            <el-popover
                                placement="bottom-start"
                                width="460"
                                trigger="click"
                                @show="iconSelectRef?.reset()"
                            >
                                <IconSelect ref="iconSelectRef" @selected="selected" :active-icon="form.icon" />
                                <template #reference>
                                    <el-input v-model="form.icon" placeholder="点击选择图标" readonly>
                                        <template #prefix>
                                            <IconBox :name="form.icon" :size="22" />
                                        </template>
                                    </el-input>
                                </template>
                            </el-popover>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="显示排序" prop="orderNum">
                            <el-input-number
                                v-model="form.orderNum"
                                controls-position="right"
                                :min="0"
                                :max="999999"
                                style="width: 100%"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="菜单名称" prop="menuName">
                            <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.menuType == 'C'">
                        <el-form-item prop="routeName">
                            <template #label>
                                <span>
                                    <el-tooltip
                                        content="默认不填则和路由地址相同：如地址为：`user`，则名称为`User`（注意：为避免名字的冲突，特殊情况下请自定义，保证唯一性）"
                                        placement="top"
                                    >
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                    路由名称
                                </span>
                            </template>
                            <el-input v-model="form.routeName" placeholder="请输入路由名称" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" v-if="form.menuType != 'F'">
                        <el-form-item prop="isFrame">
                            <template #label>
                                <span>
                                    <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                    是否外链
                                </span>
                            </template>
                            <el-radio-group v-model="form.isFrame" style="width: 100%" size="large">
                                <el-radio label="0">是</el-radio>
                                <el-radio label="1">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.menuType != 'F'">
                        <el-form-item prop="path">
                            <template #label>
                                <span>
                                    <el-tooltip
                                        content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                                        placement="top"
                                    >
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                    路由地址
                                </span>
                            </template>
                            <el-input v-model="form.path" placeholder="请输入路由地址" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" v-if="form.menuType == 'C'">
                        <el-form-item prop="component">
                            <template #label>
                                <span>
                                    <el-tooltip
                                        content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
                                        placement="top"
                                    >
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                    组件路径
                                </span>
                            </template>
                            <el-input v-model="form.component" placeholder="请输入组件路径" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.menuType != 'M'">
                        <el-form-item prop="perms">
                            <template #label>
                                <span>
                                    <el-tooltip
                                        content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                                        placement="top"
                                    >
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                    权限字符
                                </span>
                            </template>
                            <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" v-if="form.menuType == 'C'">
                        <el-form-item prop="query">
                            <template #label>
                                <span>
                                    <el-tooltip
                                        content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`'
                                        placement="top"
                                    >
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                    路由参数
                                </span>
                            </template>
                            <el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.menuType == 'C'">
                        <el-form-item prop="isCache">
                            <template #label>
                                <span>
                                    <el-tooltip
                                        content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
                                        placement="top"
                                    >
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                    是否缓存
                                </span>
                            </template>
                            <el-radio-group v-model="form.isCache" style="width: 100%" size="large">
                                <el-radio label="0">缓存</el-radio>
                                <el-radio label="1">不缓存</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" v-if="form.menuType != 'F'">
                        <el-form-item prop="visible">
                            <template #label>
                                <span>
                                    <el-tooltip
                                        content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                                        placement="top"
                                    >
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                    显示状态
                                </span>
                            </template>
                            <el-radio-group v-model="form.visible" style="width: 100%" size="large">
                                <el-radio v-for="dict in sys_show_hide" :key="dict.value" :label="dict.value">
                                    {{ dict.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="status">
                            <template #label>
                                <span>
                                    <el-tooltip
                                        content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                                        placement="top"
                                    >
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                    菜单状态
                                </span>
                            </template>
                            <el-radio-group v-model="form.status" style="width: 100%" size="large">
                                <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">
                                    {{ dict.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox, ElForm } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { Refresh, Search, Plus, Sort } from '@element-plus/icons-vue'
import { listMenu, getMenu, delMenu, addMenu, updateMenu } from '@/services/api/system/menu'
import { queryDict } from '@/services/api/index'
import { parseTime, handleTree } from '@/utils/ruoyi'

import IconSelect from './component/IconSelect.vue'
import IconBox from './component/IconBox.vue'

// 组件名称
defineOptions({
    name: 'Menu',
})

interface SysOperType {
    value: number | string
    label: string
}

interface Form {
    menuId?: number | undefined
    parentId?: number | undefined
    menuName?: string | undefined
    icon?: string | undefined
    menuType?: string | undefined
    orderNum?: number | undefined
    isFrame?: string | undefined
    isCache?: string | undefined
    visible?: string | undefined
    status?: string | undefined
    routeName?: string | undefined
    path?: string | undefined
    component?: string | undefined
    perms?: string | undefined
    query?: string | undefined
}

// 模板引用
const formRef = ref<FormInstance>()
const iconSelectRef = ref<any>()

// 响应式数据
const loading = ref(true)
const showSearch = ref(true)
const menuList = ref<any[]>([])
const menuOptions = ref<any[]>([])
const title = ref('')
const open = ref(false)
const isExpandAll = ref(false)
const refreshTable = ref(true)
const sys_show_hide = ref<SysOperType[]>([])
const sys_normal_disable = ref<SysOperType[]>([])

// 查询参数
const queryParams = reactive({
    menuName: undefined,
    status: undefined,
})

// 表单数据
const form = reactive<Form>({
    menuId: undefined,
    parentId: 0,
    menuName: undefined,
    icon: undefined,
    menuType: 'M',
    orderNum: undefined,
    isFrame: '1',
    isCache: '0',
    visible: '0',
    status: '0',
    routeName: undefined,
    path: undefined,
    component: undefined,
    perms: undefined,
    query: undefined,
})

// 表单校验规则
const rules = {
    menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
    orderNum: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
    path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }],
}

// 初始化查询字典
const initDict = async () => {
    try {
        const sys_show = await queryDict({ dictType: 'sys_show_hide' })
        if (sys_show.code === 200) {
            const data = sys_show.rows || []
            sys_show_hide.value = data.map((item: Dict.Row) => ({
                value: item.dictValue,
                label: item.dictLabel,
                listClass: item.listClass,
                cssClass: item.cssClass,
            }))
        }
        const sys_normal = await queryDict({ dictType: 'sys_normal_disable' })
        if (sys_normal.code === 200) {
            const data = sys_normal.rows || []
            sys_normal_disable.value = data.map((item: Dict.Row) => ({
                value: item.dictValue,
                label: item.dictLabel,
                listClass: item.listClass,
                cssClass: item.cssClass,
            }))
        }
    } catch (error) {
        ElMessage.error('查询操作类型失败')
    }
}

/**
 * 查询菜单列表
 */
const getList = async () => {
    loading.value = true
    try {
        const res: RuoyiResponse<Menu.MenuItem[]> = await listMenu(queryParams)
        menuList.value = handleTree(res.data, 'menuId')
    } finally {
        loading.value = false
    }
}

/**
 * 查询菜单下拉树结构
 */
const getTreeselect = async () => {
    const res = await listMenu()
    const menu = { menuId: 0, menuName: '主类目', children: [] }
    menu.children = handleTree(res.data, 'menuId') as any
    menuOptions.value = [menu]
}

/**
 * 转换菜单数据结构（用于 treeselect）
 */
const normalizer = (node: any) => {
    if (node.children && !node.children.length) {
        delete node.children
    }
    return {
        id: node.menuId,
        label: node.menuName,
        children: node.children,
    }
}

/**
 * 选择图标
 */
const selected = (name: string) => {
    form.icon = name
}

/**
 * 重置表单
 */
const reset = () => {
    Object.assign(form, {
        menuId: undefined,
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        menuType: 'M',
        orderNum: undefined,
        isFrame: '1',
        isCache: '0',
        visible: '0',
        status: '0',
        routeName: undefined,
        path: undefined,
        component: undefined,
        perms: undefined,
        query: undefined,
    })
}

/**
 * 取消按钮
 */
const cancel = () => {
    open.value = false
    reset()
}

/**
 * 搜索按钮操作
 */
const handleQuery = () => {
    getList()
}

/**
 * 重置按钮操作
 */
const resetQuery = () => {
    queryParams.menuName = undefined
    queryParams.status = undefined
    handleQuery()
}

/**
 * 新增按钮操作
 */
const handleAdd = (row?: any) => {
    reset()
    getTreeselect()
    form.parentId = row?.menuId ?? 0
    open.value = true
    title.value = '添加菜单'
}

/**
 * 修改按钮操作
 */
const handleUpdate = async (row: any) => {
    reset()
    await getTreeselect()
    const res = await getMenu(row.menuId)
    Object.assign(form, res.data)
    open.value = true
    title.value = '修改菜单'
}

/**
 * 提交按钮
 */
const submitForm = async () => {
    if (!formRef.value) return
    await formRef.value.validate()
    if (form.menuId) {
        await updateMenu(form as any)
        ElMessage.success('修改成功')
    } else {
        await addMenu(form as any)
        ElMessage.success('新增成功')
    }
    open.value = false
    getList()
}

/**
 * 删除按钮操作
 */
const handleDelete = async (row: any) => {
    await ElMessageBox.confirm(`是否确认删除名称为"${row.menuName}"的数据项？`)
    await delMenu(row.menuId)
    await getList()
    ElMessage.success('删除成功')
}

/**
 * 展开/折叠操作
 */
const toggleExpandAll = () => {
    refreshTable.value = false
    isExpandAll.value = !isExpandAll.value
    nextTick(() => {
        refreshTable.value = true
    })
}

// 生命周期
onMounted(() => {
    getList()
    initDict()
})
</script>

<style scoped lang="scss"></style>
