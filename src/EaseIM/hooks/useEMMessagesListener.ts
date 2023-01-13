/* 环信消息监听回调 */
import { onBeforeMount, onUnmounted } from 'vue'
import { EChatClient } from '../index'
import { useConversationStore } from '@/stores/conversations'
import { useMessagesStore } from '@/stores/messages'
export const useEMMessagesListener = () => {
    const conversationStore = useConversationStore()
    const messagesStore = useMessagesStore()
    onBeforeMount(() => {
        EChatClient.addEventHandler('emMessages', {
            // 当前用户收到文本消息。
            onTextMessage: function (message) {
                console.log('%cEaseIM onTextMessage', 'color:green;', message)
                conversationStore.updateConversation(message)
                messagesStore.updateMessagesList('NEW_MSG', message)
            },
            // 当前用户收到图片消息。
            onImageMessage: function (message) {
                console.log('%cEaseIM onImageMessage', 'color:green;', message)

                conversationStore.updateConversation(message)
                messagesStore.updateMessagesList('NEW_MSG', message)
            },
            // 当前用户收到透传消息。
            onCmdMessage: function (message) {
                console.log('%cEaseIM onCmdMessage', 'color:green;', message)
                //?命令消息可能按时不用，暂时不进行添加更新。

                // conversationStore.updateConversation(message)
                // messagesStore.updateMessagesList(message)
            },
            // 当前用户收到语音消息。
            onAudioMessage: function (message) {
                console.log('%cEaseIM onAudioMessage', 'color:green;', message)
                conversationStore.updateConversation(message)
                messagesStore.updateMessagesList('NEW_MSG', message)
            },
            // 当前用户收到位置消息。
            onLocationMessage: function (message) {
                console.log('%cEaseIM onLocationMessage', 'color:green;', message)
                conversationStore.updateConversation(message)
                messagesStore.updateMessagesList('NEW_MSG', message)
            },
            // 当前用户收到文件消息。
            onFileMessage: function (message) {
                console.log('%cEaseIM onFileMessage', 'color:green;', message)
                conversationStore.updateConversation(message)
                messagesStore.updateMessagesList('NEW_MSG', message)
            },
            // 当前用户收到自定义消息。
            onCustomMessage: function (message) {
                console.log('%cEaseIM onCustomMessage', 'color:green;', message)
                conversationStore.updateConversation(message)
                messagesStore.updateMessagesList('NEW_MSG', message)
            },
            // 当前用户收到视频消息。
            onVideoMessage: function (message) {
                console.log('%cEaseIM onCustonVideoMessageomMessage', 'color:green;', message)
                conversationStore.updateConversation(message)
                messagesStore.updateMessagesList('NEW_MSG', message)
            },
        })
    })
    onUnmounted(() => {
        EChatClient.removeEventHandler('emMessages')
    })
}
