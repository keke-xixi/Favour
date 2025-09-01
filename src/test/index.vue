<template>
	<div class="environment-container">
		<el-card shadow="hover" :body-style="{ padding: '20px 20px 16px 10px', display: 'flex', width: '100%', height: '100%', alignItems: 'start' }">
			<el-form :model="state.queryParams" ref="queryForm" :show-message="false" :inlineMessage="true" label-width="auto" style="flex: 1 1 0%" @submit.prevent="handleQuery" >
				<el-row :gutter="10">
				</el-row>
			</el-form>

			<el-divider style="height: calc(100% - 5px); margin: 0 10px" direction="vertical" />

			<el-row>
				<el-col>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery(true)" v-auth="'environment/page'" :loading="options.loading"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="resetQuery" :loading="options.loading"> 重置 </el-button>
						<el-button icon="ele-ZoomIn" @click="changeAdvanceQueryUI" v-if="!state.showAdvanceQueryUI" style="margin-left: 5px"> 高级查询 </el-button>
						<el-button icon="ele-ZoomOut" @click="changeAdvanceQueryUI" v-if="state.showAdvanceQueryUI" style="margin-left: 5px"> 隐藏 </el-button>
					</el-button-group>
				</el-col>
			</el-row>
		</el-card>

		<el-card class="full-table" shadow="hover" style="margin-top: 5px">
			<vxe-grid ref="xGrid" class="xGrid-style" v-bind="options" v-on="gridEvents">
				<template #toolbar_buttons>
					<el-button type="primary" icon="ele-Plus" @click="handleAdd" v-auth="'environment/add'"> 新增 </el-button>
				</template>
				<template #toolbar_tools> </template>
				<template #empty>
					<el-empty :image-size="200" />
				</template>
				<template #row_record="{ row }">
					<ModifyRecord :data="row" />
				</template>
				<template #row_buttons="{ row }">
					<el-tooltip content="编辑" placement="top">
						<el-button icon="ele-Edit" size="small" text type="primary" @click="handleEdit(row)" v-auth="'environment/update'" />
					</el-tooltip>
					<el-tooltip content="删除" placement="top">
						<el-button icon="ele-Delete" size="small" text type="danger" @click="handleDelete(row)" v-auth="'environment/delete'" />
					</el-tooltip>
				</template>
			</vxe-grid>
		</el-card>
		<EditDialog ref="editDialogRef" :title="state.title" @reloadTable="handleQuery" />
	</div>
</template>

<script lang="ts" setup name="environment">
import { onMounted, reactive, ref } from 'vue';
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import { useUserInfo } from '/@/stores/userInfo';

import { VxeGridInstance, VxeGridListeners, VxeGridPropTypes } from 'vxe-table';
import { useVxeTable } from '/@/hooks/useVxeTableOptionsHook';
import { Local } from '/@/utils/storage';

import { formatDate } from '/@/utils/formatTime';

// 子窗口
import EditDialog from './component/editDialog.vue';
import ModifyRecord from '/@/components/table/modifyRecord.vue';

import { pageEnvironment, deleteEnvironment } from '/@/api/EnvironmentDetection/environment';


// 子窗口对象
const xGrid = ref<VxeGridInstance>();
const editDialogRef = ref<InstanceType<typeof EditDialog>>();
const userStore = useUserInfo();

// 变量
const state = reactive({
	showAdvanceQueryUI: false,
	queryParams: {
		searchKey: undefined,
	},
	localPageParam: {
		pageSize: 50 as number,
		defaultSort: { field: 'createTime', order: 'asc', descStr: 'desc' },
	},
	visible: false,
	title: '',
});

// 本地存储参数
const localPageParamKey = 'localPageParam:environment';

// 改变高级查询的控件显示状态
const changeAdvanceQueryUI = () => {
	state.showAdvanceQueryUI = !state.showAdvanceQueryUI;
};

// 校验表格字段权限
const checkTableColumnVisible = (tableColumnName: any) => {
	return !userStore.userTableList.includes(tableColumnName);
};

