<!-- 封装的全局输入框组件 用于统一、美化样式、不想一个一个调整 -->
<template>
  <div class="input-container flex_l" :style="{ width: props.width ? props.width : '' }">
     <div class="label-box">
        <label v-if="props.label" :for="props.id">{{ props.label }}</label>
     </div>
     <div class="input-box">
        <input v-model="inputValue" :type="type"  :placeholder="placeholder ? placeholder:'请输入' + label"
        :maxlength="maxlength" :minlength="minlength" :readonly="readonly" :disabled="disabled"
        :style="customStyle" @click.stop="" @focus="handleFocus" @blur="handleBlur" @keydown.enter="submit">
        <slot></slot>
        <el-button type="primary" class="right-icon" v-if="rightIcon" @click="submit">
            <el-icon color="#000" ><Right /></el-icon>
        </el-button>
     </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, withDefaults,onMounted, ref, watch } from 'vue';
import { Right } from '@element-plus/icons-vue';
interface InputProps {
  type?: string;
  placeholder?: string;
  modelValue?: string;
  value?: string;
  disabled?: boolean;
  readonly?: boolean;
  maxlength?: number;
  minlength?: number;
  size?: number;
  name?: string;
  id?: string;
  required?: boolean;
  autofocus?: boolean;
  autocomplete?: string;
  form?: string;
  formnovalidate?: boolean;
  width?: string;
  label?: string;
  customStyle?: any;
  rightIcon?: boolean;
  focus?: boolean;
}

const props = withDefaults(defineProps<InputProps>(), {
    type: 'text',
    modelValue: '',
    value: '',
    placeholder: '',
    disabled: false,
    readonly: false,
    maxlength: 50,
    minlength: 0,
    size: 0,
    name: '',
    id: '',
    required: false,
    autofocus: false,
    autocomplete: 'off',
    form: '',
    formnovalidate: false,
    width: '',
    label:'',
    customStyle: () => ({}),
    rightIcon: false,
    focus: false
});

const inputValue = ref(props.modelValue);
const emit = defineEmits(['update:modelValue','focusChange','submit']);

const submit = () => {
    emit('submit', inputValue.value);
}
const handleFocus = () => {
    if(!props.focus) return;
    emit('focusChange', true);
}
const handleBlur = () => {
    if(!props.focus) return;
    emit('focusChange', false);
}
watch(() => props.modelValue, (newValue) => {
    inputValue.value = newValue;
})

watch(() => inputValue.value, (newValue) => {
  emit('update:modelValue', newValue);
});

</script>
<style lang="scss" scoped>
.input-container{
    padding: 5px 10px;
    .label-box{
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
        color: #fff;
        font-size: 14px;
        font-weight: bold;
    }
    .input-box{
        position: relative;
        flex: 1;
        input{
            min-width: 100%;
            height: 40px;
            border: 1px solid #cee6ff;
            color: #000;
            border-radius: 4px;
            padding: 0 10px;
            box-sizing: border-box;
            &:focus {
                border-color: #2878ff; 
                outline: none; 
            }
            &::placeholder{
                color: #c6c6c6;
            }
        }
        .right-icon{
            position: absolute;
            right: 0;
            top: -1px;
            height: 42px;
            width: 10%;
            z-index: 99;
            border: 1px solid #2878ff;
            border-radius: 0 4px 4px 0;
            background-color: #2878ff;
            &::v-deep .el-icon{
                font-size: 20px;
                color: #000;
            }
            &:hover{
                background-color: #0952c8;
                border: none;
            }
        }
    }
}



</style>
