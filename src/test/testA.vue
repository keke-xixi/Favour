
@{
  ViewBag.Title = "Index";
  Layout = "~/Views/Shared/_Index.cshtml";
}
<link href="~/Content/css/theme-cosmo.css" rel="stylesheet">
<link href="~/Content/css/GrapeCity.ActiveReports.Viewer.Html.css" rel="stylesheet">

<script src="~/Scripts/knockout-2.3.0.js"></script>
<script src="~/Scripts/GrapeCity.ActiveReports.Viewer.Html.js"></script>


<style>
  #viewerContainer {
      width: 110%;
      height: 600px;
      padding-left: 20%;
      padding-right: 20%;
      /*border: 1px solid gray;*/
  }

  #settingsContainer {
      padding-top: 10px;
      padding-bottom: 10px;
  }

  #reportContainer {
      position: absolute;
      left: 25%;
  }

  .settings-row {
      padding-bottom: 5px;
  }
</style>

<script type="text/javascript">
  $(function () {
      // 获取参数
      var testNo = getUrlParam('testNo');
      console.log(testNo,'testNo');
      initControl();
      $(".yesship").hide();   //输入年、月
      $(".notship").hide();   //选择时间区间
      $(".notship2").hide();  //选择指定日期
      $(".hys").hide();       //输入化验编码
      $(".hys2").hide();      //选择矿别
      $(".hys3").hide();      //选择班组、机组
      $(".hys5").hide();      //选择卸煤地点
      $(".Zhoukou").hide();   //周口个性化
      $("#sel_GoodsName").hide();
  })

  // 方式1: 直接从URL获取参数
  function getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURIComponent(r[2]); return null;
  }

  function initControl() {
      //时间区间初始化
      $("#testStartTime").val(getDay(0));
      $("#testEndTime").val(getDay(1));
      //报表类型
      $('#sel_reporttype').select2({
          ajax: {
              url: '/CDM/Code/GetSelectJson',
              data: function (params) {
                  var query = {
                      codeType: "0012",
                      search: params.term
                  }
                  return query;
              },
              processResults: function (data) {
                  var result = $.parseJSON(data);
                  return {
                      results: result
                  };
              }
          },
          allowClear: true,
          placeholder: '请选择报表类型',

      });
      //yangyang update
      //判断如果为化验室人员登录 只让其看化验室的表
      $.ajax({
          url: '/CDM/Code/GetSelectJsonForLab',
          success: function (data) {
              if (data == "true") {
                  $('#sel_reporttype').select2();
                  var option = new Option("化验室分析报表", "11", true, true);
                  $('#sel_reporttype').append(option).trigger('change');
              }
          }
      });
      //报表名称
      $('#sel_reportname').select2({
          ajax: {
              url: '/CDM/ReportSetting/GetReportJson',
              data: function (params) {
                  var query = {
                      reportType: $("#sel_reporttype").val(),
                      search: params.term
                  }
                  return query;
              },
              processResults: function (data) {
                  var result = $.parseJSON(data);
                  return {
                      results: result
                  };
              }
          },
          allowClear: true,
          placeholder: '报表名称'
      });
      //班组
      $('#txt_Class').select2({
          ajax: {
              url: '/CDM/Code/GetSelectJson',
              data: function (params) {
                  var query = {
                      codeType: "0022",
                      search: params.term
                  }
                  return query;
              },
              processResults: function (data) {
                  var result = $.parseJSON(data);
                  return {
                      results: result
                  };
              }
          },
          allowClear: true,
          placeholder: '班组',

      });
      //机组
      $('#txt_Machine').select2({
          ajax: {
              url: '/CDM/Code/GetSelectJson',
              data: function (params) {
                  var query = {
                      codeType: "0061",
                      search: params.term
                  }
                  return query;
              },
              processResults: function (data) {
                  var result = $.parseJSON(data);
                  return {
                      results: result
                  };
              }
          },
          allowClear: true,
          placeholder: '机组',

      });
      //卸煤地点
      $('#txt_keyword').select2({
          ajax: {
              url: "/FCM/Node/GetSelectJsonText",
              data: function (params) {
                  var query = {
                      search: params.term,
                      nodeType: '煤场'
                  }
                  return query;
              },
              processResults: function (data) {
                  var result = $.parseJSON(data);
                  return {
                      results: result
                  };
              }
          },
          allowClear: true,
          placeholder: '卸煤地点'
      });
      //矿别
      $('#txt_MineNo').select2({
          ajax: {
              url: "/SFM/EvalSum/GetSelectJson",
              processResults: function (data) {
                  var result = $.parseJSON(data);
                  return {
                      results: result
                  };
              }
          },
          allowClear: true,
          placeholder: '矿别'
      });
      //物资类别
      $("#sel_GoodsType").select2();
      //物资名称
      $("#sel_GoodsType").change(function () {
          $("#sel_GoodsName").show();
          $("#sel_GoodsName").empty();
          var code = "";
          if ($("#sel_GoodsType").val() == "电煤") {
              code = "0015";
          }
          else {
              code = "0028";
          }

          $("#sel_GoodsName").select2({
              ajax: {
                  url: '/CDM/Code/GetSelectJson',
                  data: function (params) {
                      var query = {
                          codeType: code,
                          search: params.term
                      }
                      return query;
                  },
                  processResults: function (data) {
                      var result = $.parseJSON(data);
                      return {
                          results: result
                      };
                  }
              },
              allowClear: true,
              placeholder: '物资名称',
          });
      });
      //运输单位
      $("#sel_TranUnitNo").select2({
          ajax: {
              url: '/FCM/TranUnit/GetSelectJson',
              data: function (params) {
                  var query = {
                      search: params.term
                  }
                  return query;
              },
              processResults: function (data) {
                  var result = $.parseJSON(data);
                  return {
                      results: result
                  };
              }
          },
          placeholder: '请选择运输单位',
          allowClear: true
      });

      var height = $(window).height() - 85;
      $("#viewerContainer").height(height);

      $("#btn_search").click(function () {
          searchClick();
      });
      $("#sel_reporttype").on("change", function (e) {
          $('#sel_reportname').select2({
              ajax: {
                  url: '/CDM/ReportSetting/GetReportJson',
                  data: function (params) {
                      var query = {
                          reportType: $("#sel_reporttype").val(),
                          search: params.term
                      }
                      return query;
                  },
                  processResults: function (data) {
                      var result = $.parseJSON(data);
                      return {
                          results: result
                      };
                  }
              },
              allowClear: true,
              placeholder: '报表名称'
          });
      });

      $("#sel_reportname").on("change", function (e) {
          if ($("#sel_reportname  option:selected").text() === '装船') {
              $(".yesship").show();
              $(".notship").hide();
              $(".hys").hide();
              $(".notship2").hide();
              $(".hys2").hide();
              $(".hys3").hide();
              $(".hys5").hide();
              $(".Zhoukou").hide();
          }
          else if ($("#sel_reporttype  option:selected").val() === '100') {
              $(".yesship").hide();
              $(".notship").show();
              $(".hys").show();
              $(".notship2").hide();
              $(".hys2").hide();
              $(".hys3").hide();
              $(".hys5").hide();
              $(".Zhoukou").hide();
          }
          else if ($("#sel_reportname  option:selected").text() === '卸车') {
              $(".yesship").hide();
              $(".notship").show();
              $(".hys").hide();
              $(".notship2").hide();
              $(".hys2").hide();
              $(".hys3").hide();
              $(".hys5").hide();
              $(".Zhoukou").hide();
          }
          else if ($("#sel_reportname  option:selected").text() === '入厂煤日报表') {
              $(".yesship").hide();
              $(".notship").hide();
              $(".notship2").show();
              $(".hys").hide();
              $(".hys2").show();
              $(".hys3").hide();
              $(".hys5").hide();
              $(".Zhoukou").hide();
          }
          else if ($("#sel_reportname  option:selected").text() === '入炉煤煤质检测月报表' || $("#sel_reportname  option:selected").text() === '入厂煤煤质检测月报表') {
              $(".yesship").show();
              $(".notship").hide();
              $(".notship2").hide();
              $(".hys").hide();
              $(".hys2").hide();
              $(".hys3").hide();
              $(".hys5").hide();
              $(".Zhoukou").hide();
          }
          else if ($("#sel_reportname  option:selected").text() === '苏龙热电入炉煤煤质检测报告') {
              $(".yesship").hide();
              $(".notship").hide();
              $(".notship2").hide();
              $(".hys").show();
              $(".hys2").hide();
              $(".hys3").hide();
              $(".hys5").hide();
              $(".Zhoukou").hide();
          }
          else if ($("#sel_reportname  option:selected").text() === '入厂煤煤质检验报告' || $("#sel_reportname  option:selected").text() === '煤粉细度分析报告汇总表'
              || $("#sel_reportname  option:selected").text() === '飞灰可燃物分析报告'
              || $("#sel_reportname  option:selected").text() === '炉渣可燃物分析报告' || $("#sel_reportname  option:selected").text() === '煤粉细度分析报告'
              || $("#sel_reportname  option:selected").text() === '入炉煤检验报告' || $("#sel_reportname  option:selected").text() === '进煤日报表' || $("#sel_reportname  option:selected").text() === '粉煤灰检验记录') {
              $(".yesship").hide();
              $(".notship").hide();
              $(".notship2").show();
              $(".hys").hide();
              $(".hys2").hide();
              $(".hys3").hide();
              $(".hys5").hide();
              $(".Zhoukou").hide();
          }
          else if ($("#sel_reportname  option:selected").text() === '入炉煤日报表') {
              $(".yesship").hide();
              $(".notship").hide();
              $(".notship2").show();
              $(".hys").hide();
              $(".hys2").hide();
              $(".hys3").show();
              $(".hys5").hide();
              $(".Zhoukou").hide();
          }
          else if ($("#sel_reportname  option:selected").text() === '入厂煤月报表') {
              $(".yesship").show();
              $(".notship").hide();
              $(".notship2").hide();
              $(".hys").hide();
              $(".hys2").show();
              $(".hys3").hide();
              $(".hys5").hide();
              $(".Zhoukou").hide();
          }
          else if ($("#sel_reportname  option:selected").text() === '入炉煤月报表') {
              $(".yesship").show();
              $(".notship").hide();
              $(".notship2").hide();
              $(".hys").hide();
              $(".hys2").hide();
              $(".hys3").show();
              $(".hys5").hide();
              $(".Zhoukou").hide();
          }
          else if ($("#sel_reportname  option:selected").text() === '入厂煤化验统计表' || $("#sel_reportname  option:selected").text() === '入炉煤化验统计表') {
              $(".yesship").hide();
              $(".notship").show();
              $(".notship2").hide();
              $(".hys").hide();
              $(".hys2").hide();
              $(".hys3").hide();
              $(".hys5").hide();
          }
          //原始记录报表
          else if ($("#sel_reportname  option:selected").text() === '分析水检测原始记录表' || $("#sel_reportname  option:selected").text() === '挥发分检测原始记录表' || $("#sel_reportname  option:selected").text() === '灰分检测原始记录表'
              || $("#sel_reportname  option:selected").text() === '全硫检测原始记录表' || $("#sel_reportname  option:selected").text() === '全水分检测原始记录表' || $("#sel_reportname  option:selected").text() === '发热量检测原始记录表'
              || $("#sel_reportname  option:selected").text() === '氮元素检测原始记录表' || $("#sel_reportname  option:selected").text() === '氢元素检测原始记录表' || $("#sel_reportname  option:selected").text() === '碳元素检测原始记录表'
              || $("#sel_reportname  option:selected").text() === '可DIY测原始记录' || $("#sel_reportname  option:selected").text() === '检测报告单'
              || $("#sel_reportname  option:selected").text() === '煤质分析原始记录表') {
              $(".yesship").hide();   //输入年、月
              $(".notship").hide();   //选择时间区间
              $(".notship2").show();  //选择指定日期
              $(".hys").show();       //输入化验编码
              $(".hys2").hide();      //选择矿别
              $(".hys3").hide();      //选择班组、机组
              $(".hys5").hide();      //选择卸煤地点
              $(".Zhoukou").hide();
          }
          else if ($("#sel_reportname  option:selected").text() === '煤质检测报告单' || $("#sel_reportname  option:selected").text() === '苏龙热电煤质检测原始记录'
              ) {
              $(".yesship").hide();   //输入年、月
              $(".notship").hide();   //选择时间区间
              $(".notship2").show();  //选择指定日期
              $(".hys").show();       //输入化验编码
              $(".hys2").hide();      //选择矿别
              $(".hys3").hide();      //选择班组、机组
              $(".hys5").hide();      //选择卸煤地点
              $(".Zhoukou").hide();
          }
          else if ($("#sel_reportname  option:selected").text() === '苏龙热电入厂煤煤质检测报告' || $("#sel_reportname  option:selected").text() === '苏龙热电煤质检测报告') {
              $(".yesship").hide();   //输入年、月
              $(".notship").hide();   //选择时间区间
              $(".notship2").show();  //选择指定日期
              $(".hys").show();       //输入化验编码
              $(".hys2").hide();      //选择矿别
              $(".hys3").hide();      //选择班组、机组
              $(".hys5").hide();      //选择卸煤地点
              $(".Zhoukou").hide();
          }
          else if ($("#sel_reportname  option:selected").text() === '煤质检测日报表') {
              $(".yesship").hide();   //输入年、月
              $(".notship").hide();   //选择时间区间
              $(".notship2").show();  //选择指定日期
              $(".hys").hide();       //输入化验编码
              $(".hys2").hide();      //选择矿别
              $(".hys3").hide();      //选择班组、机组
              $(".hys5").hide();      //选择卸煤地点
              $(".Zhoukou").hide();
          }
          else if ($("#sel_reportname  option:selected").text() === '汽车衡计量单') {
              $(".yesship").hide();   //输入年、月
              $(".notship").show();   //选择时间区间
              $(".notship2").hide();  //选择指定日期
              $(".hys").hide();       //输入化验编码
              $(".hys2").show();      //选择矿别
              $(".hys3").hide();      //选择班组、机组
              $(".hys5").hide();      //选择卸煤地点
              $(".Zhoukou").show();
          }
          else if ($("#sel_reportname  option:selected").text() === '入炉煤煤样存取样记录表') {
              $(".yesship").hide();   //输入年、月
              $(".notship").show();   //选择时间区间
              $(".notship2").hide();  //选择指定日期
              $(".hys").show();       //输入化验编码
              $(".hys2").hide();      //选择矿别
              $(".hys3").hide();      //选择班组、机组
              $(".hys5").hide();      //选择卸煤地点
              $(".Zhoukou").hide();
          }
          else if ($("#sel_reportname  option:selected").text() === '入厂原煤煤样存取样记录表') {
              $(".yesship").hide();   //输入年、月
              $(".notship").show();   //选择时间区间
              $(".notship2").hide();  //选择指定日期
              $(".hys").show();       //输入化验编码
              $(".hys2").hide();      //选择矿别
              $(".hys3").hide();      //选择班组、机组
              $(".hys5").hide();      //选择卸煤地点
              $(".Zhoukou").hide();
          }
          else if ($("#sel_reportname  option:selected").text() === '入厂煤泥煤样存取样记录表') {
              $(".yesship").hide();   //输入年、月
              $(".notship").show();   //选择时间区间
              $(".notship2").hide();  //选择指定日期
              $(".hys").show();       //输入化验编码
              $(".hys2").hide();      //选择矿别
              $(".hys3").hide();      //选择班组、机组
              $(".hys5").hide();      //选择卸煤地点
              $(".Zhoukou").hide();
          }
          else if ($("#sel_reportname  option:selected").text() === '销售样煤样存取样记录表') {
              $(".yesship").hide();   //输入年、月
              $(".notship").show();   //选择时间区间
              $(".notship2").hide();  //选择指定日期
              $(".hys").show();       //输入化验编码
              $(".hys2").hide();      //选择矿别
              $(".hys3").hide();      //选择班组、机组
              $(".hys5").hide();      //选择卸煤地点
              $(".Zhoukou").hide();
          }
          else if ($("#sel_reportname  option:selected").text() === '抽查样对比报告') {
              $(".yesship").show();   //输入年、月
              $(".notship").hide();   //选择时间区间
              $(".notship2").hide();  //选择指定日期
              $(".hys").show();       //输入化验编码
              $(".hys2").hide();      //选择矿别
              $(".hys3").hide();      //选择班组、机组
              $(".hys5").hide();      //选择卸煤地点
              $(".Zhoukou").hide();
          }
          else {
              $(".yesship").hide();   //输入年、月
              $(".notship").hide();   //选择时间区间
              $(".notship2").hide();  //选择指定日期
              $(".hys").hide();       //输入化验编码
              $(".hys2").hide();      //选择矿别
              $(".hys3").hide();      //选择班组、机组
              $(".hys5").hide();      //选择卸煤地点
              $(".Zhoukou").hide();
          }
      });

  }

  function getDay(day) {//当前时间加day
      //var today = new Date();
      //var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
      //today.setTime(targetday_milliseconds); //注意，这行是关键代码
      //var tYear = today.getFullYear();
      //var tMonth = today.getMonth();
      //var tDate = today.getDate();
      //tMonth = (tMonth + 1) < 10 ? "0" + (tMonth + 1) : (tMonth + 1);
      //tDate = tDate < 10 ? "0" + tDate : tDate;
      //return tYear + "-" + tMonth + "-" + tDate;

      /* 将时间设置为 0.00.00 - 23.59.59 方便查询 */
      var today = new Date();
      var targetday_milliseconds = today.getTime();//+ 1000 * 60 * 60 * 24 * day
      today.setTime(targetday_milliseconds); //注意，这行是关键代码
      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();
      if (day == 0) {
          var tHours = "00";
          var tMinutes = "00";
          var tSeconds = "00";
      }
      else if (day == 1) {
          var tHours = "23";
          var tMinutes = "59";
          var tSeconds = "59";
      }
      tMonth = (tMonth + 1) < 10 ? "0" + (tMonth + 1) : (tMonth + 1);
      tDate = tDate < 10 ? "0" + tDate : tDate;
      return tYear + "-" + tMonth + "-" + tDate + " " + tHours + ":" + tMinutes + ":" + tSeconds;
  }

  function PrefixInteger(num, length) {
      return (Array(length).join('0') + num).slice(-length);
  }

  function searchClick() {
      var ReportType = $("#sel_reporttype").val();
      var ReportID = $("#sel_reportname").val();

      if (ReportID == null || ReportID == "") {
          $.modalAlert("请先选择一种报表！", "warning");
          return;
      }
      $.ajax({
          url: ReportType == '100' ? '/CDM/DIYReportSetting/GetFormJson?keyValue=' + ReportID : '/CDM/ReportSetting/GetFormJson?keyValue=' + ReportID,
          success: function (d) {
              var reportName = JSON.parse(d).model.REPORTNAME;
              var reportTypeName = JSON.parse(d).REPORT;

              var TestNo = $("#txt_testNo").val();            //化验编码
              var testStartTime = $("#testStartTime").val();  //开始时间
              var testEndTime = $("#testEndTime").val();      //结束时间
              var startTime = $("#TestTime").val();           //化验时间
              var Vtxt_keyword = $('#txt_keyword').val();     //卸煤地点
              var Vtxt_MineNo = $('#txt_MineNo').val();       //矿别
              var Vtxt_Class = $('#txt_Class').val();         //班次
              var Vtxt_Machine = $('#txt_Machine').val();     //机组
              var Year = $("#txt_Year").val();                //年份
              var Month = $("#txt_Month").val();              //月份

              if (reportName == "装船") {
                  if (Year == "") {
                      $.modalAlert("请填入统计年份！", "warning");
                      return;
                  }
                  if (Month == "") {
                      var viewer = GrapeCity.ActiveReports.Viewer({
                          element: '#viewerContainer',
                          report: {
                              id: 'ReportPage/' + reportTypeName + '/' + reportName + '-年.rdlx',
                              parameters: [
                                  {
                                      name: 'Year',
                                      value: Year
                                  }
                              ]
                          },
                          reportService: {
                              url: '/ActiveReports.ReportService.asmx'
                          },
                          uiType: 'Desktop',
                          localeUri: '../../Scripts/i18n/Localeuri.txt',
                      });
                  } else {
                      var mon = PrefixInteger(Month, 2);
                      var viewer = GrapeCity.ActiveReports.Viewer({
                          element: '#viewerContainer',
                          report: {
                              id: 'ReportPage/' + reportTypeName + '/' + reportName + '-月.rdlx',
                              parameters: [
                                  {
                                      name: 'Year',
                                      value: Year
                                  }, {
                                      name: 'Month',
                                      value: mon
                                  }, {
                                      name: 'Time',
                                      value: Year + '/' + mon
                                  }
                              ]
                          },
                          reportService: {
                              url: '/ActiveReports.ReportService.asmx'
                          },
                          uiType: 'Desktop',
                          localeUri: '../../Scripts/i18n/Localeuri.txt',
                      });
                  }
              }
              else if (ReportType == "100") {
                  reportName = JSON.parse(d).model.ReportName;
                  var mons = ReportType + '|' + ReportID + '|' + reportName + '|' + TestNo + '|' + testStartTime + '|' + testEndTime;
                  var viewer = GrapeCity.ActiveReports.Viewer({
                      element: '#viewerContainer', report: {
                          id: mons,
                      },
                      reportService: {
                          url: '/ActiveReportsService.asmx'
                      },
                      uiType: 'Desktop',
                      localeUri: '../../Scripts/i18n/Localeuri.txt',
                  });
              }
              else if (reportName == '入炉煤煤质检测月报表' || reportName == '入厂煤煤质检测月报表') {

                  var mons = reportName + '|' + Year + '|' + Month;
                  var viewer = GrapeCity.ActiveReports.Viewer({
                      element: '#viewerContainer', report: {
                          id: mons,
                      },
                      reportService: {
                          url: '/ActiveReportsService.asmx'
                      },
                      uiType: 'Desktop',
                      localeUri: '../../Scripts/i18n/Localeuri.txt',
                  });
              }
              else if (reportName == '苏龙热电入炉煤煤质检测报告') {

                  var mons = reportName + '|' + TestNo;
                  var viewer = GrapeCity.ActiveReports.Viewer({
                      element: '#viewerContainer', report: {
                          id: mons,
                      },
                      reportService: {
                          url: '/ActiveReportsService.asmx'
                      },
                      uiType: 'Desktop',
                      localeUri: '../../Scripts/i18n/Localeuri.txt',
                  });
              }
              else if (reportName == "入厂煤日报表") {
                  //var mons = reportName + '|' + startTime + '|' +  Vtxt_keyword + '|' + Vtxt_MineNo + '|' +Vtxt_CarModel;
                  var viewer = GrapeCity.ActiveReports.Viewer({
                      element: '#viewerContainer',
                      report: {
                          id: 'ReportPage/' + reportTypeName + '/' + reportName + '.rdlx',
                          parameters: [
                              {
                                  name: 'ReportName',
                                  value: startTime
                              }, {
                                  name: 'NodeNo',
                                  value: Vtxt_Class
                              }, {
                                  name: 'MineralNo',
                                  value: Vtxt_MineNo
                              }
                          ]
                      },
                      reportService: {
                          url: '/ActiveReports.ReportService.asmx'
                      },
                      uiType: 'Desktop',
                      localeUri: '../../Scripts/i18n/Localeuri.txt',
                  });
              }
              else if (reportName == "入厂煤煤质检验报告" || reportName == "煤粉细度分析报告汇总表" || reportName == "飞灰可燃物分析报告"
                  || reportName == "炉渣可燃物分析报告" || reportName == "煤粉细度分析报告"
                  || reportName == "入炉煤检验报告" || reportName == "进煤日报表" || reportName == "粉煤灰检验记录") {
                  var mons = reportName + '|' + startTime;
                  var viewer = GrapeCity.ActiveReports.Viewer({
                      element: '#viewerContainer', report: {
                          id: mons,
                      },
                      reportService: {
                          url: '/ActiveReportsService.asmx'
                      },
                      uiType: 'Desktop',
                      localeUri: '../../Scripts/i18n/Localeuri.txt',
                  });
              }
              else if (reportName == "入厂煤化验统计表" || reportName == "入炉煤化验统计表") {
                  var mons = reportName + '|' + testStartTime + '|' + testEndTime;
                  var viewer = GrapeCity.ActiveReports.Viewer({
                      element: '#viewerContainer', report: {
                          id: mons,
                      },
                      reportService: {
                          url: '/ActiveReportsService.asmx'
                      },
                      uiType: 'Desktop',
                      localeUri: '../../Scripts/i18n/Localeuri.txt',
                  });
              }
              else if (reportName == "入厂煤月报表") {
                  var mon = PrefixInteger(Month, 2);
                  var viewer = GrapeCity.ActiveReports.Viewer({
                      element: '#viewerContainer',
                      report: {
                          id: 'ReportPage/' + reportTypeName + '/' + reportName + '.rdlx',
                          parameters: [
                              {
                                  name: 'Year',
                                  value: Year
                              },
                              {
                                  name: 'Month',
                                  value: Month
                              }, {
                                  name: 'NodeNo',
                                  value: $('#txt_keyword').val()
                              }, {
                                  name: 'MineralNo',
                                  value: $('#txt_MineNo').val()
                              }
                          ]
                      },
                      reportService: {
                          url: '/ActiveReports.ReportService.asmx'
                      },
                      uiType: 'Desktop',
                      localeUri: '../../Scripts/i18n/Localeuri.txt',
                  });
              }
              else if (reportName == "入炉煤日报表") {
                  var viewer = GrapeCity.ActiveReports.Viewer({
                      element: '#viewerContainer',
                      report: {
                          id: 'ReportPage/' + reportTypeName + '/' + reportName + '.rdlx',
                          parameters: [
                              {
                                  name: 'ReportName',
                                  value: startTime
                              }, {
                                  name: 'NodeNo',
                                  value: Vtxt_Class
                              }, {
                                  name: 'MineralNo',
                                  value: Vtxt_Machine
                              }
                          ]
                      },
                      reportService: {
                          url: '/ActiveReports.ReportService.asmx'
                      },
                      uiType: 'Desktop',
                      localeUri: '../../Scripts/i18n/Localeuri.txt',
                  });
              }
              else if (reportName == "入炉煤月报表") {
                  var mon = PrefixInteger(Month, 2);
                  var viewer = GrapeCity.ActiveReports.Viewer({
                      element: '#viewerContainer',
                      report: {
                          id: 'ReportPage/' + reportTypeName + '/' + reportName + '.rdlx',
                          parameters: [
                              {
                                  name: 'Year',
                                  value: Year
                              },
                              {
                                  name: 'Month',
                                  value: Month
                              }, {
                                  name: 'NodeNo',
                                  value: Vtxt_Class
                              }, {
                                  name: 'MineralNo',
                                  value: Vtxt_Machine
                              }
                          ]
                      },
                      reportService: {
                          url: '/ActiveReports.ReportService.asmx'
                      },
                      uiType: 'Desktop',
                      localeUri: '../../Scripts/i18n/Localeuri.txt',
                  });
              }
              else if (reportName == "分析水检测原始记录表" || reportName == "挥发分检测原始记录表" || reportName == '灰分检测原始记录表' || reportName == '全硫检测原始记录表'
                  || reportName == '全水分检测原始记录表' || reportName == '发热量检测原始记录表' || reportName == '氮元素检测原始记录表' || reportName == '氢元素检测原始记录表' || reportName == '碳元素检测原始记录表'
                  || reportName == '可DIY测原始记录' || reportName == '煤质分析原始记录表' || reportName == '检测报告单'
              ) {
                  if (!TestNo) {
                      $.modalAlert("请输入化验编码！", "warning");
                      return;
                  }
                  var mons = reportName + '|' + TestNo + '|' + startTime;
                  var viewer = GrapeCity.ActiveReports.Viewer({
                      element: '#viewerContainer', report: {
                          id: mons,
                      },
                      reportService: {
                          url: '/ActiveReportsService.asmx'
                      },
                      uiType: 'Desktop',
                      localeUri: '../../Scripts/i18n/Localeuri.txt',
                  });
              }
              else if (reportName == '煤质检测报告单' || reportName == '苏龙热电煤质检测原始记录' || "苏龙热电入厂煤煤质检测报告" == reportName || "苏龙热电煤质检测报告" == reportName) {
                  if (!TestNo && !startTime) { 
                      $.modalAlert("请输入化验编码或选择化验日期！", "warning");
                      return;
                  }
                  var mons;
                  if ("苏龙热电入厂煤煤质检测报告" != reportName || "苏龙热电煤质检测报告" != reportName)
                      mons = reportName + '|' + TestNo + '|' + startTime;
                  else
                      mons = reportName + '|' + TestNo + '|' + startTime + '|' + '入厂';
                  var viewer = GrapeCity.ActiveReports.Viewer({
                      element: '#viewerContainer', report: {
                          id: mons,
                      },
                      reportService: {
                          url: '/ActiveReportsService.asmx'
                      },
                      uiType: 'Desktop',
                      localeUri: '../../Scripts/i18n/Localeuri.txt',
                  });
              }
              else if (reportName == '煤质检测日报表') {
                  if (!startTime) {
                      $.modalAlert("请输入化验日期！", "warning");
                      return;
                  }
                  var mons = reportName + '|' + startTime;
                  var viewer = GrapeCity.ActiveReports.Viewer({
                      element: '#viewerContainer', report: {
                          id: mons,
                      },
                      reportService: {
                          url: '/ActiveReportsService.asmx'
                      },
                      uiType: 'Desktop',
                      localeUri: '../../Scripts/i18n/Localeuri.txt',
                  });
              }
              else if (reportName == '汽车衡计量单') {
                  var trainNo = $("#sel_TranUnitNo").val();
                  var goostype = $("#sel_GoodsType").val();
                  var goosname = $("#sel_GoodsName").text();
                  var mons = reportName + '|' + testStartTime + '|' + testEndTime + '|' + Vtxt_MineNo + '|' + trainNo + '|' + goostype + '|' + goosname;
                  var viewer = GrapeCity.ActiveReports.Viewer({
                      element: '#viewerContainer', report: {
                          id: mons,
                      },
                      reportService: {
                          url: '/ActiveReportsService.asmx'
                      },
                      uiType: 'Desktop',
                      localeUri: '../../Scripts/i18n/Localeuri.txt',
                  });
                  $("#sel_GoodsName").empty();//清空text
              }
              else if (reportName == '抽查样对比报告') {
                  var txt_Year = $("#txt_Year").val();
                  var txt_Month = $("#txt_Month").val();
                  var mons = reportName + '|' + TestNo + '|' + txt_Year + '|' + txt_Month;
                  var viewer = GrapeCity.ActiveReports.Viewer({
                      element: '#viewerContainer', report: {
                          id: mons,
                      },
                      reportService: {
                          url: '/ActiveReportsService.asmx'
                      },
                      uiType: 'Desktop',
                      localeUri: '../../Scripts/i18n/Localeuri.txt',
                  });
              }
              else {
                  var mons = reportName + '|' + TestNo + '|' + testStartTime + '|' + testEndTime;
                  var viewer = GrapeCity.ActiveReports.Viewer({
                      element: '#viewerContainer',
                      report: {
                          id: mons,
                      },
                      reportService: {
                          url: '/ActiveReportsService.asmx'
                      },
                      uiType: 'Desktop',
                      localeUri: '../../Scripts/i18n/Localeuri.txt',
                  });
              }

          }
      });
  }

