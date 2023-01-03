import { ChatType } from './index'
export type ConversationFromType = 'LOCAL' | 'EASEAPI'
export interface ConversationBody {
    id: string
    unReadNum: number
    msgFrom: string | undefined
    msgTo: string
    chatType: ChatType
    lastMessage: any
    time: string | number
}
