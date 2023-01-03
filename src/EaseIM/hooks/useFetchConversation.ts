import { EChatClient } from '../index'
import { useConversationStore } from '@/stores'

interface FetchConversationsParams {
    pageNum: number
    pageSize: number
}

export const useFetchConversation = () => {
    const store = useConversationStore()
    const fetchConversionList = async (params: FetchConversationsParams) => {
        try {
            //TODO 目前getConversationlist 返回类型有问题待后续SDK优化，短期用any解决。
            const res: any = await EChatClient.getConversationlist()
            const resultList = res?.data?.channel_infos
            resultList.length &&
                resultList.forEach((channel: any) => {
                    store.createConversation('EASEAPI', { ...channel })
                })
        } catch (error) {}
    }
    return {
        fetchConversionList,
    }
}
