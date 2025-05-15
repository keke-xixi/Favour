<template>
  <div class="settings" >
    <el-card class="table-card">
      <el-table
        v-show="!loading"
        :data="tableData"
        class="custom-table"
        :header-cell-style="{background: '#191919', color: '#fff',height: '60px',borderBottom:'1px solid #444548'}"
        :cell-style="{background: '#191919', color: '#fff',height: '60px',borderBottom:'1px solid #444548'}"
        :row-style="{border:'none'}"
      >
      <!-- element-loading-text="数据正在加载中..." -->
        <template #empty>
             <el-empty  description="暂无数据" />
        </template>
        <el-table-column prop="account" label="账号"  />
        <el-table-column prop="name" label="昵称"  />
        <el-table-column prop="level" label="级别" />
        <el-table-column prop="score" label="积分" />
        <el-table-column prop="money" label="金币" />
        <el-table-column prop="home" label="仓库">
           <template #default>
             <img src="/img/game/homeWay.png" alt="" style="width: 50px;height: auto;cursor: pointer;">
           </template>
        </el-table-column>
        <el-table-column  label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" :size="size" link>修改密码</el-button>
              <el-button type="danger" :size="size" link @click="showDeleteDialog(scope.row)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div class="loading-card" v-show="loading">
      <img src="/img/loading.gif" alt="" style="width: 120px;height: 120px;z-index: 999;" />
    </div>
    <delete-dialog title="提示" text="确定要删除该账号吗？" @delete="deleteUser"  v-model:show="showDelete" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref,Ref } from 'vue';
import { useStore } from 'vuex';
import deleteDialog from '@//components/dialog/deleteDialog.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const store = useStore();

interface User {
  account: string
  name: string
  score: number
  level: string
  money: number
}
// 直接从计算属性获取vuex中值
// const playList = computed(() => store.state.playList);
const loading :Ref<boolean> = ref(true)
const tableData:Ref<Array<User>> = ref([])
const size = ref('default')
const editRow = ref<User>({} as User)
const showDelete = ref(false)

const getUserList = () => {
    // 方法写在 actions 里面用dispatch 调用,方法写在 mutations 里面用 commit 调用
    store.commit('getPlayList');
    return store.state.playList;
};
const showDeleteDialog = (row:any) => {
  editRow.value = row
  showDelete.value = true
}
const deleteUser = () => {
      let onlineUser = store.state.userInfo;
      tableData.value = tableData.value.filter((item) => item.account !== editRow.value.account)
      let playerInfo = JSON.parse(localStorage.getItem('playerInfo') || '{}');
      delete playerInfo[editRow.value.account];
      localStorage.setItem('playerInfo', JSON.stringify(playerInfo));
      if(tableData.value.length === 0 || onlineUser.username === editRow.value.account){
        router.push('/login')
      }
   
}

const getData = () => {
  // 模拟请求
  const data:any = []
  const playerInfo = JSON.parse(localStorage.getItem('playerInfo') || '{}');
  Object.keys(playerInfo).forEach(key => {
    if(typeof playerInfo[key] === 'object' && playerInfo[key] !== null){
        data.push({
          account: key,
          name: playerInfo[key].name || '无名',
          score: playerInfo[key].score || 0,
          level: playerInfo[key].level || '凡',
          money: playerInfo[key].money || 0
        })
    }
  });
  
  loading.value = true
  setTimeout(() => {
    tableData.value = data;
    loading.value = false
  },500)
   
}
onMounted(() => {
  getData()
  // getUserList()
})

</script>

<style lang="scss" scoped>
.settings{
  padding: 20px 40px;
  position: relative;
  .table-card{
    background-color: #191919;
    padding: 0 !important;
    height: calc(100vh - 100px);
    .el-table{
      background-color: #191919;
      color: #fff;
      height: calc(100vh - 100px);
      // border: 1px solid #444548;
      border: none !important;
    } 
  }
  .loading-card{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120px;
    height: 120px;
    transform: translate(-50%, -50%);
  }
}

</style>