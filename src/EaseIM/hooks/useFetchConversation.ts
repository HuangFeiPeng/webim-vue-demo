/* 从环信服务器获取会话列表 */
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
        return new Promise<any[]>(async (resolve, reject) => {
            //TODO 目前getConversationlist 返回类型有问题待后续SDK优化，短期用any解决。
            EChatClient.getConversationlist()
                .then((res: any) => {
                    const resultList = res?.data?.channel_infos
                    const groupSessionList: string[] = []
                    resultList.length &&
                        resultList.forEach((channel: any) => {
                            /**
                             * 如果会话类型为群组则单独获取群组的详情，
                             * 从而匹配展示群组昵称【不通过群组列表匹配是因为，
                             * 单页最大获取20条，会话中有可能从在不在20条之内会话】
                             */
                            if (channel.lastMessage.chatType === 'groupchat') {
                                const groupId = channel.lastMessage.to
                                groupSessionList.push(groupId)
                            }
                            conversationStore.createConversation({ ...channel })
                        })

                    groupSessionList.length && groupsStore.fetchGroupsInfos(groupSessionList)
                    resolve(res?.data?.channel_infos)
                })
                .catch((error) => {
                    console.log('>>>>会话拉取失败', error)
                    reject(error)
                })
        })
    }
    return {
        fetchConversionList,
    }
}
