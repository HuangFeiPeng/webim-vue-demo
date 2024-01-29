import { EMClient, EasemobChat } from '../index'
import { useConversationStore } from '@/stores'
export const emConversation = () => {
    const conversationStore = useConversationStore()
    const fetchConversationFromServer = (pageSize: number, cursor: string) => {
        return EMClient.contact
            .getServerConversations({ pageSize, cursor })
            .then((res) => {
                if (res.data) {
                    conversationStore.createConversation(res.data)
                    return Promise.resolve(res.data)
                }
                // res.data && conversationStore.createConversation(res.data)
            })
            .catch((err) => {
                return Promise.reject(err)
            })
    }

    return {
        fetchConversationFromServer,
    }
}
