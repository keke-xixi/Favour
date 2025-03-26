<template>
    <el-dialog v-model="showDialog" width="60%" :align-center="true" :show-close="false"
    :style="{backgroundColor: 'transparent !important', border: 'none !important'}">
        <div class="dialog-content">
           <h1 class="z-h1">{{ text }}</h1>
        </div>
        <template #footer>
            <div class="dialog-footer">

            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue"

const emit = defineEmits(['back', 'update:show']);
const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    text:{
        type: String,
        default: '闯关失败'
    }
});
const showDialog = ref(false);

watch(() => props.show, (val) => {
    showDialog.value = val;
    setTimeout(() => {
        emit('update:show', false);
        emit('back');
    },2000)
});
watch(() => showDialog.value, (val) => {
    if (!val) {
        emit('update:show', val);
        emit('back', val);
    }
})
onMounted(() => {
   nextTick(() => {
        
   })
})

</script>

<style lang="scss" scoped>
.dialog-content {
    width: 100%;
}
.dialog-footer {
    width: 100%;
}
</style>