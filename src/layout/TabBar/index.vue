<template>
    <van-tabbar route placeholder>
        <van-tabbar-item replace to="/home/conversations" icon="chat-o" :badge="badge">{{
            $t('layout.tabbar.conversations')
        }}</van-tabbar-item>
        <van-tabbar-item replace to="/home/contacts" icon="friends-o">{{
            $t('layout.tabbar.contacts')
        }}</van-tabbar-item>
        <van-tabbar-item replace to="/home/me" icon="user-o">{{ $t('layout.tabbar.me') }}</van-tabbar-item>
    </van-tabbar>
</template>

<script setup lang="ts">
interface Props {
    badge: string | number
}
withDefaults(defineProps<Props>(), {
    badge: '', //默认为空不展示badge，存在数字则进行数字展示
})
</script>

<style scoped></style>
