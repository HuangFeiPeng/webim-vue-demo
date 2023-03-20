<template>
    <!-- 顶部安全区 -->
    <div class="van-safe-area-top"></div>
    <div class="systemnotifi_container">
        <div class="systemnotifi_container_card" v-for="(item, index) in systemNotfiList" :key="item.time + index">
            <div class="time">{{ Dayjs(item.time).format('YYYY-MM-DD HH:mm') }}</div>
            <div class="card_body van-hairline--bottom">
                <div class="card_content">
                    <img class="avatar" src="@/assets/images/login/loginIcon.png" alt="" />
                    <div class="content">
                        <div>{{ item.from }}</div>
                        <p>{{ item.content }}</p>
                    </div>
                    <van-divider></van-divider>
                </div>
                <div v-if="item.isNeedHandle" class="card_footer">
                    <template v-if="!item.confirm && !item.reject">
                        <div @click="actionsNotifiEvent('agreeFriendApply', item, index)">同意</div>
                        <div @click="actionsNotifiEvent('rejectFriendApply', item, index)">拒绝</div>
                    </template>
                    <template v-if="item.confirm">
                        <p>已同意</p>
                    </template>
                    <template v-if="item.reject">
                        <p>已拒绝</p>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { EChatClient } from '@/EaseIM'
import { SystemNotfiParams } from '@/EaseIM/types'
import { useSystemNotfiStore } from '@/stores'
import Dayjs from 'dayjs'
const systemNotfiStore = useSystemNotfiStore()
const systemNotfiList = computed(() => systemNotfiStore.systemNotificationList)

//处理handle事件
type HandleEventNameType = 'agreeFriendApply' | 'rejectFriendApply' | 'agreeGroupApply' | 'rejectGroupApply'
type HandleEventFuncType = (toId: string, index: number, groupId?: string) => void
const matchDifferentNotifiEvent: Record<HandleEventNameType, HandleEventFuncType> = {
    agreeFriendApply: (toId, index) => {
        EChatClient.acceptContactInvite(toId)
        systemNotfiStore.updateSystemNotfiStatus(index, 'agree')
    },
    rejectFriendApply: (toId, index) => {
        EChatClient.declineContactInvite(toId)
        systemNotfiStore.updateSystemNotfiStatus(index, 'reject')
    },
    agreeGroupApply: (toId, index, groupId) => {
        if (groupId) {
            EChatClient.acceptGroupJoinRequest({ applicant: toId, groupId: groupId })
        }
    },
    rejectGroupApply: (toId, index, groupId) => {
        if (groupId) {
            EChatClient.acceptGroupJoinRequest({ applicant: toId, groupId: groupId })
        }
    },
}
//执行具体的对应事件
const actionsNotifiEvent = (type: HandleEventNameType, params: SystemNotfiParams, index: number) => {
    if (params.notifType === 'contacts') {
        matchDifferentNotifiEvent[type](params.from, index)
    } else if (params.notifType === 'groups') {
        matchDifferentNotifiEvent[type](params.from, index, params.groupId)
    }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
