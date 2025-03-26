<template>
    <div class="chartBox" style="background-image: url('/img/bigBox.svg')">
      <div class="chartTitle">
        <div class="textBox">
          <img src="/img/title.png" alt="" />
          <span>需求进度管理列表</span>
        </div>
        <el-tooltip :show-arrow="false" placement="bottom-end">
          <template #content>
            <div class="tooltipBox">
              列出具体任务的详细信息，包括优先级、解决结果和进度跟踪。帮助团队详细跟踪每个任务的进度和状态，确保任务按计划完成。
            </div>
          </template>
          <img src="/img/info.svg" alt="" />
        </el-tooltip>
        <div class="iconBox">
          <img src="/img/icon.png" alt="" />
        </div>
      </div>
      <dv-scroll-board
        ref="scrollBoard"
        :config="config"
        style="width: 100%; height: calc(100% - 40px); font-size: 12px"
        :style="{ fontSize: '12px' }"
        @mouseover="mouseoverHandler"
        @click.native="clickHandler"
      />
  
      <detail-dialog
        v-model:show="showDialog"
        :info="info"
        :projectId="projectId"
        :type="type"
        :issue_id="issue_id"
      />
    </div>
  </template>
  <script setup lang="ts">
  import { ref, reactive, onMounted, watch } from "vue";
  import detailDialog from "./components/detailDialog.vue";
  import { SearchProgress } from "@/api";
  import { ISSUE_SEVERITY, TASK_NORMAL_STATE } from "@/constant";
  
  const props = defineProps({
    //  当前选中的版本信息
    versionInfo: {
      type: Object,
      default: () => ({}),
    },
    // 当前选中的项目id
    projectId: {
      type: String,
      default: "",
    },
  });
  const showDialog = ref(false);
  const type: any = ref(null);
  const info: any = ref(props.versionInfo);
  const listData: any = ref([]);
  const issue_id: any = ref("");
  let config = reactive({
    header: [
      "序号",
      "Jira编号",
      "Epic Name",
      "模块",
      "优先级",
      "解决结果",
      '<div style="text-align: left">故事进度跟踪(移交测试数/总数)</div>',
    ],
    headerBGC: "#062a50",
    oddRowBGC: "",
    evenRowBGC: "",
    data: [[], []],
    index: false,
    columnWidth: [60, 120, 120, 90, 90, 90, 230], // 设置第列宽度
    align: ["center"],
  });
  watch(
    () => props.versionInfo,
    (newVal) => {
      info.value = newVal;
      getData();
    }
  );
  const mouseoverHandler = (e: any) => {};
  // 计算移交测试数量和故事数量比列
  const getE2EAndStory = (test: any, story: any) => {
    let arr: any = [];
    story.forEach((item: any, index: number) => {
      let obj = { epic_key: item.epic_key, rate: "0/" + item.count },
        flag = true;
      test.forEach((i: any) => {
        if (!flag) return;
        if (item.epic_key === i.epic_key) {
          obj.rate = i.count + "/" + item.count;
          flag = false;
        }
      });
      arr.push(obj);
    });
    return arr;
  };
  const clickHandler = (e: any) => {
    const { columnIndex, rowIndex } = e;
    if (columnIndex === 1) {
      window.open(
        `https://cnpmp.amway.com.cn/jira/browse/` +
          listData.value[rowIndex].issue_key,
        "_blank"
      );
    }
    if (columnIndex === 6) {
      issue_id.value = listData.value[rowIndex]?.issue_id || null;
      if (rowIndex === listData.value.length) {
        type.value = "unLink";
      } else {
        type.value = null;
      }
      showDialog.value = true;
    }
  };
  // const openDetail = (issue_id: any,type: any = null) => {
  //    issue_id.value = issue_id || null;
  //    type.value = type;
  //    showDialog.value = true;
  // }
  const getData = async () => {
    const params = {
      project_id: props.projectId,
      version_id: info.value.version_id,
    };
    // 现在用的是当前版本的 issue_key
    const res = await SearchProgress(params);
    if (res.status === 200) {
      const { Epic, Story, Test, unLinkStory, unLinkTest } = res.data;
      const testStoryList = getE2EAndStory(Test, Story);
      config.data = Epic.map((item: any, index: number) => {
        let status = "-";
        let rate =
          testStoryList.filter((i: any) => i.epic_key === item.issue_key)[0]
            ?.rate || "0/0";
        const { TODO, DOING, DONE, E2E } = TASK_NORMAL_STATE;
        if (TODO.includes(item.status)) status = "待开始";
        if (DOING.includes(item.status)) status = "处理中";
        if (DONE.includes(item.status)) status = "已完成";
        if (E2E.includes(item.status)) status = "已移测";
        return [
          index + 1,
          `<div style="text-decoration: underline;cursor: pointer;text-align: center;">${item.issue_key}</div>`,
          item.issue_name,
          item.component_name,
          ISSUE_SEVERITY[item.priority],
          status,
          `<div style="text-decoration: underline;cursor: pointer;text-align: center;" @click="openDetail(${item.issue_id})">${rate}</div>`,
        ];
      });
      const list: any = [
        config.data.length + 1,
        "-",
        "-",
        "-",
        "-",
        "-",
        `<div style="text-decoration: underline;cursor: pointer;text-align: center;" @click="openDetail(${null},'unLink')">${
          unLinkTest[0]?.count || 0
        }/${unLinkStory[0]?.count || 0}</div>`,
      ];
      config.data.push(list);
      listData.value = Epic;
    }
  };
  onMounted(() => {});
  </script>
  <style lang="scss" scoped></style>
  