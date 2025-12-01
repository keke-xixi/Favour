@{
  //ViewBag.Title = "Index"; 
  Layout = "~/Views/Shared/_Index.cshtml";
}

<!-- 引入 ECharts 库 -->
<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>

<script>
  var onclickTabID = "", testNo = "";
  var colHide = [];
  var showColums = [];

  $(window).resize(function () {
      gridResize("gridList", 120);
  });

   // 初始化控件
  $(function () {
      initControl();
      var myDate = new Date();
      var month = myDate.getMonth() + 1;
      var date = myDate.getDate();
      if (month < 10) {
          month = "0" + month;
      }
      if (date < 10)
          date = "0" + date;

      $("#testStartTime").val(getDay(-2));
      $("#testEndTime").val(getDay(0));
      // 搜索
      $("#btn_search").click(function () {
          gridList();
      });
      gridList();
      
      // 初始化图表
      setTimeout(function() {
          getSubEchart();
      }, 100);
  })
  function gridResize(gridid, minWidthLastColumn) {
      gridWidthResize(gridid, minWidthLastColumn);
  }
  function gridWidthResize(gridid, minWidthLastColumn) {
      var gridPanel = $("#" + gridid).parentsUntil(".gridPanel").parent();
      var gridWidth = gridPanel.width();

      $("#" + gridid).setGridWidth(gridWidth);

      $("#" + gridid).width("100%");

      $("#gview_gridList").setGridWidth(gridWidth);

      var columnCount = gridPanel.find(".ui-jqgrid-hbox").find("th").length;

      gridPanel.find(".ui-jqgrid-hbox").find("table").eq(0).width("100%");

      gridPanel.find(".ui-jqgrid-hbox").find("th").eq(columnCount - 1).width("100%");

      gridPanel.find(".ui-jqgrid-bdiv").find("tr").eq(0).find("td").eq(columnCount - 1).width("100%");


      if (gridPanel.find(".ui-jqgrid-hbox").find("th").eq(columnCount - 1).width() < minWidthLastColumn) {
          gridPanel.find(".ui-jqgrid-hbox").find("th").eq(columnCount - 1).width(minWidthLastColumn);

          gridPanel.find(".ui-jqgrid-bdiv").find("tr").eq(0).find("td").eq(columnCount - 1).width(minWidthLastColumn);
      }
  }
  function gridHeightResize(gridid) {
      var gridHeight = $(window).height() - 208;
      $("#" + gridid).setGridHeight(gridHeight);
  }
  function getDay(day) {//当前时间加day
      /* 将时间设置为 0.00.00 - 23.59.59 方便查询 */
      var today = new Date();
      var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
      today.setTime(targetday_milliseconds); //注意，这行是关键代码
      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();
      if (day == -2) {
          var tHours = "00";
          var tMinutes = "00";
          var tSeconds = "00";
      }
      else if (day == 0) {
          var tHours = "23";
          var tMinutes = "59";
          var tSeconds = "59";
      }
      tMonth = (tMonth + 1) < 10 ? "0" + (tMonth + 1) : (tMonth + 1);
      tDate = tDate < 10 ? "0" + tDate : tDate;
      return tYear + "-" + tMonth + "-" + tDate + " " + tHours + ":" + tMinutes + ":" + tSeconds;
  }
  // 查询表格数据
  function gridList() {
      $("#gridPanel").html("");
      $("#gridPanel").html("<table id='gridList'></table><div id='gridPager'></div>");

      var $gridList = $("#gridList");
      $gridList.dataGrid({
          url: "/CDM/VolatileMatterQCChart/GetGridJson",
          postData: {
            //  startDate: $("#testStartTime").val(),
            //  endDate: $("#testEndTime").val(),
            //  testNo: $("#testNo").val(), 
          },
          page: 1,
          height: $(window).height() - 520,
          colModel: [
              { label: '日期', name: 'TestDate', width: 120, align: 'left' },
              { label: '标煤编号', name: 'TestNo',width: 120, align: 'left' },
              { label: '干基挥发分Vd（%）', name: 'DryVolatileContent',width: 120, align: 'left' },
              { label: '标准值（上限）', name: 'StandardValueUpper',width: 120, align: 'left' },
              { label: '标准值（下限）', name: 'StandardValueLower',width: 120, align: 'left' },
              { label: '中位值', name: 'MedianValue',width: 120, align: 'left' },
              { label: '不确定度', name: 'Uncertainty',width: 120, align: 'left' },
              { label: 'd', name: 'DeviationD',width: 120, align: 'left' },
              { label: 'd/△x', name: 'DeviationRatio',width: 120, align: 'left' },
              { label: '化验员', name: 'TestPerson',width: 120, align: 'left' },
          ],
          pager: "#gridPager",
          sortname: 'TestDate asc',
          viewrecords: true,
          nowrap: false,
          onCellSelect: function (rowid, iCol, cellcontent, e) {
              testNo = $("#gridList").getRowData(rowid)?.BATCHNO;
              getSubEchart(testNo);
          },
      });
  }
  // 获取echart图数据
  function getSubEchart() {
      // 初始化ECharts实例
      var chartDom = document.getElementById('divstandardDatachart');
      var myChart = echarts.init(chartDom);
      
      // 生成模拟数据
      var dates = [];
      var values = [];
      
      // 生成最近15天的日期数据
      var today = new Date();
      for (var i = 14; i >= 0; i--) {
          var date = new Date();
          date.setDate(today.getDate() - i);
          dates.push((date.getMonth() + 1) + '/' + date.getDate());
      }
      
      // 生成模拟的标准值数据（在80-120之间波动）
      var baseValue = 100;
      for (var i = 0; i < 15; i++) {
          var randomValue = baseValue + (Math.random() * 20 - 10);
          values.push(parseFloat(randomValue.toFixed(2)));
      }
      
      // ECharts配置
      var option = {
          title: {
              text: '标准值趋势图',
              left: 'center'
          },
          tooltip: {
              trigger: 'axis'
          },
          legend: {
              data: ['标准值'],
              top: 30
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              top: 80,
              containLabel: true
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: dates,
              name: '日期'
          },
          yAxis: {
              type: 'value',
              name: '标准值',
              min: 80,
              max: 120
          },
          series: [
              {
                  name: '标准值',
                  type: 'line',
                  data: values,
                  smooth: true,
                  itemStyle: {
                      color: '#5470c6'
                  },
                  areaStyle: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          { offset: 0, color: 'rgba(84, 112, 198, 0.5)' },
                          { offset: 1, color: 'rgba(84, 112, 198, 0.1)' }
                      ])
                  }
              }
          ]
      };
      
      // 使用配置项显示图表
      myChart.setOption(option);
      
      // 窗口大小改变时重置图表大小
      window.addEventListener('resize', function() {
          myChart.resize();
      });
  }
  //日期格式转化
  function getDayFormat(str) {
      var date = new Date(str);
      var year = date.getFullYear();              //年
      var month = format(date.getMonth() + 1);    //月
      var da = format(date.getDate());            //日
      var h = format(date.getHours());            //时
      var m = format(date.getMinutes());          //分
      var s = format(date.getSeconds());          //秒

      return year + '-' + month + '-' + da;                                  //yyyy-MM-dd
  }
  function format(val) {
      return Number(val) < 10 ? '0' + val : '' + val
  }
  function gridTab() {
      $.ajax({
          url: '/CDM/QueryQualityResult/GetGridTabListJson',
          dataType: "json",
          async: false,
          success: function (data) {
              var tabHtml = "";
              for (var i = 0; i < data.length; i++) {
                  var id = data[i].CODE;
                  var name = data[i].CODENAME;
                  tabHtml += "<li><a data-toggle='tab' href='#tab-" + id + "' aria-expanded='false'>" + name + "</a></li>";
              }
              $("#gridTabul").html(tabHtml);
              $('#gridTabul li:first').addClass('active');
              $('#gridTabul a:first').attr('aria-expanded', true);

              $("#gridTabul a").click(function (e) {
                  e.preventDefault();
                  var code = $(this).attr("href").replace("#tab-", "");
                  $.ajax({
                      url: "/CDM/QualityResult/GetColModelJson",
                      data: { qualityTypeCode: code },
                      dataType: "json",
                      async: false,
                      success: function (data) {
                          colHide = data.colHide;
                          showColums = data.colShow;
                          $("#gridList").jqGrid('setGridParam', {
                              postData: {
                                  testNo: $("#testNo").val(),
                                  testStartTime: $("#testStartTime").val(),
                                  testEndTime: $("#testEndTime").val(),
                                  qualityTypeCode: code,
                              },
                              page: 1
                          }).trigger('reloadGrid');
                      }
                  });
              });
          }
      });
  }
  function checkTitle(id) {
      var checkState = false;
      if ($("#checkTitle_" + id).attr("class") == "far fa-check-square") {
          checkState = true;
      }

      var selectedIds = $("#gridList_" + id).jqGrid("getGridParam", "selarrrow");
      if (checkState) {
          $("#checkTitle_" + id).attr("class", "far fa-square");
          var rowIds = jQuery("#gridList_" + id).jqGrid('getDataIDs');
          for (var row = 0; row < rowIds.length; row++) {
              if (selectedIds.indexOf(rowIds[row]) > 0) {
                  $("#gridList_" + id).jqGrid('setSelection', rowIds[row]);
              }
              var cellCheckBox = $("#gridList_" + id).find("#" + rowIds[row] + "").find("#chk_" + rowIds[row]);
              cellCheckBox.parent().html("<i id=\"chk_" + rowIds[row] + "\" class=\"far fa-square\" style=\"margin-left:5px;margin-top:5px;\">");
          }
      }
      else {
          $("#checkTitle_" + id).attr("class", "far fa-check-square");
          var rowIds = jQuery("#gridList_" + id).jqGrid('getDataIDs');
          for (var row = 0; row < rowIds.length; row++) {
              if (selectedIds.indexOf(rowIds[row]) < 0) {
                  $("#gridList_" + id).jqGrid('setSelection', rowIds[row]);
              }
              var cellCheckBox = $("#gridList_" + id).find("#" + rowIds[row] + "").find("#chk_" + rowIds[row]);
              cellCheckBox.parent().html("<i id=\"chk_" + rowIds[row] + "\" class=\"far fa-check-square\" style=\"margin-left:5px;margin-top:5px;\">");
          }
      }
  }
  function initControl() {
      $('#sel_reportname').select2({
          ajax: {
              url: '/CDM/ReportSetting/GetReportJson',
              data: function (params) {
                  var query = {
                      reportType: $("#sel_reporttype").val(),
                      search: "200"//params.term
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
  }
  function addClick() {
      $.modalOpen({
          id: "Form",
          title: "新增标准设置信息",
          url: "/CDM/CheckSampleCode/Form",
          width: "800px",
          height: "550px",
          callBack: function (iframeId) { 
              top.frames[iframeId].submitForm();
          }
      });
  }
  function deleteClick() {
      var codetype = $("#gridList").jqGridRowValue().Id;
      if (codetype == undefined) {
          $.modalAlert("请选择您要删除的数据！", "error");
          return;
      };

      $.deleteForm({
          url: "/CDM/CheckSampleCode/DeleteForm",
          param: { id: codetype },
          success: function () {
              $.currentWindow().$("#gridList").trigger("reloadGrid");
          }
      })
  }
  function editClick() {
      var keyValue = $("#gridList").jqGridRowValue().Id;
      console.log(keyValue,'keyValue')
      if (keyValue == undefined) {
          $.modalAlert("请选择您要编辑的数据！", "error");
          return;
      }

      $.modalOpen({
          id: "Form",
          title: "修改标准设置信息",
          url: "/CDM/CheckSampleCode/Form?keyValue=" + keyValue,
          width: "1800px",
          height: "510px",
          callBack: function (iframeId) {
              top.frames[iframeId].submitForm();
              $.currentWindow().$("#gridList").trigger("reloadGrid");
          }
      });
  }
</script>

<div class="topPanel">
  @Html.RenderToolbar()
  <div class="search">
      <table>
          <tr>
              <td>
                  <div class="input-group" style="width:150px;">
                      <input size="16" type="text" id="testNo" class="form-control" placeholder="请输入标煤编号">
                  </div>
              </td>
              <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td>
                  <div class="input-group">
                      <input size="16" type="text" style="width:150px;" id="testStartTime" class="Wdate form-control" onFocus="WdatePicker({ dateFmt: 'yyyy-MM-dd HH:mm:ss' ,lang:'zh-cn',maxDate:'#F{$dp.$D(\'testEndTime\')}'})" placeholder="请选择开始日期">
                  </div>
              </td>
              <td>
                  <div class="input-group" style="width:35px;text-align:center">
                      至
                  </div>
              </td>
              <td>
                  <div class="input-group" style="width:163px;">
                      <input size="16" type="text" style="width:150px;" id="testEndTime" class="Wdate form-control" onFocus="WdatePicker({ dateFmt: 'yyyy-MM-dd HH:mm:ss' ,lang:'zh-cn',minDate:'#F{$dp.$D(\'testStartTime\')}'})" placeholder="请选择结束日期">
                      <span class="input-group-btn">
                          <button id="btn_search" type="button" class="btn  btn-primary"><i class="fa fa-search"></i></button>
                      </span>
                  </div>
              </td>

          </tr>
      </table>
  </div>
</div>

<div class="gridPanel" id="gridPanel">
  <ul class="nav nav-tabs" id="gridTabul"></ul>
  <table id="gridList"></table>
  <div id="gridPager"></div> 
</div>
<div style="width:100%;height:50vh;">
<div class="panel-body" id="divstandardDatachart" style="width:100%;height:100%;"></div>
</div>