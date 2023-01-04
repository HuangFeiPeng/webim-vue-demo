<template>
    <div class="app_container">
        <!-- NavBar -->
        <nav-bar v-show="isShowNavBar" @onClickRightBtn="onClickRightBtn" />
        <!-- Main -->
        <router-view></router-view>
        <!-- TabBar -->
        <tab-bar />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useEMMessagesListener } from '@/EaseIM/hooks'
import './index.scss'
import NavBar from '@/layout/NavBar/index.vue'
import TabBar from '@/layout/TabBar/index.vue'
const route = useRoute()
/* NavBar */
//是否展示NavBar
const isShowNavBar = computed(() => {
    const needNavBar = route.meta.needNavBar
    return needNavBar
})
const onClickRightBtn = () => {
    console.log('>>>>>点击了右侧按钮')
}

/* EaseIM Listener */
useEMMessagesListener()
</script>
