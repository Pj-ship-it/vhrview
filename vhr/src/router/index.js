import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


export const constantRoutes = [
    {
        path: '/',
        name: 'login',
        component: () => import('@/views/login'),
        hidden: true
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/Home'),
        hidden: true,
        meta: {
            roles: ['admin', 'user']
        }
    },
    {
        path: '*',
        redirect: '/home'
    }
]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({y: 0}),
    routes: constantRoutes
})
