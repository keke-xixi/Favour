import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./routes";
import {  done } from "nprogress"; // 导入进度条
import { ElMessage,ElMessageBox } from "element-plus";
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.path === '/' || to.path === '/login') {
        next()
        return
    }
    const val = JSON.parse(localStorage.getItem('onlineUser') || '{}');
    if(val !== null && typeof val === 'object' && Object.keys(val).length === 0){
        ElMessageBox.alert('请先登录！', '提示', {
            confirmButtonText: 'OK',
            callback: () => {
                next('/')
            },
          })
    }else{
        next()
    }
});

router.afterEach((to, from) => {
    done()
});

export default router;
