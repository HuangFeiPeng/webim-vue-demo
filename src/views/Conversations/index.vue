<template>
    <div class="conversations_container">
        <!-- 搜索组件 -->
        <SearchInput />
        <van-list
            v-model:loading="conversationLoading"
            v-model:error="conversationError"
            :finished="conversationFinished"
            :finished-text="$t('conversations.nomore')"
            @load="onLoadConversations"
        >
            <!-- 普通会话 -->
            <van-swipe-cell
                v-for="conversationItem in conversationList"
                :key="conversationItem.conversationId"
                v-on-long-press.prevent="onLongPressCallbackDirective"
            >
                <div class="van-haptics-feedback conversation_item_box" @click="enterTheChatPage(conversationItem)">
                    <div class="avatar_box">
                        <img class="avatar_box_img" :src="mapConversationsInfo(conversationItem)?.avatarUrl" alt="" />
                    </div>
                    <div class="chat_infor_main van-hairline--bottom">
                        <div class="content">
                            <p class="name">{{ mapConversationsInfo(conversationItem)?.name }}</p>
                            <p class="last_msg">
                                {{ handleLastMsgPreview(conversationItem) }}
                            </p>
                        </div>
                        <div class="right_content">
                            <div class="time">{{ handleLastMsgTime(conversationItem.lastMessage.time) }}</div>
                            <van-badge
                                :show-zero="false"
                                :color="'#009EFF'"
                                :content="conversationItem.unReadCount"
                                max="99"
                                :offset="[35, 10]"
                            />
                        </div>
                    </div>
                </div>
                <template #right>
                    <div class="conversation_swipe_right">
                        <van-button
                            square
                            :type="conversationItem.isPinned ? 'primary' : 'warning'"
                            :text="
                                conversationItem.isPinned
                                    ? $t('conversations.swipeCellBtn.unstick')
                                    : $t('conversations.swipeCellBtn.stick')
                            "
                            @click="stickTheChat(conversationItem.conversationId, conversationItem.isPinned)"
                        />

                        <van-button
                            square
                            type="danger"
                            :text="$t('conversations.swipeCellBtn.delete')"
                            @click="deleteTheChat(conversationItem.conversationId)"
                        />
                    </div>
                </template>
            </van-swipe-cell>
        </van-list>
        <van-action-sheet
            v-model:show="longPressedDirective"
            :actions="conversationActionsContent"
            @select="onSelect"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
/* pinia */
import { useConversationStore, useContactsStore, useGroupsStore } from '@/stores'
/* vue-router */
import { useRouter } from 'vue-router'
/* IM */
import { LAST_MSG_PREVIEW } from '@/constants/im'

import SearchInput from '@/components/SearchInput/index.vue'
import { ConversationListItem } from '@/EaseIM/types/'
import { emConversation } from '@/EaseIM/emApis'
/* image */
import defaultAvatar from '@/assets/avatar.png'
import defaultGroupAvatar from '@/assets/groupAvatar.png'
/* dayjs */
import Dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
Dayjs.extend(relativeTime)
import { vOnLongPress } from '@vueuse/components'
/* 会话列表逻辑相关 */
const conversationStore = useConversationStore()
const conversationList = computed(() => {
    return conversationStore.getConversationListvalues
})
//下拉加载更多数据
const conversationLoading = ref(false)
const conversationError = ref(false)
const conversationFinished = ref(false)
const pageNum = ref(1)
const pageSize = ref(20)
const { fetchConversationFromServer } = emConversation()
const onLoadConversations = async () => {
    console.log('onLoadConversations')
    try {
        const res = await fetchConversationFromServer(pageSize.value, '')
        conversationLoading.value = false
        pageNum.value = pageNum.value + 1
        if (res?.conversations?.length) {
            conversationFinished.value = true
        }
    } catch (error) {
        console.log(error)
        conversationError.value = true
    }
}

//处理置顶会话
const stickTheChat = (targetId: string, isStick?: boolean) => {
    if (isStick) {
        conversationStore.handleStickList(targetId)
    } else {
        conversationStore.handleStickList(targetId)
    }
}
//删除会话
const deleteTheChat = (targetId: string) => {
    console.log('>>>>>>调用删除会话操作')
    conversationStore.deleteConversation(targetId)
}
/* 映射会话对应的属性 */
const contactsStore = useContactsStore()
const groupsStore = useGroupsStore()
const mapConversationsInfo = computed(() => {
    const contactsProfile = contactsStore.contactsProfile
    const groups = groupsStore.groups
    return (conversationItem: ConversationListItem) => {
        const { conversationId, conversationType } = conversationItem
        if (conversationType === 'singleChat') {
            return {
                name: contactsProfile.get(conversationId)?.nickname || conversationId,
                avatarUrl: contactsProfile.get(conversationId)?.avatarurl || defaultAvatar,
            }
        }
        if (conversationType === 'groupChat') {
            return {
                name:
                    groups[conversationId]?.groupInfo?.name ||
                    groups[conversationId]?.groupInfo?.groupName ||
                    groups[conversationId]?.groupid ||
                    conversationId,
                avatarUrl: defaultGroupAvatar,
            }
        }
    }
})

/* 处理最后一条消息展示 */
const handleLastMsgPreview = computed(() => {
    return (conversationItem: ConversationListItem) => {
        const { lastMessage } = conversationItem
        if (!lastMessage) return ''
        if (LAST_MSG_PREVIEW[lastMessage.type]) {
            return LAST_MSG_PREVIEW[lastMessage.type]
        } else if (lastMessage.type === 'custom') {
            return '[自定义类型消息]'
        } else if (lastMessage.type === 'txt') {
            return lastMessage?.msg
        }
    }
})

/* 处理时间展示 */
const { t } = useI18n()
const handleLastMsgTime = computed(() => {
    return (time: number | string) => {
        const currentTime = Dayjs()
        //使用Dayjs库比对当前时间与消息发送时间大于24小时展示不同的时间格式
        if (Dayjs(currentTime).diff(time, 'hour') < 12) {
            return Dayjs(time).format('HH:mm(a)')
        }
        if (Dayjs(currentTime).diff(time, 'hour') <= 24) {
            return Dayjs(time).format(`${t('conversations.yesterday')}HH:mm(a)`)
        } else {
            return Dayjs(time).format('YYYY/MM/DD')
        }
    }
})

/* 页面跳转 */
const router = useRouter()
//跳转至聊天页
const enterTheChatPage = (chatParams: ConversationListItem) => {
    console.log('>>>>>>chatParams', chatParams)
    const { conversationId, conversationType, unReadCount } = chatParams
    const targetId = conversationId
    //如果该会话未读数大于0则发送已读会话，并会清除服务端记录的该会话未读数。
    if (unReadCount > 0) {
        // conversationStore.readedConversation(targetId, chatType)
    }
    router.push({ name: 'chat', query: { conversationId, conversationType } })
}

//会话长按事件
const longPressedDirective = ref(false)
const conversationActionsContent = ref([{ name: '标记已读' }])
const onLongPressCallbackDirective = (e: PointerEvent) => {
    console.log('>>>>>>触发长按事件', e)
    longPressedDirective.value = true
}
const onSelect = (e: string) => {
    console.log('>>>>>>触发选择事件', e)
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
