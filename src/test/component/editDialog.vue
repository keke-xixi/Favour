<template>
	<div class="performance-container">
		<el-dialog v-model="state.isShowDialog" :width="1000" draggable="" :close-on-click-modal="false" :before-close="cancel">
			<template #header>
				<div style="color: #fff">
					<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>
					<span>{{ props.title }}</span>
				</div>
			</template>
			<div class="step-container">
				<el-steps  style="max-width: 600px" :active="active" finish-status="finish">
					<el-step description="基本信息">
					  <template #icon>
						<el-icon :size="26"><Document /></el-icon>
					  </template>
					</el-step>
					<el-step description="供煤数量" >
					  <template #icon>
						<el-icon :size="26"><Histogram /></el-icon>
					  </template>
					</el-step>
					<el-step description="计价标准" >
					  <template #icon>
						<el-icon :size="26"><Grid /></el-icon>
					  </template>
					</el-step>
					<el-step description="其它信息" >
					  <template #icon>
						<el-icon :size="26"><InfoFilled /></el-icon>
					  </template>
					</el-step>
				</el-steps>
			</div>
			<div class="transfer">
                <div class="info"><el-icon :size="14">
					<InfoFilled /></el-icon>&nbsp;
					<span v-show="active === 1">请填写基本信息！</span>
					<span v-show="active === 2">请填写供煤数量信息！</span>
					<span v-show="active === 3">请填写计价标准信息！</span>
					<span v-show="active === 4">请填写其他信息！</span>
				</div>
				<el-form :model="state.ruleForm" ref="ruleFormRef" label-width="auto" :rules="rules">
					<!-- 绩效自评 -->
					<div class="transfer-card" v-show="active === 1">
						<el-tabs type="border-card" style="height: 100%;border: none;border-radius: 5px !important">
							<el-tab-pane label="自评信息">
								<el-row :gutter="35">
									<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
										<el-form-item label="绩效评定类型" prop="type">
											<el-select v-model="state.ruleForm.type" placeholder="类型" clearable disabled>
												<el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
										<el-form-item label="自评等级" prop="gradeSelf">
											<el-select clearable v-model="state.ruleForm.gradeSelf" placeholder="请选择自评等级" disabled>
												<el-option v-for="(item,index) in dl('0065')"  :key="index" :value="item.code" :label="`${item.name||''}`"></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
										<el-form-item label="工作年份" prop="year">
											<el-select v-model="state.ruleForm.year" placeholder="年份" clearable disabled>
												<el-option v-for="item in yearList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" >
										<el-form-item :label="state.ruleForm.type === '季度'? '工作季度' : '工作月份'" prop="typeValue" v-if="state.ruleForm.type === '月度' || state.ruleForm.type === '季度'">
											<el-select v-model="state.ruleForm.typeValue" placeholder="月份" clearable disabled>
												<el-option v-for="item in state.ruleForm.type === '月度'? monthList : quarterList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
										<el-form-item label="自评人" prop="createUserId">
											<el-select v-model="state.ruleForm.createUserId" placeholder="请选择自评人" clearable disabled @change="getTableData">
												<el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
										<el-form-item label="绩效自评" prop="selfEvaluation">
											<el-input v-model="state.ruleForm.selfEvaluation" placeholder="请输入绩效自评" clearable
											:rows="10" type="textarea" maxlength="2000" show-word-limit disabled/>
										</el-form-item>
									</el-col>
								</el-row>
							</el-tab-pane>
							<el-tab-pane label="工作任务" style="padding: 0 !important;">
								 <el-table :data="tableData" style="width: 100%;height: 300px;" :header-cell-style="headerStyle" :cell-style="cellStyle">
									<el-table-column prop="workDate" label="分配日期" sortable width="150" />
										<el-table-column prop="targetName" label="分配指标" />
										<el-table-column prop="performance" label="完成情况" />
										<el-table-column prop="performanceMemory" label="完成情况备注" />
										<el-table-column prop="result" label="评定结果" />
										<el-table-column prop="resultMemory" label="评定备注" />
										<el-table-column prop="auditorName" label="评定人员" />
								 </el-table>
								  <!-- 分页 -->
								<el-pagination
									:current-page="state.tableParams.currentPage"
									:page-size="state.tableParams.pageSize"
									:total="state.total"
									@current-change="handlePageChange"
									layout="total, prev, pager, next, jumper"
									/>
							</el-tab-pane>
						</el-tabs>
					</div>
					<!-- 绩效考核 -->
                   <div class="transfer-card" v-show="active === 2">
						<div class="title">考评信息</div>
						<div class="transfer-list" style="padding: 20px;">
							<el-row :gutter="35" style="width: 100%;height: 100%;">
								<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
									<el-form-item label="考评等级" prop="grade">
										<el-select clearable v-model="state.ruleForm.grade" placeholder="请选择考评等级" :disabled="state.ruleForm.state != 1" >
											<el-option v-for="(item,index) in dl('0065')"  :key="index" :value="item.code" :label="`${item.name||''}`"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
									<el-form-item label="考评人" prop="examineUserId">
										<el-select v-model="state.ruleForm.examineUserId" placeholder="请选择考评人" clearable disabled>
											<el-option v-for="item in userExamList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
									<el-form-item label="绩效考评" prop="examine">
										<el-input v-model="state.ruleForm.examine" placeholder="请输入绩效考评" :disabled="state.ruleForm.state != 1"  
										:rows="7" type="textarea" maxlength="2000" show-word-limit clearable/>
									</el-form-item>
								</el-col>
								<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
									<el-form-item label="考评建议" prop="suggest">
										<el-input v-model="state.ruleForm.suggest" placeholder="请输入考评建议" :disabled="state.ruleForm.state != 1" 
										:rows="7" type="textarea" maxlength="2000" show-word-limit clearable/>
									</el-form-item>
								</el-col>
							</el-row>
						</div>
					</div>
				</el-form>
            </div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="prevStep" :disabled="active === 1">上一步</el-button>
					<el-button @click="nextStep" v-if="active < 2">下一步</el-button>
					<el-button v-if="active === 2" @click="submit">完成</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { ref,onMounted, reactive, nextTick } from "vue";
