import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useLoginStore } from '@/stores'
NProgress.configure({
    speed: 200,
    minimum: 0.02,
    trickleSpeed: 200,
    showSpinner: false,
})
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
                    needNavBar: true,
                },
            },
            {
                path: 'contacts',
                name: 'contacts',
                component: () => import('../views/Contacts/index.vue'),
                meta: {
                    title: '联系人',
                    needNavBar: true,
                },
            },
            {
                path: 'me',
                name: 'me',
                component: () => import('../views/Me/index.vue'),
                meta: {
                    title: '我的',
                    needNavBar: false,
                },
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})
//登录校验
router.beforeEach((to, from, next) => {
    NProgress.start()
    const loginStore = useLoginStore()
    if (to.name !== 'login' && !loginStore.isLogined) {
        next({ path: '/' })
    } else {
        next()
    }
})
router.afterEach(() => {
    if (NProgress.isStarted()) {
        NProgress.done()
    }
})
export default router
