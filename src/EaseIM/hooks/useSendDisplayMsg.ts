/* 发送环信展示类型消息 */
/**
 * txt 文本
 * img 图片
 * file 文件
 * custom 自定义消息
 * video 视频
 * audio 语音
 * */
import { ref } from 'vue'
import { EChatSDK, EChatClient } from '@/EaseIM'
import { EMCreateMsgBodyType } from '@/EaseIM/types/messages'
import { useConversationStore, useMessagesStore } from '@/stores'
type MsgStatusType = 'sending' | 'succeed' | 'error'

export const useSendDisplayMsg = () => {
    const msgSendStatus = ref<MsgStatusType>() //消息发送状态
    const conversationStore = useConversationStore()
    const messagesStore = useMessagesStore()
    msgSendStatus.value = 'sending'
    const actionSendMessages = (messages: EMCreateMsgBodyType) => {
        return new Promise<any>((resolve, reject) => {
            const msg = EChatSDK.message.create(messages)
            if (msg.type !== 'channel' && msg.type !== 'read' && msg.type !== 'delivery') {
                EChatClient.send(msg)
                    .then((res) => {
                        resolve(res)
                        msgSendStatus.value = 'succeed'
                        console.log('>>>>>发送成功', msg)
                        // conversationStore.updateConversation(msg)
                        messagesStore.updateMessagesList('NEW_MSG', msg)
                    })
                    .catch((err) => {
                        reject(err)
                        console.log('>>>>>发送失败', err)
                    })
            }
        })
    }

    return { msgSendStatus, actionSendMessages }
}
