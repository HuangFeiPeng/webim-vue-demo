<template>
    <div class="app_container">
        <!-- NavBar -->
        <nav-bar v-show="isShowNavBar" :is-actions="true" :is-more="false" :title="navBarTitle" @onSelect="onSelect" />
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
import { useEMMessagesListener } from '@/EaseIM/hooks'
import { useConversationStore } from '@/stores'
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
const fullUnReadNum = computed(() => {
    let sum = 0
    if (converationStore.getConversationListvalues.length) {
        converationStore.getConversationListvalues.forEach((item) => (sum += item.unReadNum))
    }
    return sum || ''
})
//TabBar的显隐
const isShowTabBar = computed(() => {
    console.log('route.meta.needTabBar', route.meta.needTabBar)
    const needTabBar = route.meta.needTabBar
    return needTabBar
})

/* EaseIM Listener */
useEMMessagesListener()
</script>
