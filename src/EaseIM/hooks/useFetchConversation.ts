import { EChatClient } from '../index'
import { useConversationStore, useGroupsStore } from '@/stores'

interface FetchConversationsParams {
    pageNum: number
    pageSize: number
}

export const useFetchConversation = () => {
    const conversationStore = useConversationStore()
    const groupsStore = useGroupsStore()
    //TODO 后续会话列表支持分页，预留params 应对后续可传参数使用
    const fetchConversionList = async (params: FetchConversationsParams) => {
        try {
            //TODO 目前getConversationlist 返回类型有问题待后续SDK优化，短期用any解决。
            const res: any = await EChatClient.getConversationlist()
            const resultList = res?.data?.channel_infos
            const groupSessionList: string[] = []
            resultList.length &&
                resultList.forEach((channel: any) => {
                    console.log('>>>>>>>', channel)
                    if (channel.lastMessage.chatType === 'groupchat') {
                        const groupId = channel.lastMessage.to
                        groupSessionList.push(groupId)
                    }
                    conversationStore.createConversation({ ...channel })
                })
            groupsStore.fetchGroupsInfos(groupSessionList)
        } catch (error) {}
    }
    return {
        fetchConversionList,
    }
}
