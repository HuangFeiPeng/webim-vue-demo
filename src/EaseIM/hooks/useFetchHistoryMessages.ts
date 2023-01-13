import { ref } from 'vue'
import { useMessagesStore } from '@/stores'
import _ from 'lodash'
import { EChatClient, EasemobChat } from '@/EaseIM'
interface FetchHistoryMsgParams {
    targetId: string
    chatType: EasemobChat.ChatType
    cursor?: string
    pageSize?: number
}
export const useFetchHistoryMessages = () => {
    const messagesStore = useMessagesStore()
    const historyMsgLoading = ref(false)
    const historyCursor = ref<string | undefined>()
    const fetchHistoryMsg = async (params: FetchHistoryMsgParams) => {
        historyMsgLoading.value = true
        try {
            const res = await EChatClient.getHistoryMessages(params)
            //为undefined的时候表明已经没有新的漫游了可以进行return
            if (res.cursor === 'undefined') {
                return (historyMsgLoading.value = false)
            }
            historyCursor.value = res.cursor
            historyMsgLoading.value = false
            res.messages.length &&
                res.messages.forEach((msg) => {
                    const { type } = msg
                    if (type !== 'channel' && type !== 'read' && type !== 'delivery') {
                        messagesStore.updateMessagesList('HISTORY_MSG', msg)
                    }
                })
        } catch (error) {
            console.log('>>>>拉取漫游失败', error)
        } finally {
            historyMsgLoading.value = false
        }
    }
    return {
        historyMsgLoading,
        historyCursor,
        fetchHistoryMsg,
    }
}
