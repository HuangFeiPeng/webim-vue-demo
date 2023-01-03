import { defineStore } from 'pinia'
import { EChatClient } from '@/EaseIM'
import { EaseIMChatType } from '@/constants/im'
import { ConversationFromType, ConversationBody } from '@/EaseIM/types/conversations'
import _ from 'lodash'
interface ConversationState {
    conversationList: Map<string, ConversationBody>
}

//TODO 此处也是由于SDK类型缺失暂时自定义会话列表body接口
interface ChannleBody {
    channel_id?: string
    lastMessage?: any
    unread_num?: number
}
const packageConversationBody = (source: ConversationFromType, params: ChannleBody) => {
    const resultBody: ConversationBody = {
        id: '',
        unReadNum: 0,
        msgFrom: '',
        msgTo: '',
        chatType: EaseIMChatType.SINGLECHAT,
        lastMessage: {},
        time: '',
    }
    if (source === 'LOCAL') {
    }
    if (source === 'EASEAPI') {
        const { unread_num, lastMessage, channel_id } = params
        if (!channel_id) return
        const regexp = /.*@easemob.com$/
        const chatType = (regexp.test(channel_id) && EaseIMChatType.SINGLECHAT) || EaseIMChatType.GROUPCHAT //判断是单聊会话还是群组或聊天室会话
        if (lastMessage) {
            const channelId =
                EChatClient.user && EChatClient.user === lastMessage.from && chatType === EaseIMChatType.SINGLECHAT
                    ? lastMessage.to
                    : chatType === EaseIMChatType.GROUPCHAT
                    ? lastMessage.to
                    : lastMessage.from
            resultBody.id = channelId as string
            resultBody.msgFrom = lastMessage.from
            resultBody.msgTo = lastMessage.to
            resultBody.unReadNum = unread_num as number
            resultBody.lastMessage = lastMessage
            resultBody.time = lastMessage.time
        }

        return resultBody
    }
}
export const useConversationStore = defineStore('conversationStore', {
    state: (): ConversationState => {
        return { conversationList: new Map() }
    },
    getters: {
        getConversationListvalues(state) {
            //按照lastmsg time 进行排序
            const sortedArr = _.sortBy(Array.from(state.conversationList.values()), (o) => {
                return -o.time
            })
            return sortedArr
        },
    },
    actions: {
        createConversation(source: ConversationFromType, params: ChannleBody) {
            const resultBody = packageConversationBody(source, params)
            if (resultBody) {
                const isHasConversation = this.$state.conversationList.has(resultBody.id)
                if (!isHasConversation) {
                    this.$state.conversationList.set(resultBody.id, resultBody)
                } else {
                    this.$state.conversationList.delete(resultBody.id)
                    this.$state.conversationList.set(resultBody.id, resultBody)
                }
            }
        },
    },
})
