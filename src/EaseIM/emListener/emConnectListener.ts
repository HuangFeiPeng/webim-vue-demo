import { EMClient } from '../index'
import { useRouter } from 'vue-router'
import { LISTENNER_EVENT_NAME } from '../types'
import { useLoginStore, useContactsStore, useGroupsStore, useSystemNotfiStore } from '@/stores'
export const emConnectListener = () => {
    console.log('%cEaseIM connect mounted', 'color:blue;')
    const router = useRouter()
    const loginStore = useLoginStore()
    const contactsStore = useContactsStore()
    const groupsStore = useGroupsStore()
    const systemNotfiStore = useSystemNotfiStore()
    EMClient.addEventHandler(LISTENNER_EVENT_NAME.connect, {
        onConnected: () => {
            console.log('%cEaseIM 已连接', 'color:green;')
            if (!loginStore.isLogined) {
                router.replace('/home')
                loginStore.isLogined = true
            }
        },
        onDisconnected: () => {
            console.log('%cEaseIM 已断开', 'color:red;')
            router.replace('/login')
        },
    })
}
