<template>
    <view class="container">
      <view style="padding: 15rpx 25rpx;">
          <u-subsection :list="list" v-model="current" mode="subsection" active-color="#517afa" @change="change"></u-subsection>
      </view>
      <view style="">
          <selectCoalCheck v-if="current === 0" @update="($event)=>update($event,0)"></selectCoalCheck>
          <carCheck v-if="current === 1" @update="($event)=>update($event,1)"></carCheck>
          <planCoalCheck v-if="current === 2" @update="($event)=>update($event,2)"></planCoalCheck>
          <userCheck v-if="current === 3" @update="($event)=>update($event,3)"></userCheck>
      </view>
    </view>
  </template>
  
  <script>
  import { wxUserList,todoSummary } from '@/api/power/index.js';
  import { ROLE_TYPE } from '@/utils/constant.js';
  import carCheck from './component/carCheck.vue';
  import selectCoalCheck from './component/selectCoalCheck.vue';
  import userCheck from './component/userCheck.vue';
  import planCoalCheck from './component/planCoalCheck.vue';
  export default {
    components: {
        carCheck,selectCoalCheck,userCheck,planCoalCheck
    },
    data() {
      return {
        roleType: ROLE_TYPE,
        list: [
                  {
                      name: '选矿审核',
                      num: 0
                  }, 
                  {
                      name: '车辆审核',
                      num: 0
                  }, 
                  {
                      name: '矿点分配',
                      num: 0
                  },
                  {
                      name: '用户审核',
                      num: 0
                  }
          ],
          current: 0
      }
    },
    onLoad() {
        
    },
    mounted() {
        this.getTodoSummaryList()
    },
    computed: {
      
    },
    methods: {
      // 获取事件汇总
      getTodoSummaryList(){
          todoSummary().then(res=>{
              let result = res.result || {};
              const { car,selectMine,user } = result;
              this.list[0].num = selectMine;
              this.list[1].num = car;
              this.list[2].num = user;
          })
      },
      change(e){
          console.log(e,'e');
          this.current = e;
      },
      // 更新状态数量
      update(num,index){
          this.getTodoSummaryList()
      }
    }
  }
  </script>
  
  <style scoped lang="scss">
  .container {
    height: 100%;
    background-color: #f5f7fa;
    padding-bottom: 30rpx;
    overflow-y: scroll;
  }
  
  </style>