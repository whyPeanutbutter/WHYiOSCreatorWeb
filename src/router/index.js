// 引入
import {  createRouter, createWebHashHistory} from 'vue-router'
/* 引入首页 路由 */
import Home from '../view/home.vue'
import layout from '../view/layout.vue'

const Router = createRouter({
    history: createWebHashHistory(),
    routes:[{
        path:'/',
        name:'home',
        component:Home
    },
{
    path:'/layout',
    name:'layout',
    component:layout

}]
})

// 导出
export default Router