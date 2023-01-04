import { EaseIMChatType } from '@/constants/im'
export type ConversationChatType = 'singleChat' | 'groupChat'
export interface ConversationBody {
    id: string
    unReadNum: number
    msgFrom: string | undefined
    msgTo: string
    chatType: ConversationChatType
    lastMessage: any
    time: string | number
    isStick?: boolean
}
export type HandleStickType = 'STICK' | 'UNSTICK'
