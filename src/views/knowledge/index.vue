<template>
  <div class="knowledge">
    <div class="app-container">
      <div class="category-panel">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <el-input type="text" v-model="searchQuery" placeholder="搜索分类..."/>
        </div>

        <!-- 渲染左侧数据 -->
        <div class="category-list">
          <li v-for="(category, index) in filteredCategories" :key="index" class="category-item1" 
              :class="{ active: selectedCategory === category }" @click.stop="handleClickMenu(category, 1)">
            <a class="category-link" @click="selectCategory(category)">
              <span>{{ category.name }}</span>
              <i v-if="category.children.length" class="fas" 
                 :class="isExpanded(category) ? 'fa-chevron-down' : 'fa-chevron-right'" 
                 @click.stop="toggleCategory(category)"></i>
                 <el-icon :style="{ transform: category.active ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.5s' }"><ArrowUp /></el-icon>
            </a>
            <ul v-if="category.children.length && category.active" class="category-children" 
                :class="{ expanded: isExpanded(category) }">
              <li v-for="(child, childIndex) in category.children" :key="childIndex" class="category-item2" 
                  :class="{ active: selectedCategory === child }" @click.stop="handleClickMenu(child, 2)">
                <a class="category-link" @click="selectCategory(child)">
                  <span>{{ child.name }}</span>
                  <i v-if="child.children.length" class="fas" 
                     :class="isExpanded(child) ? 'fa-chevron-down' : 'fa-chevron-right'" 
                     @click.stop="toggleCategory(child)"></i>
                  <el-icon :style="{ transform: child.active ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.5s' }"><ArrowUp /></el-icon>
                </a>
                
                <ul v-if="child.children.length && child.active" class="category-children" 
                    :class="{ expanded: isExpanded(child) }">
                  <li v-for="(grandChild, grandIndex) in child.children" :key="grandIndex" class="category-item3" 
                      :class="{ active: selectedCategory === grandChild }" @click.stop="handleClickMenu(grandChild, 3)">
                    <a class="category-link" @click="selectCategory(grandChild)">
                      <span>{{ grandChild.name }}</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content-panel">
        <div class="content-header">
          <h2>{{ selectedCategory ? selectedCategory.name : '请选择分类' }}</h2>
          <p v-if="selectedCategory">{{ selectedCategory.children.length }}个子分类，{{ getContentCount(selectedCategory) }}个知识点</p>
        </div>
        
        <div v-if="selectedCategory && getContentItems(selectedCategory).length">
          <div class="content-grid">
            <div v-for="(item, index) in getContentItems(selectedCategory)" :key="index" class="knowledge-card">
              <h3>{{ item.name }}</h3>
              <p>这里是关于"{{ item.name }}"的详细说明和知识点内容。</p>
              <div class="card-footer">
                <a :href="item.url || '#'" class="url-link" v-if="item.url">
                  <i class="fas fa-external-link-alt"></i> 查看详情
                </a>
                <span v-else class="url-link">暂无链接</span>
                <span class="date">2023-08-15</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <i class="fas fa-folder-open"></i>
          <h3>暂无内容</h3>
          <p>当前分类没有可显示的内容</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed,nextTick } from "vue"
import { ArrowUp } from "@element-plus/icons-vue"
import { Knowledge_List } from './knowledge.js'

// 知识点清单
interface KnowledgeItem {
  id?: number
  name: string
  url: string
  level: number  // 第几级菜单
  active?: boolean  // 是否激活
  children: KnowledgeItem[]
}

// 所有分类
const knowledgeList = ref<KnowledgeItem[]>(Knowledge_List)

const expandedCategories = ref<Set<KnowledgeItem>>(new Set())  // 展开的分类
const searchQuery = ref<string>('')  // 搜索查询

// 计算展开的分类数量
const expandedCount = computed(() => expandedCategories.value.size);

const selectedCategory = ref<KnowledgeItem | null>(null);   // 当前选中的分类

const lastClickedCategory = ref<KnowledgeItem | null>(null); // 上次点击的分类

// 点击分类 111
const handleClickMenu = (category: KnowledgeItem, level: number) => {
  if(lastClickedCategory.value === category) {  // 如果上次点击的分类和当前点击的分类相同
    category.active = category.active ? false : true;
  }
  nextTick(() => {
    lastClickedCategory.value = category; // 更新上次点击的分类
  })
}

