import { onBeforeMount, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { EChatClient } from '../index'
import { useLoginStore, useContactsStore, useGroupsStore } from '@/stores'
export const useEMConnectListener = () => {
    const router = useRouter()
    const loginStore = useLoginStore()
    const contactsStore = useContactsStore()
    const groupsStore = useGroupsStore()
    const initLoginNeedData = async () => {
        const loginHxId = EChatClient.user
        loginStore.isLogined = false
        loginStore.initLoginState({ loginHxId })
        loginStore.fetchLoginUserProfile()
        contactsStore.fetchContactsData(true)
        groupsStore.fetchJoinedGroups()
    }
    onBeforeMount(() => {
        EChatClient.addEventHandler('emConnect', {
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
        EChatClient.removeEventHandler('emConnect')
    })
}
