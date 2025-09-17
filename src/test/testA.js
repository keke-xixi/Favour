import request from '/@/utils/request';
enum Api {
  AddReportSetting = '/api/reportSetting/add',
  DeleteReportSetting = '/api/reportSetting/delete',
  UpdateReportSetting = '/api/reportSetting/update',
  PageReportSetting = '/api/reportSetting/page',
  DetailReportSetting = '/api/reportSetting/detail',
  GetSysPrintTemplateIdDropdown = '/api/reportSetting/sysPrintTemplateIdDropdown',
  ReportData = '/api/reportPreview/reportData',
  GetReportSettingByType = '/api/reportSetting/getReportSettingByType',
  GetPrintingRecord = '/api/reportPrintingRecord/createPrintingRecord',
  // 新报表数据接口
  ReportDataNew = '/api/reportPreview/reportDataNew',
  GetReportSettingByName = '/api/reportSetting/getReportSettingByName',
  // 汽车入厂煤通用报表接口
  GetReportCarCoal_5 = '/api/reports/flowing/report_5',  // 入厂煤检斤明细表
  GetReportCarCoal_8 = '/api/reports/flowing/report_8',  // 入厂煤检斤汇总表
  GetReportCarCoal_6 = '/api/reports/flowing/report_6',  // 入厂煤检斤日、月、年报表
  GetReportCarCoal_1 = '/api/reports/flowing/report_1',  // 入厂煤质检验斤日、月报表
  GetReportCarCoal_3 = '/api/reports/flowing/report_3',  // 入厂煤质分析报表
  GetReportCarCoal_4 = '/api/reports/flowing/report_4',  // 入厂煤质检验报表
  GetReportCarCoal_10 = '/api/reports/flowing/report_10',  // 入厂物资过衡明细表
  GetReportCarCoal_11 = '/api/reports/flowing/report_11',  // 其它物资检斤明细表
  GetReportCarCoal_12 = '/api/reports/flowing/report_12',  // 其它物资检斤日、月、年报表
  GetReportCarCoal_14 = '/api/reports/flowing/report_14',  // 其它物资磅单汇总表
  GetReportCarCoal_16 = '/api/reports/flowing/report_16',  // 出厂物资过衡明细表
}

// 增加报表设置
export const addReportSetting = (params?: any) =>
	request({
		url: Api.AddReportSetting,
		method: 'post',
		data: params,
	});

// 删除报表设置
export const deleteReportSetting = (params?: any) => 
	request({
		url: Api.DeleteReportSetting,
		method: 'post',
		data: params,
	});

// 编辑报表设置
export const updateReportSetting = (params?: any) => 
	request({
		url: Api.UpdateReportSetting,
		method: 'post',
		data: params,
	});

// 分页查询报表设置
export const pageReportSetting = (params?: any) => 
	request({
		url: Api.PageReportSetting,
		method: 'post',
		data: params,
	});

// 详情报表设置
export const detailReportSetting = (id: any) => 
	request({
		url: Api.DetailReportSetting,
		method: 'get',
		data: { id },
	});

export const getSysPrintTemplateIdDropdown = () =>
	request({
		url: Api.GetSysPrintTemplateIdDropdown,
		method: 'get'
	});

// 获取报表数据
export const reportData = (params?: any) =>
	request({
		url: Api.ReportData,
		method: 'post',
		data: params
	});

// 获取新报表数据
export const reportDataNew = (params?: any) =>
	request({
		url: Api.ReportDataNew,
		method: 'post',
		data: params
	});

// 根据报表类型获取报表名称数据
export const getReportSettingByType = (params?: any) =>
	request({
		url: Api.GetReportSettingByType,
		method: 'get',
		params
	});

// 获取打印编号
export const getPrintingRecord = (params?: any) =>
	request({
		url: Api.GetPrintingRecord,
		method: 'post',
		data: params
	});

// 根据名称获取报表Json
export const getReportSettingByName = (params?: any) =>
	request({
		url: Api.GetReportSettingByName,
		method: 'get',
	    params
	});

// 汽车入厂煤报表接口
// 入厂煤检斤明细表
export const getReportCarCoal_5 = (params?: any) =>
	request({
		url: Api.GetReportCarCoal_5,
		method: 'post',
	    data: params
	});

// 入厂煤检斤汇总表
export const getReportCarCoal_8 = (params?: any) =>
	request({
		url: Api.GetReportCarCoal_8,
		method: 'post',
	    data: params
	});

// 入厂煤检斤日、月、年报表
export const getReportCarCoal_6 = (params?: any, reportType = '') =>
	request({
		url: Api.GetReportCarCoal_6 + `?reportType=${reportType}`,
		method: 'post',
	    data: params
	});

// 入厂煤质检验斤日、月报表
export const getReportCarCoal_1 = (params?: any, reportType = '') =>
	request({
		url: Api.GetReportCarCoal_1 + `?reportType=${reportType}`,
		method: 'post',
	    data: params
	});

// 入厂煤质分析报表
export const getReportCarCoal_3 = (params?: any) =>
	request({
		url: Api.GetReportCarCoal_3,
		method: 'post',
	    data: params
	});

// 入厂煤质检验报表
export const getReportCarCoal_4 = (params?: any) =>
	request({
		url: Api.GetReportCarCoal_4,
		method: 'post',
	    data: params
	});

// 入厂物资过衡明细表
export const getReportCarCoal_10 = (params?: any) =>
	request({
		url: Api. GetReportCarCoal_10,
		method: 'post',
	    data: params
	});

// 其它物资检斤明细表
export const getReportCarCoal_11 = (params?: any) =>
	request({
		url: Api.GetReportCarCoal_11,
		method: 'post',
	    data: params
	});

// 其它物资检斤日、月、年报表
export const getReportCarCoal_12 = (params?: any) =>
	request({
		url: Api.GetReportCarCoal_12,
		method: 'post',
	    data: params
	});

// 其它物资磅单汇总表
export const getReportCarCoal_14 = (params?: any) =>
	request({
		url: Api.GetReportCarCoal_14,
		method: 'post',
	    data: params
	});
	
// 出厂物资过衡明细表
export const getReportCarCoal_16 = (params?: any) =>
	request({
		url: Api.GetReportCarCoal_16,
		method: 'post',
	    data: params
	});


