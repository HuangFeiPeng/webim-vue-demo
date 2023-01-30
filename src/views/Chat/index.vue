<template>
    <div class="chat_container">
        <nav-bar :is-back="true" is-more :title="navTitle" @onMore="onMore" />
        <Messages />
        <InputBar :chat-type="chatType" :target-id="targetId" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
/* vue-router */
import { useRoute } from 'vue-router'
/* pinia */
import { useContactsStore, useGroupsStore } from '@/stores'
/* IM */
import { EasemobChat } from '@/EaseIM'
/* 组件 */
import NavBar from '@/layout/NavBar/index.vue'
import Messages from './Messages/index.vue'
import InputBar from './InputBar/index.vue'
const route = useRoute()

// 聊天目标用户信息
interface ResultInfos {
    hxId?: string
    nickname?: string
    groupId?: string
    groupName?: string
}
const contactsStore = useContactsStore()
const gorupsStore = useGroupsStore()
const targetUserInfos = computed(() => {
    let resultInfos: ResultInfos = {}
    const { id, chatType } = route.query

    if (chatType === 'singleChat') {
        resultInfos.hxId = contactsStore.contacts[id as string].hxId
        resultInfos.nickname = contactsStore.contacts[id as string]?.nickname
    }
    if (chatType === 'groupChat') {
        if (gorupsStore.groups[id as string].groupInfo) {
            resultInfos.groupName = gorupsStore.groups[id as string].groupInfo?.groupName
        }
        resultInfos.groupId = gorupsStore.groups[id as string].groupid
    }
    return resultInfos
})
const targetId = computed(() => route.query.id as string)
const chatType = computed(() => route.query.chatType as EasemobChat.ChatType)
/* NarBar */

const navTitle = computed(() => {
    const { chatType } = route.query
    let title
    if (chatType === 'singleChat') {
        title = targetUserInfos.value.nickname || targetUserInfos.value.hxId
    }
    if (chatType === 'groupChat') {
        title = targetUserInfos.value.groupName || targetUserInfos.value.groupId
    }
    return title
})
const onMore = () => {
    console.log('>>>>>NarBar More触发')
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
