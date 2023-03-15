/* 环信连接相关监听回调 */
import { onBeforeMount, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { EChatClient } from '../index'
import { LISTENNER_EVENT_NAME } from '../types'
import { useLoginStore, useContactsStore, useGroupsStore, useSystemNotfiStore } from '@/stores'
export const useEMConnectListener = () => {
    const router = useRouter()
    const loginStore = useLoginStore()
    const contactsStore = useContactsStore()
    const groupsStore = useGroupsStore()
    const systemNotfiStore = useSystemNotfiStore()
    const initLoginNeedData = async () => {
        const loginHxId = EChatClient.user
        loginStore.isLogined = false
        loginStore.initLoginState({ loginHxId })
        loginStore.fetchLoginUserProfile()
        contactsStore.fetchContactsData(true)
        groupsStore.fetchJoinedGroups()
        systemNotfiStore.initSystemNotfiList()
    }
    onBeforeMount(() => {
        EChatClient.addEventHandler(LISTENNER_EVENT_NAME.connect, {
            onConnected: () => {
                console.log('%cEaseIM 已连接', 'color:green;')
                router.replace('/home')
                initLoginNeedData()
            },
            onDisconnected: () => {
                console.log('%cEaseIM 已断开', 'color:red;')
                router.replace('/login')
            },
        })
    })
    onUnmounted(() => {
        EChatClient.removeEventHandler(LISTENNER_EVENT_NAME.connect)
    })
}
