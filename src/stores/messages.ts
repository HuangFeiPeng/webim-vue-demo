import { defineStore } from 'pinia'
import { EChatSDK, EChatClient, EasemobChat } from '@/EaseIM'
import { EMMsgType, EMCreateMsgBodyType } from '@/EaseIM/types/messages'
import _ from 'lodash'
import { getEMKey } from '@/utils/getEMKey'
type UpdateMessagesParams = EMMsgType
interface State {
    usersMessages: { [key: string]: UpdateMessagesParams[] }
}
type SourceMsgType = 'NEW_MSG' | 'HISTORY_MSG'
export const useMessagesStore = defineStore('messagesStore', {
    state: (): State => {
        return {
            usersMessages: {},
        }
    },
    getters: {},
    actions: {
        updateMessagesList(source: SourceMsgType, message: UpdateMessagesParams) {
            const { from, to, chatType } = message
            const key = getEMKey(EChatClient.user, from || EChatClient.user, to, chatType)
            if (source === 'NEW_MSG' && this.$state.usersMessages[key]) {
                this.$state.usersMessages[key].push(message)
            } else if (source === 'HISTORY_MSG' && this.$state.usersMessages[key]) {
                this.$state.usersMessages[key].unshift(message)
            } else {
                this.$state.usersMessages[key] = []
                this.$state.usersMessages[key].push(message)
            }
        },
    },
})
