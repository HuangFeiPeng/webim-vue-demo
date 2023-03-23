<template>
    <div class="app_container">
        <!-- NavBar -->
        <nav-bar
            v-show="isShowNavBar"
            :is-back="isShowBack"
            :is-actions="isShowAction"
            :is-more="false"
            :title="navBarTitle"
            @onSelect="onSelect"
        />
        <!-- Main -->
        <router-view v-slot="{ Component }">
            <keep-alive :include="routerKeepAliveList">
                <component :is="Component" />
            </keep-alive>
        </router-view>
        <!-- TabBar -->
        <tab-bar v-show="isShowTabBar" :badge="fullUnReadNum" />
    </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteRecordName, RouteLocationNormalizedLoaded } from 'vue-router'
import { useEMMessagesListener, useContactsListener } from '@/EaseIM/hooks'
import { useRouterKeepAliveStore, useConversationStore, useSystemNotfiStore } from '@/stores'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'
import './index.scss'
/* 组件 */
import NavBar from '@/layout/NavBar/index.vue'
import TabBar from '@/layout/TabBar/index.vue'
import router from '@/router'
const route: RouteLocationNormalizedLoaded = useRoute()
/* keep-alive */
const routerKeepAliveStore = useRouterKeepAliveStore()
const routerKeepAliveList = computed(() => {
    return routerKeepAliveStore.keepAliveComponentList
})
/* NavBar */
//是否展示NavBar
const isShowNavBar = computed(() => {
    const needNavBar = route.meta.needNavBar
    return needNavBar
})
const isShowBack = computed(() => {
    const isShowBack = (route.meta?.needBack as boolean) || false
    return isShowBack
})
const isShowAction = computed(() => {
    const isShowAction = (route.meta?.needAction as boolean) || false
    return isShowAction
})
/* 标题国际化 */
const { t } = useI18n()
const navBarTitle = computed(() => {
    const title: RouteRecordName = route.name || '标题'
    return t(`layout.navbar.${String(title)}`)
})
//navBar select触发
const onSelect = (type: string) => {
    console.log('>>>>>>', type)
    //添加好友
    if (type === 'manager') {
        router.push('addfriends')
    }
    if (type === 'friends') {
        //nextToRouterName 为选择联系人页面点击完成所需跳转的路由name
        router.push({ name: 'selectcontacts', query: { nextToRouterName: 'creategroups' } })
    }
}

/* TabBar */
const converationStore = useConversationStore()
const systemNotfiStore = useSystemNotfiStore()
//tabbar未读数
const fullUnReadNum = computed(() => {
    let sum = 0
    if (converationStore.getConversationListvalues.length) {
        converationStore.getConversationListvalues.forEach((item) => (sum += item.unReadNum))
    }
    if (systemNotfiStore.unReadNotifCount > 0) {
        sum += systemNotfiStore.unReadNotifCount
    }
    return sum || ''
})
//TabBar的显隐
const isShowTabBar = computed(() => {
    const needTabBar = route.meta.needTabBar
    return needTabBar
})

const Instance = getCurrentInstance()
console.log('>>>>Instance', Instance)
/* EaseIM Listener */
useEMMessagesListener()
useContactsListener()
</script>
