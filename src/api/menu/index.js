// 模拟后端成功返回的数据 (真实开发中,菜单这些数据应该从后端获取)

/**
 *   不加前缀 /home 就是独立界面，不需要菜单栏  针对主要游戏进行的设计
 */
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
        id: 10
    },
    {
        path: '/knowledge',
        name: '知识点',
        children:[],
        id: 15
    },
    {
        path: '/tool',
        name: '组件',
        children:[],
        id: 20
    },
    {
        path: '/home/wish',
        name: '抽卡',
        children:[],
        id: 30
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
        id: 60
    },
    {
        path: '/home/settings',
        name: '个人中心',
        id: 70
    },
]