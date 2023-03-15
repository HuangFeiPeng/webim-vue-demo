<template>
    <div class="conversations_container">
        <!-- 搜索组件 -->
        <SearchInput />
        <van-list
            v-model:loading="loading"
            :finished="finished"
            :finished-text="$t('conversations.nomore')"
            @load="onLoadConversations"
        >
            <!-- 系统通知逻辑 -->
            <div
                v-if="systemNotfiData"
                class="van-haptics-feedback conversation_item_box"
                @click="enterTheSystemNotfiPage"
            >
                <div class="avatar_box">
                    <van-badge :content="unReadSystemNotfiCount" max="99" :show-zero="false">
                        <img class="avatar_box_img" :src="informAvatar" alt="" />
                    </van-badge>
                </div>
                <div class="chat_infor_main van-hairline--bottom">
                    <div class="content">
                        <p class="name">系统通知</p>
                        <p class="last_msg">{{ systemNotfiData?.from }} :{{ systemNotfiData?.content }}</p>
                    </div>
                    <div class="time">{{ systemNotfiData?.time && handleLastMsgTime(systemNotfiData?.time) }}</div>
                </div>
            </div>
            <!-- 普通会话 -->
            <van-swipe-cell v-for="item in conversationList" :key="item.id">
                <div class="van-haptics-feedback conversation_item_box" @click="enterTheChatPage(item)">
                    <div class="avatar_box">
                        <van-badge :content="item.unReadNum" max="99" :show-zero="false">
                            <img class="avatar_box_img" :src="mapConversationsInfo(item)?.avatarUrl" alt="" />
                        </van-badge>
                    </div>
                    <div class="chat_infor_main van-hairline--bottom">
                        <div class="content">
                            <p class="name">{{ mapConversationsInfo(item)?.name }}</p>
                            <p class="last_msg">
                                {{ handleLastMsgPreview(item) }}
                            </p>
                        </div>
                        <div class="time">{{ handleLastMsgTime(item.time) }}</div>
                    </div>
                </div>
                <template #right>
                    <div class="conversation_swipe_right">
                        <van-button
                            square
                            :type="item.isStick ? 'primary' : 'warning'"
                            :text="
                                item.isStick
                                    ? $t('conversations.swipeCellBtn.unstick')
                                    : $t('conversations.swipeCellBtn.stick')
                            "
                            @click="stickTheChat(item.id, item.isStick)"
                        />

                        <van-button
                            square
                            type="danger"
                            :text="$t('conversations.swipeCellBtn.delete')"
                            @click="deleteTheChat(item.id, item.chatType)"
                        />
                    </div>
                </template>
            </van-swipe-cell>
        </van-list>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, unref, toRaw } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
/* pinia */
import { useConversationStore, useContactsStore, useGroupsStore, useSystemNotfiStore } from '@/stores'
/* vue-router */
import { useRouter } from 'vue-router'
/* IM */
import { EChatClient } from '@/EaseIM'
import { LAST_MSG_PREVIEW } from '@/constants/im'
import { useFetchConversation } from '@/EaseIM/hooks'
import SearchInput from '@/components/SearchInput/index.vue'
import { ConversationBody, ConversationChatType } from '@/EaseIM/types/conversations'
import { SystemNotfiParams } from '@/EaseIM/types'
/* image */
import emptyIcon from '@/assets/images/conversation/emptyicon@2x.png'
import informAvatar from '@/assets/images/conversation/informAvatar.png'
/* dayjs */
import Dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
Dayjs.extend(relativeTime)

/* 会话列表逻辑相关 */
const conversationStore = useConversationStore()
const conversationList = computed(() => {
    let reorderConversations: ConversationBody[] = []
    conversationStore.getConversationListvalues.forEach((item) => {
        if (item.isStick) {
            reorderConversations.unshift(item)
        } else {
            reorderConversations.push(item)
        }
    })
    return reorderConversations
})
//下拉加载更多数据
const loading = ref(false)
const finished = ref(false)
const pageNum = ref(1)
const pageSize = ref(20)
const { fetchConversionList } = useFetchConversation()
const onLoadConversations = async () => {
    console.log('onLoadConversations')
    let res = await fetchConversionList({ pageNum: pageNum.value, pageSize: pageSize.value })
    loading.value = false
    pageNum.value = pageNum.value + 1
    if (!res.length) {
        finished.value = true
        return
    }
    console.log(res, pageNum.value)
}

//处理置顶会话
const stickTheChat = (targetId: string, isStick: boolean | undefined) => {
    if (isStick) {
        conversationStore.handleStickList('UNSTICK', targetId)
    } else {
        conversationStore.handleStickList('STICK', targetId)
    }
}
//删除会话
const deleteTheChat = (targetId: string, chatType: ConversationChatType) => {
    console.log('>>>>>>调用删除会话操作')
    conversationStore.deleteConversation(targetId, chatType)
}
/* 映射会话对应的属性 */
const defaultAvatarUrl = 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
const contactsStore = useContactsStore()
const groupsStore = useGroupsStore()
const mapConversationsInfo = computed(() => {
    const contacts = contactsStore.contacts
    const groups = groupsStore.groups
    return (item: ConversationBody) => {
        if (item.chatType === 'singleChat') {
            return {
                name: contacts[item.id]?.nickname || item.id,
                avatarUrl: contacts[item.id]?.avatarurl || defaultAvatarUrl,
            }
        }
        if (item.chatType === 'groupChat') {
            return {
                name:
                    groups[item.id]?.groupInfo?.name ||
                    groups[item.id]?.groupInfo?.groupName ||
                    groups[item.id]?.groupid ||
                    item.id,
                avatarUrl: defaultAvatarUrl,
            }
        }
    }
})

/* 处理最后一条消息展示 */
const handleLastMsgPreview = computed(() => {
    return (item: ConversationBody) => {
        if (LAST_MSG_PREVIEW[item.lastMessage.type]) {
            return LAST_MSG_PREVIEW[item.lastMessage.type]
        } else if (item.lastMessage.type === 'custom') {
            return '[自定义类型消息]'
        } else {
            return item.lastMessage.msg
        }
    }
})

/* 系统通知 */
const systemNotfiStore = useSystemNotfiStore()
//订阅该系统通知内的数据变化执行本地缓存
systemNotfiStore.$subscribe(
    (mutation, state) => {
        // console.log('JSON.stringify(state.systemNotificationList)', JSON.stringify(state.systemNotificationList))
        const storageData = JSON.stringify(state.systemNotificationList)
        window.localStorage.setItem(`EM_${EChatClient.user}_INFORM`, storageData)
    },
    { detached: true },
)
const systemNotfiData = computed(() => {
    const _index = systemNotfiStore.systemNotificationList.length - 1
    return systemNotfiStore.systemNotificationList[_index]
})
//取出未读系统通知数
const unReadSystemNotfiCount = computed(() => {
    return systemNotfiStore.unReadNotifCount
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
//跳转至系统通知页面
const enterTheSystemNotfiPage = () => {
    router.push({
        name: 'systemnotification',
    })
}

//跳转至聊天页
const enterTheChatPage = (chatParams: ConversationBody) => {
    console.log('>>>>>>chatParams', chatParams)
    const { id, chatType, unReadNum } = chatParams
    const targetId = id
    //如果该会话未读数大于0则发送已读会话，并会清除服务端记录的该会话未读数。
    if (unReadNum > 0) {
        conversationStore.readedConversation(targetId, chatType)
    }
    router.push({ name: 'chat', query: { id, chatType } })
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
