import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "about" */ '../views/Login/index.vue'),
        meta: {
            title: '登录',
        },
    },
    {
        path: '/home',
        name: 'home',
        redirect: '/home/conversations',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Home/index.vue'),
        meta: {
            title: '首页',
        },
        children: [
            {
                path: 'conversations',
                name: 'conversations',
                component: () => import('../views/Conversations/index.vue'),
                meta: {
                    title: '最近会话',
                },
            },
            {
                path: 'contacts',
                name: 'contacts',
                component: () => import('../views/Contacts/index.vue'),
                meta: {
                    title: '联系人',
                },
            },
            {
                path: 'me',
                name: 'me',
                component: () => import('../views/Me/index.vue'),
                meta: {
                    title: '我的',
                },
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router
