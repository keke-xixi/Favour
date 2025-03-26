<template>
  <el-dialog
    v-model="showDialog"
    :title="title"
    width="30%"
    align-center
    class="!rounded-lg !pt-0"
  >
    <span class="text-[#242F57] h-4">{{ text }}</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="confirm">
            确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from "vue"

const emit = defineEmits(['delete','update:show']);
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default:''
  },
  text: {
    type: String,
    default:''
  },
});

const showDialog = ref(props.show)
watch(
  () => props.show,
  (val) => {
    showDialog.value = val;
  }
);
watch(() => showDialog.value, (val) => {
    if (!val) {
       emit('update:show', val)
    }
 })
const confirm = () => {
    emit('update:show', false)
    emit('delete')
}
</script>

