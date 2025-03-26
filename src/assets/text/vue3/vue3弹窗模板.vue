<template>
    <el-dialog v-model="showDialog" width="70%" :align-center="true" :show-close="false">
        <div class="dialog-content">

        </div>
        <template #footer>
            <div class="dialog-footer">

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