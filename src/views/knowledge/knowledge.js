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
        children: [],
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
    }
]