// 过滤分类
const filteredCategories = computed(() => {
  if (!searchQuery.value) return knowledgeList.value
  
  const query = searchQuery.value.toLowerCase()
  return knowledgeList.value.filter(category => {
    return category.name.toLowerCase().includes(query) || 
           category.children.some(child => child.name.toLowerCase().includes(query))
  })
})

// 检查分类是否展开
const isExpanded = (category: KnowledgeItem): boolean => {
  return expandedCategories.value.has(category)
}

// 切换分类展开状态
const toggleCategory = (category: KnowledgeItem): void => {
  if (expandedCategories.value.has(category)) {
    expandedCategories.value.delete(category)
  } else {
    expandedCategories.value.add(category)
  }
}

// 选择分类
const selectCategory = (category: KnowledgeItem): void => {
  selectedCategory.value = category
  // 自动展开父分类
  if (category.children.length && !expandedCategories.value.has(category)) {
    expandedCategories.value.add(category)
  }
}

// 获取分类下的所有内容项
const getContentItems = (category: KnowledgeItem): KnowledgeItem[] => {
  const items: KnowledgeItem[] = []
  
  // 添加当前分类的直接子项（没有子分类的项）
  category.children.forEach(child => {
    if (child.children.length === 0) {
      items.push(child)
    }
  })
  
  return items
}

// 获取分类下的内容数量
const getContentCount = (category: KnowledgeItem): number => {
  return getContentItems(category).length
}

// 初始化：展开第一个分类
if (knowledgeList.value.length > 0) {
  expandedCategories.value.add(knowledgeList.value[0])
  selectedCategory.value = knowledgeList.value[0]
}
</script>

<style lang="scss" scoped>
.knowledge {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.app-header {
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    color: #2c3e50;
    font-size: 2.5rem;
    margin-bottom: 10px;
  }
  
  p {
    color: #7f8c8d;
    font-size: 1.1rem;
  }
}

.app-container {
  display: flex;
  gap: 20px;
//   border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  min-height: 600px;
  width: 100%;
  height: 100%;
}

// 左侧背景色
.category-panel {
  width: 300px;
//   background: linear-gradient(to bottom, #2c3e50,#cce3ec, #246a95);
  color: white;
  padding: 15px;
  padding-bottom: 0px;
  border: 2px solid #167f5d;
  height: calc(100% - 100px);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.search-box {
  margin-bottom: 20px;
  position: relative;
  height: 40px;
  input {
    width: 100%;
    padding: 12px 15px 12px 40px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
  }
  
  i {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #7f8c8d;
  }
}

// 左侧大盒子
.category-list {
  list-style: none;
  height: calc(100% - 100px);
  overflow-y: scroll;
  padding-right: 30px;
  transition: all 0.3s ease;
}
.category-list::-webkit-scrollbar {
  transform: translateX(60px) translateY(0px);
  width: 4px;
}

.category-list::-webkit-scrollbar-track {
  background: #fff;  // 轨道颜色
}

.category-list::-webkit-scrollbar-thumb {
  background: #0077d4; // 滚动条颜色
  border-radius: 3px;
}

.category-list::-webkit-scrollbar-thumb:hover {
  background: #fff;
}

// 左侧tab 栏 按层级划分
// 1 级
.category-item1 {
  margin-bottom: 5px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    background: #167e5e;
  }
}
// 2 级
.category-item2 {
  margin-bottom: 5px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    background: #f26804;
  }
}
// 3 级
.category-item3 {
  margin-bottom: 5px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    background: #3498db;
  }
}

.category-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  color: white;
  text-decoration: none;
  cursor: pointer;
}

.category-children {
  list-style: none;
  padding-left: 20px;
  margin-top: 5px;
  max-height: 0;
  overflow: hidden;
  transition: all 1s ease !important;
  
  &.expanded {
    max-height: 1000px;
  }
}

.content-panel {
  flex: 1;
  padding: 25px;
  background: #ebf0fa;
  border: 2px solid #167f5d;
}

.content-header {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  
  h2 {
    color: #2c3e50;
    font-size: 1.8rem;
  }
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.knowledge-card {
  border-radius: 10px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-left: 4px solid #3498db;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  h3 {
    color: #2c3e50;
    margin-bottom: 10px;
    font-size: 1.2rem;
  }
  
  p {
    color: #7f8c8d;
    margin-bottom: 15px;
    font-size: 0.95rem;
  }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .url-link {
    color: #3498db;
    text-decoration: none;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 5px;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #7f8c8d;
  
  i {
    font-size: 3rem;
    margin-bottom: 15px;
    color: #bdc3c7;
  }
}
</style>