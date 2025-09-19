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
            { name: '清空表格数据', url: "./components/vxeTable/1",level: 2, children: [], active: false,id: 12 },
        ]
    },
    {
        id: 2,
        name: 'work',
        url: "/work",
        level: 1,
        active: false,
        children: [],
    },
    {
        id: 3,
        name: 'hiprint',
        url: "/hiprint",
        level: 1,
        active: false,
        children: [],
    }
]