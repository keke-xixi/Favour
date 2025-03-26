<template>
      <div class="mouseCard">
         <overGround @change="downMouse" :style="overStyle" :mouseData="mouse"/>
         <underGround @change="upMouse" :style="underStyle" :mouseData="mouse"/>
      </div>
</template>
<script setup lang="ts">
import { ref,reactive } from "vue"
import overGround from "./components/overGround.vue";
import underGround from "./components/underGround.vue";


// 地表盒子
const overStyle:any = reactive({
    transform: 'translateY(0)',
})
// 地底盒子
const underStyle:any = reactive({
    transform: 'translateY(0)',
})
let mouse:any = reactive({
    x: 0,
    y: 0,
})
// 回到地表
const upMouse = (data:any) => {
    mouse = { ...mouse,...data };
    overStyle.zIndex = 9;
    underStyle.zIndex = 1;
    overStyle.transform = 'translateY(0)';
    underStyle.transform = 'translateY(0)';
}
// 进入地底
const downMouse = (data:any) => {
    mouse = { ...mouse,...data };
    overStyle.zIndex = 1;
    underStyle.zIndex = 9;
    overStyle.transform = 'translateY(-100vh)';
    //  这里尤其需要注意，因为平移不影响盒子原来位置，上面的盒子一直是在原位置，
    // 所以需要将下面的盒子平移到上面盒子的位置，这样就不会出现盒子重叠的情况
    underStyle.transform = 'translateY(-100vh)';
}


</script>
<style lang="scss" scoped>
.mouseCard{
    margin: 0;
    padding: 0;
    position: relative;
}

</style>
