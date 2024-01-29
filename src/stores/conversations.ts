import { defineStore } from 'pinia'
import type { ServerConversations, ConversationItem } from 'easemob-websdk/types/indexApi'
import type {
    MessageBody,
    DeliveryMsgBody,
    ReadMsgBody,
    ChannelMsgBody,
    CmdMsgBody,
} from 'easemob-websdk/types/message'
import { getEMKey } from '@/utils'
import { ConversationListItem } from '@/EaseIM/types/'
import _ from 'lodash'
import { useLocalStorage } from '@vueuse/core'
interface ConversationState {
    // conversationList: Map<string, ConversationBody>
    conversationList: ConversationListItem[]
    cursor: string
}

export const useConversationStore = defineStore('conversationStore', {
    state: (): ConversationState => {
        return {
            conversationList: [],
            cursor: '',
        }
    },
    getters: {
        getConversationListvalues(state) {
            //按照lastmsg time 进行排序
            return _.sortBy(state.conversationList, (o) => {
                return -o.lastMessage.time
            })
        },
    },
    actions: {
        //从接口拉取初始化会话列表数据
        createConversation(params: ServerConversations) {
            console.log('拿到从服务端获取的会话列表params', params)
            this.$state.conversationList = params.conversations as ConversationListItem[]
            this.$state.cursor = params.cursor
            // const resultBody = packageConversationBody(params)
            // resultBody && this.$state.conversationList.set(resultBody.id, resultBody)
        },
        //更新会话列表数据
        updateConversation(message: ConversationItem) {
            // const { from, to, chatType, time } = message
            // const key = getEMKey(EChatClient.user, from || EChatClient.user, to, chatType)
            // const isHasConversation = this.$state.conversationList.has(key)
            // const ConversationBody: ConversationBody = {
            //     id: key,
            //     msgFrom: from || EChatClient.user,
            //     msgTo: to,
            //     chatType: chatType as ConversationChatType,
            //     lastMessage: message,
            //     unReadNum: 0,
            //     time: time,
            // }
            // //如果消息来源为自己置零，否则取出老的数据计算更新。
            // if (from === EChatClient.user) {
            //     ConversationBody.unReadNum = 0
            // } else {
            //     if (isHasConversation) {
            //         const oldConversation = this.$state.conversationList.get(key)
            //         oldConversation && (ConversationBody.unReadNum = oldConversation.unReadNum + 1)
            //         console.log('oldConversationoldConversation', oldConversation)
            //     } else {
            //         ConversationBody.unReadNum = 1
            //     }
            // }
            // this.$state.conversationList.set(key, ConversationBody)
        },
        //置顶会话或取消置顶
        handleStickList(targetId: string) {
            // const cacheStickList = useLocalStorage<string[]>(`EM_${EChatClient.user}_${STICK_LIST}`, [])
            // if (type === 'STICK') {
            //     console.log('>>>>>置顶')
            //     cacheStickList.value.push(targetId)
            //     const oldConversation = this.$state.conversationList.get(targetId)
            //     oldConversation && (oldConversation.isStick = true)
            // } else if (type === 'UNSTICK') {
            //     console.log('>>>>>取消置顶')
            //     const _index = cacheStickList.value.findIndex((item) => item === targetId)
            //     if (_index > -1) {
            //         cacheStickList.value.splice(_index, 1)
            //         const oldConversation = this.$state.conversationList.get(targetId)
            //         oldConversation && (oldConversation.isStick = false)
            //     }
            // }
        },
        //删除会话
        deleteConversation(targetId: string) {
            console.log('>>>>>执行删除操作', targetId)
            // return new Promise((resolve, reject) => {
            //     EChatClient.deleteConversation({
            //         channel: targetId,
            //         chatType: chatType,
            //         deleteRoam: false,
            //     })
            //         .then((res) => {
            //             console.log('>>>>>会话删除成功', res)
            //             const isHasConversation = this.$state.conversationList.has(targetId)
            //             isHasConversation && this.$state.conversationList.delete(targetId)
            //             //存在置顶就删除置顶
            //             const cacheStickList = useLocalStorage<string[]>(`${EChatClient.user}_${STICK_LIST}`, [])
            //             const _index = cacheStickList.value.findIndex((hxId) => hxId === targetId)
            //             if (_index > -1) {
            //                 cacheStickList.value.splice(_index, 1)
            //             }
            //             resolve(res)
            //         })
            //         .catch((err) => {
            //             console.log('>>>>>会话删除失败', err)
            //             reject(err)
            //         })
            // })
        },
        //已读会话
        // eslint-disable-next-line
        readedConversation(targetId: string) {},
    },
})
