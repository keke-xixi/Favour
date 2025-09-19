import { createApp } from 'vue'
import router from './router'
import store from './store'
import App from './App.vue';
import './assets/css/global.scss'  // 全局css样式 一般用于改变elementPlus样式
import './assets/css/table.scss'
import './assets/css/form.scss';
import './assets/css/color.scss'   
import './assets/css/unit.scss';  // 自制css样式
import './assets/css/other.scss';  // 其他css样式
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import ZInput from './components/ZInput.vue';

console.warn = () => { }

let app = createApp(App)
app.component('ZInput', ZInput);
app.use(router)
app.use(ElementPlus)
app.use(store)
app.mount('#app')
