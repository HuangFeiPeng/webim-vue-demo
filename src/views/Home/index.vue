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
        <router-view></router-view>
        <!-- TabBar -->
        <tab-bar v-show="isShowTabBar" :badge="fullUnReadNum" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteRecordName, RouteLocationNormalizedLoaded } from 'vue-router'
import { useEMMessagesListener, useContactsListener } from '@/EaseIM/hooks'
import { useConversationStore, useSystemNotfiStore } from '@/stores'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'
import './index.scss'
/* 组件 */
import NavBar from '@/layout/NavBar/index.vue'
import TabBar from '@/layout/TabBar/index.vue'
const route: RouteLocationNormalizedLoaded = useRoute()
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

/* EaseIM Listener */
useEMMessagesListener()
useContactsListener()
</script>