import { ElMessage } from "element-plus";
import type { FormRules } from "element-plus";
import { useUserInfo } from '/@/stores/userInfo';
import { Document,
		Histogram,
		Grid,
		InfoFilled } from '@element-plus/icons-vue';
import {
	addPerformance, 
	updatePerformance, 
	examinePerformance,
	detailPerformance,
	getUserList,
	getWorkPlanList,
	getUserExamList
 } from "/@/api/CDM/performance";
import { TypeList, YearList, MonthList, QuarterList } from '/@/views/CDM/performance/component/selectList.js';

const userStore = useUserInfo();
const dc = userStore.getDictItemByCode;
const dv = userStore.getDictLabelByVal;
const dl = userStore.getDictDataByCode;

//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: "",
	},
});
//父级传递来的函数，用于回调
const emit = defineEmits(["reloadTable"]);
const ruleFormRef = ref();
const state = reactive<any>({
	isShowDialog: false,
	ruleForm: {
		type:'',
		year:'',
		typeValue:'',
		selfEvaluation:null,
		createUserId:null,
		gradeSelf:'',
		examineUserId:null,
		suggest:null,
		grade:'',
		state: '',
		examine: ''
	},
	tableParams: {
        currentPage: 1,
		pageSize: 10,
		descStr: "desc"
	},
	total: 0,
});

//自行添加其他规则
const rules = ref<FormRules>({
	type: [
		{ required: true, message: '请选择类型', trigger: 'change' },
	],
	year: [
		{ required: true, message: '请选择年份', trigger: 'change' },
	],
	typeValue: [
		{ required: true, message: '请选择月份或季度', trigger: 'change' },
	],
	selfEvaluation: [
		{ required: true, message: '请输入自评信息', trigger: 'blur' },
	],
	createUserId: [
		{ required: true, message: '请选择自评人', trigger: 'change' },
	],
	gradeSelf: [
		{ required: true, message: '请选择自评等级', trigger: 'change' },
	],
	examine: [
		{ required: true, message: '请输入绩效考评', trigger: 'blur' },
	],
	examineUserId : [
		{ required: true, message: '请选择考评人', trigger: 'change' },
	],
	suggest: [
		{ required: true, message: '请输入考评建议', trigger: 'blur' },
	],
	grade: [
		{ required: true, message: '请输入考评等级', trigger: 'blur' },
	],
});

// 年份选择列表
const yearList = ref(YearList);
// 月份选择列表
const monthList = ref(MonthList);
// 季度选择列表
const quarterList = ref(QuarterList);
// 类型选择列表
const typeList = ref(TypeList);

