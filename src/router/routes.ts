
import { RouteRecordRaw } from 'vue-router';
import Layout from '../views/home/index.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue')
    }, 
    {
        path: '/home',
        name: 'home',
        component: Layout,
        children:[
            {
                path: '',
                name: 'main',
                component: () => import('@/views/home/main.vue')
            },
            {
                path: 'play',
                name: 'play',
                component: () => import('@/views/play/index.vue')
            },
            {
                path: 'settings',
                name: 'settings',
                component: () => import('@/views/settings/index.vue')
            },
            {
                path: 'wish',
                name: 'wish',
                component: () => import('@/views/wish/index.vue')
            }, 
            {
                path: 'knowledge',
                name: 'knowledge',
                component: () => import('@/views/knowledge/index.vue')
            }, 
            {
                path: 'test',
                name: 'test',
                component: () => import('@/views/test/index.vue')
            }, 
        ]
    },
    {
        path: '/tool',
        name: 'tool',
        component: () => import('@/views/tool/index.vue')
    }, 
    {
        path: '/tank',
        name: 'tank',
        component: () => import('@/views/components/tank/index.vue')
    },   
    {
        path: '/mouse',
        name: 'mouse',
        component: () => import('@/views/components/mouse/index.vue')
    },  
    {
        path: '/mouseMain',
        name: 'mouseMain',
        component: () => import('@/views/components/mouse/main.vue')
    },   
    {
        path: '/huaxian',
        name: 'huaxian',
        component: () => import('@/views/components/huaxian/index.vue')
    },   
    {
        path: '/jijia',
        name: 'jijia',
        component: () => import('@/views/components/jijia/index.vue')
    }, 
    {
        path: '/moonlight',
        name: 'moonlight',
        component: () => import('@/views/components/moonlight/index.vue')
    }, 
    {
        path: '/oxenHorses',
        name: 'oxenHorses',
        component: () => import('@/views/components/oxenHorses/index.vue')
    }, 
    {
        path: '/malou',
        name: 'malou',
        component: () => import('@/views/components/malou/index.vue')
    }, 
    // 404页面
    {
        path: '/:catchAll(.*)',
        name: '404',
        component: () => import('@/views/404.vue')
    }
]

export default routes
