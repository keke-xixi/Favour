<template>
    <div class="smart-select">
      <!-- 输入框 -->
      <div class="select-input" @click="toggleDropdown">
        <input
          v-model="searchText"
          type="text"
          placeholder="请选择或搜索..."
          @input="handleSearch"
          @focus="showDropdown = true"
        />
        <span class="arrow" :class="{ 'arrow-up': showDropdown }">▼</span>
      </div>
  
      <!-- 下拉菜单 -->
      <div v-show="showDropdown" class="dropdown-menu">
        <div
          v-for="item in displayOptions"
          :key="item.id"
          class="option-item"
          :class="{ 'selected': selectedItem?.id === item.id }"
          @click="selectItem(item)"
        >
          {{ item.name }}
        </div>
        
        <div v-if="displayOptions.length === 0" class="no-data">
          暂无数据
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  
  interface SelectOption {
    id: string | number
    name: string
  }
  
  interface Props {
    options?: SelectOption[]
    apiUrl?: string
    placeholder?: string
  }
  
  const props = withDefaults(defineProps<Props>(), {
    options: () => [],
    placeholder: '请选择...'
  })
  
  const emit = defineEmits<{
    'update:modelValue': [value: SelectOption | null]
    'change': [value: SelectOption | null]
  }>()
  
  // 响应式数据
  const showDropdown = ref(false)
  const searchText = ref('')
  const selectedItem = ref<SelectOption | null>(null)
  const allOptions = ref<SelectOption[]>([])
  
  // 显示选项（限制数量）
  const displayOptions = computed(() => {
    let filtered = allOptions.value
    
    // 搜索过滤
    if (searchText.value) {
      const keyword = searchText.value.toLowerCase()
      filtered = allOptions.value.filter(item => 
        item.name.toLowerCase().includes(keyword)
      )
    }
    
    // 限制显示数量，避免DOM过多
    return filtered.slice(0, 100)
  })
  
  // 方法
  const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value
  }
  
  const handleSearch = () => {
    // 搜索逻辑已经在computed中处理
  }
  
  const selectItem = (item: SelectOption) => {
    selectedItem.value = item
    searchText.value = item.name
    showDropdown.value = false
    emit('update:modelValue', item)
    emit('change', item)
  }
  
  // 初始化数据
  const initData = () => {
    if (props.options.length > 0) {
      allOptions.value = props.options
    } else {
      // 模拟5w条数据
      allOptions.value = Array.from({ length: 50000 }, (_, index) => ({
        id: index + 1,
        name: `选项 ${index + 1}`
      }))
    }
  }
  
  // 点击外部关闭
  const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.smart-select')) {
      showDropdown.value = false
    }
  }
  
  onMounted(() => {
    initData()
    document.addEventListener('click', handleClickOutside)
  })
  </script>
  
  <style lang="scss" scoped>
  .smart-select {
    position: relative;
    width: 300px;
  }
  
  .select-input {
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    background: white;
    transition: border-color 0.3s;
    
    input {
      border: none;
      outline: none;
      width: 100%;
      background: transparent;
      cursor: pointer;
      font-size: 14px;
      
      &::placeholder {
        color: #c0c4cc;
      }
    }
    
    .arrow {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      transition: transform 0.3s;
      color: #c0c4cc;
      font-size: 12px;
      
      &.arrow-up {
        transform: translateY(-50%) rotate(180deg);
      }
    }
    
    &:hover {
      border-color: #c0c4cc;
    }
    
    &:focus-within {
      border-color: #409eff;
    }
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    z-index: 1000;
    margin-top: 4px;
    max-height: 300px;
    overflow-y: auto;
  }
  
  .option-item {
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    font-size: 14px;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: #f5f7fa;
    }
    
    &.selected {
      background-color: #ecf5ff;
      color: #409eff;
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .no-data {
    padding: 20px;
    text-align: center;
    color: #909399;
    font-size: 14px;
  }
  
  // 滚动条样式
  .dropdown-menu::-webkit-scrollbar {
    width: 6px;
  }
  
  .dropdown-menu::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  .dropdown-menu::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  .dropdown-menu::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
  </style>