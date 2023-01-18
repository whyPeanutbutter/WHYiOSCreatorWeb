import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
// 引入 router
import router from './router/index'
// 引入 store
import store from './store/index'
// 引入element-plus
import ElementPlus from 'element-plus'
import '../node_modules/element-plus/theme-chalk/index.css'
createApp(App).use(router).use(store).use(ElementPlus).mount('#app')
