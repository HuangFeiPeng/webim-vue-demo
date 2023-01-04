import { onBeforeMount, onUnmounted } from 'vue'
import { EChatClient } from '../index'
import { useConversationStore } from '@/stores/conversations'
export const useEMMessagesListener = () => {
    const store = useConversationStore()
    onBeforeMount(() => {
        EChatClient.addEventHandler('emMessages', {
            // 当前用户收到文本消息。
            onTextMessage: function (message) {
                console.log('%cEaseIM onTextMessage', 'color:green;', message)
                store.updateConversation(message)
            },
            // 当前用户收到图片消息。
            onImageMessage: function (message) {
                console.log('%cEaseIM onImageMessage', 'color:green;', message)
                store.updateConversation(message)
            },
            // 当前用户收到透传消息。
            onCmdMessage: function (message) {
                console.log('%cEaseIM onCmdMessage', 'color:green;', message)
                store.updateConversation(message)
            },
            // 当前用户收到语音消息。
            onAudioMessage: function (message) {
                console.log('%cEaseIM onAudioMessage', 'color:green;', message)
                store.updateConversation(message)
            },
            // 当前用户收到位置消息。
            onLocationMessage: function (message) {
                console.log('%cEaseIM onLocationMessage', 'color:green;', message)
                store.updateConversation(message)
            },
            // 当前用户收到文件消息。
            onFileMessage: function (message) {
                console.log('%cEaseIM onFileMessage', 'color:green;', message)
                store.updateConversation(message)
            },
            // 当前用户收到自定义消息。
            onCustomMessage: function (message) {
                console.log('%cEaseIM onCustomMessage', 'color:green;', message)
                store.updateConversation(message)
            },
            // 当前用户收到视频消息。
            onVideoMessage: function (message) {
                console.log('%cEaseIM onCustonVideoMessageomMessage', 'color:green;', message)
                store.updateConversation(message)
            },
        })
    })
    onUnmounted(() => {
        EChatClient.removeEventHandler('emMessages')
    })
}
