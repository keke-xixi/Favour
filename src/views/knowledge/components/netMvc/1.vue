<template>
    <div class="container" ref="containerRef">
        <el-input type="textarea" v-model="text" :rows="36" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
    // 生成界面  
    1.生成方法
    public ActionResult ReportPreview(string json)
        {
            return View();

        }
    }
    2.选择方法 （在方法中右键添加视图）


    // 参数传递
     let params = { 
        testNo: "123456",
    };
    $.modalOpen({
        id: "Form",
        title: "打印参数配置",
        url: "/CDM/CheckSampleCode/ReportPreview?" + $.param(params),
        width: "80%",
        height: "80%",
        callBack: function (iframeId) {
            console.log(iframeId,'iframeId 确认后触发回调') 
        }
    });

    // 方式1: 直接从URL获取参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]); return null;
    }
    
    // 获取参数
    var testNo = getUrlParam('testNo');




  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  
  
  </style>
  