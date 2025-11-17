<template>
    <div class="virtual-select-container">
      <!-- 搜索输入框 -->
      <div class="select-input" @click="toggleDropdown">
        <input
          v-model="searchText"
          type="text"
          placeholder="请输入搜索关键词..."
          @input="handleSearch"
          @focus="showDropdown = true"
        />
        <span class="arrow" :class="{ 'arrow-up': showDropdown }">▼</span>
      </div>
  
      <!-- 下拉框 -->
      <div v-show="showDropdown" class="dropdown-container">
        <!-- 虚拟滚动容器 -->
        <div
          ref="scrollContainer"
          class="virtual-scroll-container"
          @scroll="handleScroll"
        >
          <!-- 撑开容器高度的占位元素 -->
          <div
            class="scroll-placeholder"
            :style="{ height: totalHeight + 'px' }"
          ></div>
          
          <!-- 可视区域选项 -->
          <div
            class="options-container"
            :style="{ transform: `translateY(${offsetY}px)` }"
          >
            <div
              v-for="item in visibleOptions"
              :key="item.id"
              class="option-item"
              :class="{ 'selected': selectedItem?.id === item.id }"
              @click="selectItem(item)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
  
        <!-- 加载状态 -->
        <div v-if="loading" class="loading">加载中...</div>
        
        <!-- 无数据提示 -->
        <div v-if="!loading && filteredOptions.length === 0" class="no-data">
          暂无数据
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch, nextTick } from 'vue'
  
  // 类型定义
  interface SelectOption {
    id: string | number
    name: string
    [key: string]: any
  }
  
  // Props
  interface Props {
    options?: SelectOption[]
    apiUrl?: string
    pageSize?: number
    placeholder?: string
  }
  
  const props = withDefaults(defineProps<Props>(), {
    options: () => [],
    apiUrl: '',
    pageSize: 50,
    placeholder: '请输入搜索关键词...'
  })
  
  // Emits
  const emit = defineEmits<{
    'update:modelValue': [value: SelectOption | null]
    'change': [value: SelectOption | null]
  }>()
  
  // 响应式数据
  const showDropdown = ref(false)
  const searchText = ref('')
  const selectedItem = ref<SelectOption | null>(null)
  const loading = ref(false)
  const allOptions = ref<SelectOption[]>([])
  const filteredOptions = ref<SelectOption[]>([])
  const currentPage = ref(1)
  const hasMore = ref(true)
  
  // 虚拟滚动相关
  const scrollContainer = ref<HTMLElement>()
  const itemHeight = 40 // 每个选项的高度
  const visibleCount = 10 // 可视区域显示的选项数量
  const startIndex = ref(0)
  const scrollTop = ref(0)
  
  // 计算属性
  const totalHeight = computed(() => filteredOptions.value.length * itemHeight)
  const offsetY = computed(() => startIndex.value * itemHeight)
  const visibleOptions = computed(() => {
    const endIndex = Math.min(
      startIndex.value + visibleCount + 5, // 多渲染几个避免滚动时空白
      filteredOptions.value.length
    )
    return filteredOptions.value.slice(startIndex.value, endIndex)
  })
  
  // 方法
  const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value
  }
  
  const handleScroll = () => {
    if (!scrollContainer.value) return
    
    scrollTop.value = scrollContainer.value.scrollTop
    startIndex.value = Math.floor(scrollTop.value / itemHeight)
    
    // 检查是否需要加载更多
    const scrollBottom = scrollTop.value + scrollContainer.value.clientHeight
    if (scrollBottom >= totalHeight.value - 100 && hasMore.value && !loading.value) {
      loadMoreData()
    }
  }
  
  const handleSearch = debounce(async () => {
    currentPage.value = 1
    hasMore.value = true
    filteredOptions.value = []
    
    if (props.apiUrl) {
      await fetchData()
    } else {
      filterLocalData()
    }
  }, 300)
  
  const filterLocalData = () => {
    if (!searchText.value.trim()) {
      filteredOptions.value = allOptions.value
      return
    }
    
    const searchLower = searchText.value.toLowerCase()
    filteredOptions.value = allOptions.value.filter(item =>
      item.name.toLowerCase().includes(searchLower)
    )
  }
  
  const fetchData = async () => {
    if (loading.value) return
    
    loading.value = true
    try {
      // 模拟API调用
      const response = await mockApiCall({
        keyword: searchText.value,
        page: currentPage.value,
        pageSize: props.pageSize
      })
      
      if (currentPage.value === 1) {
        filteredOptions.value = response.data
      } else {
        filteredOptions.value.push(...response.data)
      }
      
      hasMore.value = response.hasMore
      currentPage.value++
      
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      loading.value = false
    }
  }
  
  const loadMoreData = async () => {
    if (props.apiUrl) {
      await fetchData()
    }
  }
  
  const selectItem = (item: SelectOption) => {
    selectedItem.value = item
    searchText.value = item.name
    showDropdown.value = false
    emit('update:modelValue', item)
    emit('change', item)
  }
  
  // 模拟API调用
  const mockApiCall = (params: any): Promise<{ data: SelectOption[], hasMore: boolean }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟搜索逻辑
        let data = generateMockData(50000)
        if (params.keyword) {
          data = data.filter(item => 
            item.name.toLowerCase().includes(params.keyword.toLowerCase())
          )
        }
        
        const start = (params.page - 1) * params.pageSize
        const end = start + params.pageSize
        const result = data.slice(start, end)
        
        resolve({
          data: result,
          hasMore: end < data.length
        })
      }, 300)
    })
  }
  
  // 生成模拟数据
  const generateMockData = (count: number): SelectOption[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      name: `选项 ${index + 1} - ${Math.random().toString(36).substring(2, 8)}`
    }))
  }
  
  // 防抖函数
  function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(null, args), delay)
    }
  }
  
  // 生命周期
  onMounted(async () => {
    if (props.options.length > 0) {
      allOptions.value = props.options
      filteredOptions.value = props.options
    } else if (props.apiUrl) {
      await fetchData()
    }
  })
  
  // 点击外部关闭下拉框
  const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.virtual-select-container')) {
      showDropdown.value = false
    }
  }
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })
  </script>
  
  <style lang="scss" scoped>
  .virtual-select-container {
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
    
    input {
      border: none;
      outline: none;
      width: 100%;
      background: transparent;
      cursor: pointer;
      
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
  
  .dropdown-container {
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
    max-height: 400px;
    overflow: hidden;
  }
  
  .virtual-scroll-container {
    height: 400px;
    overflow-y: auto;
    position: relative;
  }
  
  .scroll-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
  
  .options-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
  
  .option-item {
    height: 40px;
    line-height: 40px;
    padding: 0 12px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
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
  
  .loading, .no-data {
    padding: 20px;
    text-align: center;
    color: #909399;
    background: white;
  }
  
  .loading {
    color: #409eff;
  }
  
  // 滚动条样式
  .virtual-scroll-container::-webkit-scrollbar {
    width: 6px;
  }
  
  .virtual-scroll-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  .virtual-scroll-container::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  .virtual-scroll-container::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
  </style>