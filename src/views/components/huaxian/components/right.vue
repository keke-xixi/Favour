<template>
  <div class="right" style="flex: 1;background-color: tomato;border: 1px solid #ccc;">
    {{ a }}
  </div>
</template>
<script setup lang="ts">
import {ref,reactive} from "vue"

const props = defineProps({
    a:{
        type:Number,
        default:0
    },
})

const obj = reactive({
    name:"张三",
})

const obj2 = ref({
    name:"张三",
})

</script>
<style lang="scss" scoped>
.right{
    height: 500px;
}



</style>
