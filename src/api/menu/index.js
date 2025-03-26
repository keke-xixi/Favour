// 模拟后端成功返回的数据 (真实开发中,菜单这些数据应该从后端获取)
export default  [
    {
        path: '/home',
        name: 'home',
        children:[
            {
                path: '/home/welcome',
                name: 'welcome',
            }
        ],
        id: 1
    },
    {
        path: '/home/play',
        name: 'shop',
        children:[
            {
                path: '/home/game',
                name: 'game',
            }
        ],
        id: 2
    },
    {
        path: '/home/settings',
        name: 'settings',
        id: 3
    },
]