// 表格参数配置
const options = useVxeTable(
	{
		id: 'Environment',
		name: '化验室环境',
		columns: [
			{ type: 'seq', title: '序号', width: 60, fixed: 'left' },
			{visible: checkTableColumnVisible('environment:contractCode'),  field: 'contractCode', title: '合同编号', minWidth: 100, showOverflow: 'tooltip', sortable: false},
			{visible: checkTableColumnVisible('environment:contractIntentionCode'),  field: 'contractIntentionCode', title: '纸质合同编号', minWidth: 100, showOverflow: 'tooltip', sortable: false},
			{visible: checkTableColumnVisible('environment:collectValue'),  field: 'collectValue', title: '供货单位', minWidth: 100, showOverflow: 'tooltip', sortable: false},
			{visible: checkTableColumnVisible('environment:deviceAddress'),  field: 'deviceAddress', title: '结算单位', minWidth: 100, showOverflow: 'tooltip', sortable: false},
			{visible: checkTableColumnVisible('environment:interval'),  field: 'interval', title: '供煤起始时间', minWidth: 100, showOverflow: 'tooltip', sortable: false},
			{visible: checkTableColumnVisible('environment:minValidValue'),  field: 'minValidValue', title: '供煤截止时间', minWidth: 100, showOverflow: 'tooltip', sortable: false},
			{visible: checkTableColumnVisible('environment:maxValidValue'),  field: 'maxValidValue', title: '运输方式', minWidth: 100, showOverflow: 'tooltip', sortable: false},
			{ title: '修改记录', width: 100, showOverflow: 'tooltip', slots: { default: 'row_record' } },
			{ title: '操作', fixed: 'right', width: 180, showOverflow: true, slots: { default: 'row_buttons' } },
		],
	},
	// vxeGrid配置参数(此处可覆写任何参数)，参考vxe-table官方文档
	{
		// 代理配置
		proxyConfig: { autoLoad: true, ajax: { query: ({ page, sort }) => handleQueryApi(page, sort) } },
		// 排序配置
		// sortConfig: { defaultSort: Local.get(localPageParamKey)?.defaultSort || state.localPageParam.defaultSort },
		sortConfig: {  defaultSort: { field: null, order: null } as any },
		// 分页配置
		pagerConfig: { pageSize: Local.get(localPageParamKey)?.pageSize || state.localPageParam.pageSize },
		// 工具栏配置
		toolbarConfig: { export: false },
		// 行设置
		// rowConfig: { height: 80 },
		customConfig: {
			// 不可见
			visibleMethod({ column }) {
			  return checkTableColumnVisible(`environment:${column.field}`);
			},
		},
	}
);

// 页面初始化
onMounted(() => {});

// 查询api
const handleQueryApi = async (page: VxeGridPropTypes.ProxyAjaxQueryPageParams, sort: VxeGridPropTypes.ProxyAjaxQuerySortCheckedParams) => {
	const params = Object.assign(state.queryParams, { page: page.currentPage, pageSize: page.pageSize, field: sort.field, order: sort.order, descStr: 'desc' }) as EnvironmentInput;
	return pageEnvironment(params);
};

// 查询操作
const handleQuery = async (reset = false) => {
	options.loading = true;
	reset ? await xGrid.value?.commitProxy('reload') : await xGrid.value?.commitProxy('query');
	options.loading = false;
};

// 重置操作
const resetQuery = async () => {
	state.queryParams.searchKey = undefined,
	await xGrid.value?.commitProxy('reload');
};

// 打开新增页面
const handleAdd = () => {
	state.title = '新增数据';
	let data = {
		collectValue:null,
	};
	editDialogRef.value?.openDialog(data);
};

// 打开编辑页面
const handleEdit = (row: any) => {
	state.title = '编辑化验室环境';
	editDialogRef.value?.openDialog(row);
};


// 删除
const handleDelete = (row: any) => {
	ElMessageBox.confirm(`确定删除化验室环境：【${row.title}】?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await deleteEnvironment(row);
		await handleQuery();
		ElMessage.success('删除成功');
	})
	.catch(() => {});
};

// 表格事件
const gridEvents: VxeGridListeners = {
	// 只对 pager-config 配置时有效，分页发生改变时会触发该事件
	async pageChange({ pageSize }) {
		state.localPageParam.pageSize = pageSize;
		Local.set(localPageParamKey, state.localPageParam);
	},
	// 当排序条件发生变化时会触发该事件
	async sortChange({ field, order }) {
		state.localPageParam.defaultSort = { field: field, order: order!, descStr: 'desc' };
		Local.set(localPageParamKey, state.localPageParam);
	},
};

</script>

<style lang="scss" scoped>
:deep(.el-input),
:deep(.el-select),
:deep(.el-input-number) {
	width: 100%;
}
:deep(.el-slider .el-input-number){
	width: auto;
}
</style>
