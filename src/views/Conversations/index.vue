<template>
    <div class="conversations_container">
        <van-list
            v-model:loading="loading"
            :finished="finished"
            :finished-text="$t('conversations.nomore')"
            @load="onLoadConversations"
        >
            <!-- 搜索组件 -->
            <SearchInput />
            <van-swipe-cell v-for="item in conversationList" :key="item.id">
                <div class="van-haptics-feedback conversation_item_box" @click="enterTheChatPage(item)">
                    <div class="avatar_box">
                        <van-badge :content="item.unReadNum" max="99" :show-zero="false">
                            <img class="avatar_box_img" :src="mapConversationsInfo(item)?.avatarUrl" alt="" />
                        </van-badge>
                    </div>
                    <div class="chat_infor_main">
                        <p class="name">{{ mapConversationsInfo(item)?.name }}</p>
                        <p class="last_msg">
                            {{ handleLastMsgPreview(item) }}
                        </p>
                    </div>
                    <div class="chat_infor_right">{{ handleLastMsgTime(item) }}</div>
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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
/* pinia */
import { useConversationStore, useContactsStore, useGroupsStore } from '@/stores'
/* vue-router */
import { useRouter } from 'vue-router'
/* IM */
import { LAST_MSG_PREVIEW } from '@/constants/im'
import { useFetchConversation } from '@/EaseIM/hooks'
import SearchInput from '@/components/SearchInput/index.vue'
import { ConversationBody, ConversationChatType } from '@/EaseIM/types/conversations'
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
const pageNum = ref(0)
const pageSize = ref(20)
const { fetchConversionList } = useFetchConversation()
const onLoadConversations = async () => {
    try {
        if (conversationList.value.length) {
            return (finished.value = false)
        } else {
            console.log('>>>>>>调用接口拉取会话列表')
            console.log('conversationList', conversationList.value.length)
            let res = await fetchConversionList({ pageNum: pageNum.value, pageSize: pageSize.value })
            if (!res.length) return (finished.value = true)
        }
    } catch (error) {
        console.log('>>>>>>> Error')
    } finally {
        loading.value = false
    }
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
                    groups[item.id].groupid ||
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

/* 处理会话时间展示 */
const { t } = useI18n()
const handleLastMsgTime = computed(() => {
    return (item: ConversationBody) => {
        const currentTime = Dayjs()
        //使用Dayjs库比对当前时间与消息发送时间大于24小时展示不同的时间格式
        if (Dayjs(currentTime).diff(item.time, 'hour') < 12) {
            return Dayjs(item.time).format('HH:mm(a)')
        }
        if (Dayjs(currentTime).diff(item.time, 'hour') <= 24) {
            return Dayjs(item.time).format(`${t('conversations.yesterday')}HH:mm(a)`)
        } else {
            return Dayjs(item.time).format('YYYY/MM/DD')
        }
    }
})

/* 进入聊天界面 */
const router = useRouter()
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
