/** 
 * 知识点分类
 *      { name: '基本合并技巧', url: "#",level: 3, children: [], active: false,id: 112 },
        {
            id: 1,   // 分类id 
            name: 'hiprint',  // 大分类名称
            url: "hiprint",    // 大分类路由
            level: 1,   // 大分类层级
            active: false,  // 大分类是否激活
            children: [],
        }
*/
export const Knowledge_List = [
    {
        id: 1,
        name: 'vxeTable',
        url: "/vxeTable",
        level: 1,
        active: false,
        children: [
            { name: '清空表格数据', url: "./components/vxeTable/1",level: 2, children: [], active: false,id: 11,description: '用于表格联动时，清空表格数据'  },
            { name: '工具栏配置', url: "./components/vxeTable/2",level: 2, children: [], active: false,id: 12 },
            { name: '时间', url: "./components/vxeTable/3",level: 2, children: [], active: false,id: 13 },
            { name: '单选多选', url: "./components/vxeTable/4",level: 2, children: [], active: false,id: 14 },
            { name: '更新', url: "./components/vxeTable/5",level: 2, children: [], active: false,id: 15 },
        ]
    },
    {
        id: 2,
        name: 'work',
        url: "/work",
        level: 1,
        active: false,
        children: [
            { name: '字典', url: "./components/work/1",level: 2, children: [], active: false,id: 21 },
            { name: '请求', url: "./components/work/2",level: 2, children: [], active: false,id: 22 },
            { name: '常用笔记', url: "./components/work/3",level: 2, children: [], active: false,id: 23 },
        ],
    },
    {
        id: 3,
        name: 'hiprint',
        url: "/hiprint",
        level: 1,
        active: false,
        children: [
            { name: '表格单元头样式修改', url: "./components/hiprint/1", level: 2, children: [], active: false,id: 31,description: '改变表头单元格样式' },
            { name: '表格内容渲染函数', url: "./components/hiprint/2", level: 2, children: [], active: false,id: 32,description: '用于动态渲染表格' },
            { name: '底部聚合格式化函数', url: "./components/hiprint/3", level: 2, children: [], active: false,id: 33,description: '用于合计、统计' },
            { name: '表格样式函数', url: "./components/hiprint/4", level: 2, children: [], active: false,id: 34,description: '用于改变表格整体样式、行高、列宽、颜色、字体等其它属性' },
            { name: '行/列合并函数', url: "./components/hiprint/5", level: 2, children: [], active: false,id: 35,description: '用于合并单元格(内容)' },
            { name: 'html模板', url: "./components/hiprint/6", level: 2, children: [], active: false,id: 36,description: '直接把html代码复制到字符串中，可直接渲染' },
            { name: '打印时候自定义样式', url: "./components/hiprint/7", level: 2, children: [], active: false,id: 37,description: '调整<style></style>标签中的样式 改变样式' },
            { name: '多报表预览', url: "./components/hiprint/8", level: 2, children: [], active: false,id: 38,description: 'newHtml[0] 是div元素' },
            { name: '文档', url: "./components/hiprint/9", level: 2, children: [], active: false,id: 39,description: '' },
            { name: '格式化函数', url: "./components/hiprint/10", level: 2, children: [], active: false,id: 310,description: '普通文本框使用自定义字段计算时候，需要格式化函数' },
        ],
    },
    {
        id: 4,
        name: 'element',
        url: "/element",
        level: 1,
        active: false,
        children: [
            { name: '输入框', url: "./components/element/1",level: 2, children: [], active: false,id: 41 },
        ],
    },
    {
        id: 5,
        name: 'vue',
        url: "/vue",
        level: 1,
        active: false,
        children: [
            { name: '样式', url: "./components/vue/1",level: 2, children: [], active: false,id: 51 },
        ],
    },
    {
        id: 6,
        name: 'js',
        url: "/js",
        level: 1,
        active: false,
        children: [
            { name: '数组和字符串转换', url: "./components/js/1",level: 2, children: [], active: false,id: 61 },
        ],
    },
    {
        id: 7,
        name: 'echart',
        url: "/echart",
        level: 1,
        active: false,
        children: [
            { name: 'echart组件模板', url: "./components/echart/1",level: 2, children: [], active: false,id: 71, description: 'echart组件模板示例' },
        ],
    },
    {
        id: 8,
        name: 'study',
        url: "/study",
        level: 1,
        active: false,
        children: [
            { name: '去掉字符串中的元素标记', url: "./components/study/1",level: 2, children: [], active: false,id: 81, description: '去掉字符串中的元素标记 返回纯文本' },
            { name: '将颜色灰度化', url: "./components/study/2",level: 2, children: [], active: false,id: 82, description: '' },
            { name: '给fetch 添加超时功能', url: "./components/study/3",level: 2, children: [], active: false,id: 83, description: '请求接口数据时候、设置超时时间' },
            { name: '不规则文字', url: "./components/study/4",level: 2, children: [], active: false,id: 84, description: '' },
            { name: '知识点5', url: "./components/study/5",level: 2, children: [], active: false,id: 85, description: '' },
            { name: '知识点6', url: "./components/study/6",level: 2, children: [], active: false,id: 86, description: '' },
            { name: '知识点7', url: "./components/study/7",level: 2, children: [], active: false,id: 87, description: '' },
            { name: '知识点8', url: "./components/study/8",level: 2, children: [], active: false,id: 88, description: '' },
            { name: '知识点9', url: "./components/study/9",level: 2, children: [], active: false,id: 89, description: '' },
            { name: '知识点10', url: "./components/study/10",level: 2, children: [], active: false,id: 90, description: '' },
        ],
    }
]