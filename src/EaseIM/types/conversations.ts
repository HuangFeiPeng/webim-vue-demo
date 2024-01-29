import type { ServerConversations, ConversationItem } from 'easemob-websdk/types/indexApi'
import type {
    MessageBody,
    DeliveryMsgBody,
    ReadMsgBody,
    ChannelMsgBody,
    CmdMsgBody,
} from 'easemob-websdk/types/message'
export type ConversationChatType = 'singleChat' | 'groupChat'
export type LastMessageBody = Exclude<MessageBody, DeliveryMsgBody | ReadMsgBody | ChannelMsgBody | CmdMsgBody>
export interface ConversationListItem extends ConversationItem {
    /** The last message in the conversation. */
    /** 最近的一条消息。*/
    lastMessage: LastMessageBody
}
