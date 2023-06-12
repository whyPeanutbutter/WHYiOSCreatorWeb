// 引入
import { createRouter, createWebHashHistory } from 'vue-router'
import beibei from '../view/beibei.vue'
/* 引入首页 路由 */
import Home from '../view/home.vue'
import phoneHome from '../view/phoneHome.vue'


const Router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/beibei',
        name: 'beibei',
        component: beibei

    },{
        path: '/',//root 目录
        name: 'home',
        component: Home
    },
    {
        path: '/phoneHome',
        name: 'phoneHome',
        component: phoneHome
    }
    ]
})

// 导出
export default Router