// 获取用户列表
const userList = ref<any[]>([]);
const getUsers = async () => {
	getUserList().then((res) => {
		if(res.status === 200){
			userList.value = res.data.result.map((item: any) => {
				return {
					value: item.id,
					label: item.realName
				}
			});
		}
	});
};

// 获取考核人列表
const userExamList = ref<any[]>([]);
const getUsersExam = async () => {
	getUserExamList().then((res) => {
		if(res.status === 200){
			userExamList.value = res.data.result.map((item: any) => {
				return {
					value: item.id,
					label: item.realName
				}
			});
		}
	});
};

// 表格数据 工作任务
const tableData = ref<any>([]);
const getTableData = async () => {
	let params = {
		descStr: state.tableParams.descStr,
		page: state.tableParams.currentPage,
		pageSize: state.tableParams.pageSize,
		userId: state.ruleForm.createUserId,
		modelFlag: 2,
	}
	getWorkPlanList(params).then((res) => {
		if(res.status === 200){
			tableData.value = res.data.result.items;
			state.total = res.data.result.total;
		}
	});
};

// 表头样式
const headerStyle = reactive({
    backgroundColor: '#eeeeee',
	height: '30px',
	lineHeight: '30px',
	textAlign: 'center',
	border: '1px solid #e9eaec',
})

// 表格样式
const cellStyle = reactive({
    textAlign: 'center',
	height: '30px',
	lineHeight: '30px',
})

// 步骤
const active = ref(1);  

// 下一步
const nextStep = () => {
	if (active.value < 2) {
		active.value += 1;
	}
};

// 上一步
const prevStep = () => {
  if (active.value > 0) {
    active.value -= 1;
  }
};

// 分页切换
const handlePageChange = (currentPage: number) => {
	state.tableParams.currentPage = currentPage;
	getTableData();
}

// 打开弹窗
const openDialog = async (row: any) => {
	// state.ruleForm = JSON.parse(JSON.stringify(row));
	// 改用detail获取最新数据来编辑
	let rowData = JSON.parse(JSON.stringify(row));
	if (rowData.id) {
		let data = (await detailPerformance(rowData.id)).data.result;
		state.ruleForm = data;
		if(data.typeValue){
			state.ruleForm.typeValue = parseInt(data.typeValue);;
		}
	} else {
		state.ruleForm = rowData;
	}
	state.isShowDialog = true;
	nextTick(() => {
		getUsers();
		getTableData();
		getUsersExam();
	});
};

// 关闭弹窗
const closeDialog = () => {
	emit("reloadTable");
	active.value = 1;
	state.isShowDialog = false;
	resetForm();
};

// 取消
const cancel = () => {
	active.value = 1;
	state.isShowDialog = false;
	resetForm();
};

// 重置表单
const resetForm = () => {
	ruleFormRef.value.resetFields();
}

// 完成
const submit = async () => {
	ruleFormRef.value.validate(async (isValid: boolean, fields?: any) => {
		if (isValid) {
			let values = state.ruleForm;
			if (state.ruleForm.id == undefined || state.ruleForm.id == null || state.ruleForm.id == "" || state.ruleForm.id == 0) {
				await addPerformance(values);
			} else {
				// await updatePerformance(values);
				await examinePerformance(values);
			}
			closeDialog();
		} else {
			ElMessage({
				message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
				type: "error",
			});
		}
	});
};

// 页面加载时
onMounted(() => {
});

//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>

<style lang="scss" scoped>
.step-container{
    padding: 10px;
}
.transfer{
    margin: 10px;
    .info{
        height: 40px;
        display: flex;
        padding-left: 10px;
        align-items: center;
        border-radius: 5px;
        background-color: #eedfde;
        border: 1px solid #e4ced1;
        font-size: 12px;
        color: #994d44;
    }
    .transfer-card{
        margin-top: 10px;
        border: 1px solid #dddddd;
        border-radius: 5px;
		height: 400px;
        .title{
            display: flex;
            padding-left: 10px;
            align-items: center;
            font-size: 15px;
            height: 30px;
            background-color: #f5f5f5;
            border-bottom: 1px solid #dddddd;
            border-radius: 5px 5px 0 0;
        }
        .transfer-list{
            padding: 20px;
        }
    }
}
</style>