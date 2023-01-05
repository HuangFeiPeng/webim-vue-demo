import { defineStore } from 'pinia'
import { EChatClient } from '@/EaseIM'
import { getEMKey } from '@/utils'
import { EaseIMChatType, STICK_LIST } from '@/constants/im'
import { EMMessageBody } from '@/EaseIM/types'
import { ConversationBody, HandleStickType, ConversationChatType } from '@/EaseIM/types/conversations'
import _ from 'lodash'
import { useLocalStorage } from '@vueuse/core'
interface ConversationState {
    conversationList: Map<string, ConversationBody>
}

//TODO 此处也是由于SDK类型缺失暂时自定义会话列表body接口
interface ChannleBody {
    channel_id?: string
    lastMessage?: any
    unread_num?: number
}
const packageConversationBody = (params: ChannleBody) => {
    const resultBody: ConversationBody = {
        id: '',
        unReadNum: 0,
        msgFrom: '',
        msgTo: '',
        chatType: EaseIMChatType.SINGLECHAT,
        lastMessage: {},
        time: '',
        isStick: false,
    }
    const { unread_num, lastMessage, channel_id } = params
    if (!channel_id) return
    const regexp = /.*@easemob.com$/
    const chatType = (regexp.test(channel_id) && EaseIMChatType.SINGLECHAT) || EaseIMChatType.GROUPCHAT //判断是单聊会话还是群组或聊天室会话
    console.log('chatType', chatType)
    if (lastMessage) {
        const channelId = getEMKey(EChatClient.user, lastMessage.from, lastMessage.to, chatType)
        const cacheStickList = window.localStorage.getItem(`${EChatClient.user}_${STICK_LIST}`)
        if (cacheStickList) {
            JSON.parse(cacheStickList).includes(channelId) && (resultBody.isStick = true)
        }
        resultBody.id = channelId as string
        resultBody.msgFrom = lastMessage.from
        resultBody.msgTo = lastMessage.to
        resultBody.unReadNum = unread_num as number
        resultBody.chatType = chatType
        resultBody.lastMessage = lastMessage
        resultBody.time = lastMessage.time
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
        //从接口拉取初始化会话列表数据
        createConversation(params: ChannleBody) {
            const resultBody = packageConversationBody(params)
            resultBody && this.$state.conversationList.set(resultBody.id, resultBody)
        },
        //更新会话列表数据
        updateConversation(message: EMMessageBody) {
            const { from, to, chatType, time } = message
            const key = getEMKey(EChatClient.user, from || EChatClient.user, to, chatType)
            const isHasConversation = this.$state.conversationList.has(key)
            const ConversationBody: ConversationBody = {
                id: key,
                msgFrom: from || EChatClient.user,
                msgTo: to,
                chatType: chatType as ConversationChatType,
                lastMessage: message,
                unReadNum: 0,
                time: time,
            }
            //如果消息来源为自己置零，否则取出老的数据计算更新。
            if (from === EChatClient.user) {
                ConversationBody.unReadNum = 0
            } else {
                if (isHasConversation) {
                    const oldConversation = this.$state.conversationList.get(key)
                    oldConversation && (ConversationBody.unReadNum = oldConversation.unReadNum + 1)
                    console.log('oldConversationoldConversation', oldConversation)
                } else {
                    ConversationBody.unReadNum = 1
                }
            }
            this.$state.conversationList.set(key, ConversationBody)
        },
        //置顶会话或取消置顶
        handleStickList(type: HandleStickType, targetId: string) {
            const cacheStickList = useLocalStorage<string[]>(`EM_${EChatClient.user}_${STICK_LIST}`, [])
            if (type === 'STICK') {
                console.log('>>>>>置顶')
                cacheStickList.value.push(targetId)
                const oldConversation = this.$state.conversationList.get(targetId)
                oldConversation && (oldConversation.isStick = true)
            } else if (type === 'UNSTICK') {
                console.log('>>>>>取消置顶')
                const _index = cacheStickList.value.findIndex((item) => item === targetId)
                if (_index > -1) {
                    cacheStickList.value.splice(_index, 1)
                    const oldConversation = this.$state.conversationList.get(targetId)
                    oldConversation && (oldConversation.isStick = false)
                }
            }
        },
        //删除会话
        deleteConversation(targetId: string, chatType: ConversationChatType) {
            console.log('>>>>>执行删除操作', targetId, chatType)
            return new Promise((resolve, reject) => {
                EChatClient.deleteConversation({
                    channel: targetId,
                    chatType: chatType,
                    deleteRoam: false,
                })
                    .then((res) => {
                        console.log('>>>>>会话删除成功', res)
                        const isHasConversation = this.$state.conversationList.has(targetId)
                        isHasConversation && this.$state.conversationList.delete(targetId)
                        //存在置顶就删除置顶
                        const cacheStickList = useLocalStorage<string[]>(`${EChatClient.user}_${STICK_LIST}`, [])
                        const _index = cacheStickList.value.findIndex((hxId) => hxId === targetId)
                        if (_index > -1) {
                            cacheStickList.value.splice(_index, 1)
                        }
                        resolve(res)
                    })
                    .catch((err) => {
                        console.log('>>>>>会话删除失败', err)
                        reject(err)
                    })
            })
        },
        //已读会话
    },
})
