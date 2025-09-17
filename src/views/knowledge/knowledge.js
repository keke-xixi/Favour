/** 
 * 知识点分类
*/
export const Knowledge_List = [
    {
        id: 1,
        name: 'hiprint',
        url: "hiprint",
        level: 1,
        active: false,
        children: [
            {
                id: 11,
                name: '合并单元格',
                url: "",
                level: 2,
                active: false,
                children: [
                { name: '基本合并技巧', url: "#",level: 3, children: [], active: false,id: 112 },
                { name: '复杂表格合并', url: "#",level: 3, children: [], active: false,id: 113 },
                ]
            },
            {
                id: 12,
                name: '多列合并',
                url: "",
                level: 2,
                active: false,
                children: [
                { name: '列合并原理', url: "#",level: 3, children: [], active: false,id: 122 },
                { name: '实战应用', url: "#",level: 3, children: [], active: false,id: 123 },
                ]
            },
            {
                id: 13,
                name: '打印设置',
                url: "",
                level: 2,
                children: [
                
                ],
                active: false
            }
        ]
    },
    {
        id: 2,
        name: 'vxeTable',
        url: "vxeTable",
        level: 1,
        active: false,
        children: [
            {
                id: 21,
                name: 'tableMethods',
                url: "",
                level: 2,
                children: [
                { name: '常用方法', url: "#",level: 3, children: [],id: 211 ,active: false },
                { name: '高级技巧', url: "#",level: 3, children: [],id: 212 ,active: false }
                ]
            },
        ]
    }
]