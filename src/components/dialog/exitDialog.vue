<template>
    <el-dialog v-model="showDialog" width="70%" :align-center="true" :show-close="false">
        <div class="dialog-content">
            <h1>确认离开该游戏吗？</h1>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="showDialog = false">取消</el-button>
                <el-button type="primary" @click="emit('save')">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue"

const emit = defineEmits(['save', 'update:show']);
const props = defineProps({
    show: {
        type: Boolean,
        required: true
    }
});
const showDialog = ref(props.show);

watch(() => props.show, (val) => {
    showDialog.value = val;
});
watch(() => showDialog.value, (val) => {
    if (!val) {
        emit('update:show', val)
    }
})
onMounted(() => {

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