</script>

<div class="topPanel">
  <!--@Html.RenderToolbar()-->
  <div class="search">
      <table>
          <tr>
              <td>
                  <div class="input-group" style="width:170px;">
                      <select id="sel_reporttype" class="form-control"></select><!--报表类型-->
                  </div>
              </td>
              <td style="width:6px;"></td>
              <td>
                  <div class="input-group" style="width:200px;">
                      <select id="sel_reportname" class="form-control"></select><!--报表名称-->
                  </div>
              </td>
              <td style="width:6px;"></td>
              <td class="hys">
                  <div class="input-group">
                      <input size="16" type="text" id="txt_testNo" class="form-control" placeholder="请输入化验编码">
                  </div>
              </td>
              <td class="hys5">
                  <div class="input-group" style="width:150px;">
                      <select id="txt_keyword" class="form-control"></select>
                  </div>
              </td>
              <td style="width:6px;"></td>
              <td class="hys2">
                  <div class="input-group">
                      <select id="txt_MineNo" name="txt_MineNo" class="form-control" placeholder="矿别" style="width: 150px;">
                          <option value="" selected="selected">全部</option>
                      </select>
                  </div>
              </td>
              <td style="width:6px;"></td>
              <td class="hys3">
                  <div class="input-group">
                      <select id="txt_Class" name="txt_Class" class="form-control" placeholder="班组" style="width: 150px;"></select>
                  </div>
              </td>
              <td style="width:6px;"></td>
              <td class="hys3">
                  <div class="input-group">
                      <select id="txt_Machine" name="txt_Machine" class="form-control" placeholder="机组" style="width: 150px;"></select>
                  </div>
              </td>
              <td style="width:6px;"></td>
              <td class="notship2">
                  <div class="input-group">
                      <input size="16" type="text" id="TestTime" style="width:150px" autocomplete="off" class="Wdate form-control" onFocus="WdatePicker({ dateFmt: 'yyyy-MM-dd HH:mm:ss' ,lang:'zh-cn',dateFmt: 'yyyy/MM/dd',maxDate:'#F{$dp.$D(\'testEndTime\')}'})" placeholder="请选择日期">
                  </div>
              </td>
              <td class="yesship">
                  <div class="input-group">
                      <input size="16" type="text" id="txt_Year" class="form-control" placeholder="请输入年">
                  </div>
              </td>
              <td class="yesship">
                  <div class="input-group">
                      <input size="16" type="text" id="txt_Month" class="form-control" placeholder="请输入月">
                  </div>
              </td>
              <td class="Zhoukou" style="width:6px;"></td>
              <td class="Zhoukou">
                  <div class="input-group">
                      <select id="sel_TranUnitNo" class="form-control required" placeholder="请选择运输单位" style="width:154px;">
                          <option value="" selected="selected">全部</option>
                      </select>
                  </div>
              </td>
              <td class="Zhoukou" style="width:6px;"></td>
              <td class="Zhoukou">
                  <div class="input-group">
                      <select id="sel_GoodsType" class="form-control required" placeholder="请选择物资类别" style="width:104px;">
                          <option value="" selected="selected">全部</option>
                          <option value="电煤">电煤</option>
                          <option value="非煤物资">非煤物资</option>
                      </select>
                  </div>
              </td>
              <td class="Zhoukou" style="width:6px;"></td>
              <td class="Zhoukou">
                  <div class="input-group">
                      <select id="sel_GoodsName" class="form-control required" placeholder="请选择物资名称" style="width:104px;"></select>
                  </div>
              </td>
              <td style="width:6px;"></td>
              <td class="notship">
                  <div class="input-group">
                      <input size="16" type="text" style="width:150px;" autocomplete="off" id="testStartTime" class="Wdate form-control" onFocus="WdatePicker({dateFmt: 'yyyy-MM-dd HH:mm:ss', lang:'zh-cn',maxDate:'#F{$dp.$D(\'testEndTime\')}'})" placeholder="请选择开始日期">
                  </div>
              </td>
              <td class="notship">
                  <div class="input-group">
                      至
                  </div>
              </td>
              <td style="width:6px;"></td>
              <td class="notship">
                  <div class="input-group" style="width:140px;">
                      <input size="16" type="text" autocomplete="off" style="width:150px;" id="testEndTime" class="Wdate form-control" onFocus="WdatePicker({ dateFmt: 'yyyy-MM-dd HH:mm:ss',lang:'zh-cn',minDate:'#F{$dp.$D(\'testStartTime\')}'})" placeholder="请选择结束日期">
                  </div>
              </td>
              <td>
                  <div class="input-group">
                      <span class="input-group-btn">
                          <button id="btn_search" type="button" class="btn  btn-primary"><i class="fa fa-search"></i></button>
                      </span>
                  </div>
              </td>
          </tr>
      </table>
  </div>
</div>

<div id="viewerContainer">
</div>


