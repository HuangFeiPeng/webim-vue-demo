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
        component: () => import(/* webpackChunkName: "about" */ '../views/Home/Home.vue'),
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
                    needTabBar: true,
                    needAction: true,
                },
            },
            {
                path: 'contacts',
                name: 'contacts',
                component: () => import('../views/Contacts/index.vue'),
                meta: {
                    title: '联系人',
                    needNavBar: true,
                    needTabBar: true,
                },
            },
            {
                path: 'me',
                name: 'me',
                component: () => import('../views/Me/index.vue'),
                meta: {
                    title: '我的',
                    needNavBar: false,
                    needTabBar: true,
                },
            },
            {
                path: 'chat',
                name: 'chat',
                component: () => import('../views/Chat/index.vue'),
                meta: {
                    title: '聊天',
                    needNavBar: false,
                    needAction: false,
                },
            },
            {
                path: 'systemnotification',
                name: 'systemnotification',
                component: () => import('../views/SystemNotification/index.vue'),
                meta: {
                    title: '系统通知',
                    needNavBar: true,
                    needTabBar: false,
                    needBack: true,
                    needMore: false,
                },
            },
            {
                path: 'selectcontacts',
                name: 'selectcontacts',
                component: () => import('../views/SelectContacts/index.vue'),
                meta: {
                    title: '选择联系人',
                    needNavBar: false,
                    needTabBar: false,
                    needBack: true,
                    needMore: false,
                },
            },
            {
                path: 'addfriends',
                name: 'addfriends',
                component: () => import('../views/AddFriends/index.vue'),
                meta: {
                    title: '添加好友',
                    needNavBar: true,
                    needTabBar: false,
                    needBack: true,
                    needMore: false,
                },
            },
            {
                path: 'creategroups',
                name: 'creategroups',
                component: () => import('../views/CreateGroups/index.vue'),
                meta: {
                    title: '创建群组',
                    needNavBar: false,
                    needTabBar: false,
                    needBack: false,
                    needMore: false,
                },
            },
            {
                path: 'editgroupdescription',
                name: 'editgroupdescription',
                component: () => import('../views/CreateGroups/editGroupDesc.vue'),
                meta: {
                    title: '编辑群组详情',
                    needNavBar: false,
                    needTabBar: false,
                    needBack: false,
                    needMore: false,
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
