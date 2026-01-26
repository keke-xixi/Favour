# 前端VUE 代码规范

**前端VUE 代码规范—黄军欣**

**\[目录规范\]**

**文件夹命名**

采用kebab-case规则，以语义化单词命名。如果为同类功能的文件夹，则一般以复数形式结尾，常用的有components、utils等等。

**组件文件夹命名**

一个复杂组件通常会拆分为多个文件夹，每个文件夹以kebab-case方式命名。

**assets目录**

assets存放静态资源，images, styles, icons、svgs等静态目录以复数形式结尾，静态资源文件以kebab-case形式命名。

**\[组件规范\]**

**组件结构化**

组件编写大部分事件聚焦逻辑，因此将template放在顶层，文件结构可按template、script、style顺序布局。

script可以按props、emits、ref、 computed、watch、methods、events顺序排列代码。每个文件顺序统一，可以使用vscode定义代码片段，按以上顺序添加注释，开发组件直接在对应注释下添加对应代码。

**组件中单引号、双引号**

html中、vue的template中标签属性使用**双引号**

所有js中的字符串使用**单引号**

所有js中的代码行换行，要么统一使用分号";"，要么统一不使用分号，不能混着用。

**组件名命名规范**

采用kebab-case，一个项目必须保持统一，组件名一般不超过2 到 3 个单词，如checkbox-button.vue；

**组件以高优单词开头**

组件命名以高优先单词开头，以描述性单词结尾，重要单词放前面可实现有序排列。例如查询组件，使用Search前缀，输入组件命名为SearchInputXXX，而按钮组件使用SearchButtonXXX。

**父、子组件命名**

和父组件紧密相关的子组件应该以父组件名作为前缀命名，例如：todo-list.vue；todo-list-item.vue；todo-list-item-button.vue

**组件名应使用完整单词**

组件命名不能使用缩写，而应该使用完整单词组成的名称。因为时间一长，或者换个人，可能完全看不出SdSettings组件为何意。由于文件引入一般都有智能提示，因此也不容易出现拼写类错误。

**组件Props命名**

组件props定义使用lowerCamelCase命名，在template中使用组件时，使用kebab-case规则。例如定义greetingText属性，模板使用方式为greeting-text=""。

component

const props = defineProps({

  greetingText: String

})

<WelcomeMessage greeting-text="hi"/>

**组件事件命名规则**

事件命名需要注意定义和template使用。

事件定义：通常使用一个verb定义的事件名居多，例如open、close、click、change、focus、blur、select。对于状态类事件定义一般采用noun + "-" + verb形式，例如state-change、active-change。生命周期类通常采用prep + verb形式表示事件，例如before-enter、after-enter。或者是标识动作的事件，采用verb + "-" + noun。

// verb 

defineEmits(\['open'\]) defineEmits(\['close'\]) defineEmits(\['focus'\]) 

// noun + "-" + verb

 defineEmits(\['state-change'\]) 

// verb + "-" + noun 

defineEmits(\['open-menu'\]) 

// 生命周期

 'before-enter' 'before-leave' 'after-enter' 'after-leave'

// template中使用组件时，注册事件使用kebab-case形式。

<el-pagination

  @size-change="handleSizeChange"

  @current-change="handleCurrentChange"

/>

**template中组件属性设置单独占用一行 例如**

<my-component

  foo="a"

  bar="b"

  baz="c"

/>

**属性赋值规则**

template中属性值使用引号(equoted)包裹。如果值为匿名对象则需要增加空格，保证值可读性。

<input type="text">

<AppSidebar :style="{ width: sidebarWidth + 'px' }">