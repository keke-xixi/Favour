// 模拟后端成功返回的数据 (真实开发中,菜单这些数据应该从后端获取)
export default  [
    {
        path: '/home',
        name: '首页',
        children:[
            {
                path: '/home/welcome',
                name: 'welcome',
            }
        ],
        id: 1
    },
    {
        path: '/tool',
        name: '组件',
        children:[],
        id: 2
    },
    {
        path: '/home/wish',
        name: '抽卡',
        children:[],
        id: 3
    },
    {
        path: '/home/play',
        name: '商城',
        children:[
            {
                path: '/home/game',
                name: 'game',
            }
        ],
        id: 6
    },
    {
        path: '/home/settings',
        name: '个人中心',
        id: 7
    },
]