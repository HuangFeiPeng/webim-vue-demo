<template>
    <van-tabbar route placeholder>
        <van-tabbar-item replace to="/home/conversations" icon="chat-o" badge="3">{{
            $t('layout.tabbar.conversations')
        }}</van-tabbar-item>
        <van-tabbar-item replace to="/home/contacts" icon="friends-o">{{
            $t('layout.tabbar.contacts')
        }}</van-tabbar-item>
        <van-tabbar-item replace to="/home/me" icon="user-o">{{ $t('layout.tabbar.me') }}</van-tabbar-item>
    </van-tabbar>
</template>

<script setup lang="ts"></script>

<style scoped></style>
