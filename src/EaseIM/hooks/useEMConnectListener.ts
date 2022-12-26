import { onBeforeMount, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { EChatClient } from '../index'

export const useEMConnectListener = () => {
    const router = useRouter()
    onBeforeMount(() => {
        EChatClient.addEventHandler('emConnect', {
            onConnected: () => {
                console.log('%cEaseIM 已连接', 'color:green;')
                router.replace('/home')
            },
            onDisconnected: () => {
                console.log('%cEaseIM 已断开', 'color:red;')
                router.replace('/login')
            },
        })
    })
    onUnmounted(() => {
        EChatClient.removeEventHandler('emConnect')
    })
}
