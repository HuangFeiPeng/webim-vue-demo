import { EMClient } from '../index'
import _ from 'lodash'
import { useRouter } from 'vue-router'
import { LISTENNER_EVENT_NAME } from '../types'
import { emUserInofs, emContacts } from '../emApis'
import { useLoginStore, useContactsStore, useGroupsStore, useSystemNotfiStore } from '@/stores'
export const emConnectListener = () => {
    console.log('%cEaseIM connect mounted', 'color:blue;')
    const router = useRouter()
    const loginStore = useLoginStore()
    const contactsStore = useContactsStore()
    const groupsStore = useGroupsStore()
    const systemNotfiStore = useSystemNotfiStore()
    const { fetchUserInfoWithLoginId, fetchOtherInfoFromServer } = emUserInofs()
    const { fetchContactsListFromServer } = emContacts()
    const fetchLoginNeedEMData = async () => {
        await fetchUserInfoWithLoginId()
        const contactsRes = await fetchContactsListFromServer()
        await fetchOtherInfoFromServer(_.map(contactsRes, 'userId'))
    }
    EMClient.addEventHandler(LISTENNER_EVENT_NAME.connect, {
        onConnected: () => {
            console.log('%cEaseIM 已连接', 'color:green;')
            if (!loginStore.isLogined) {
                router.replace('/home')
                loginStore.isLogined = true
            }
            fetchLoginNeedEMData()
        },
        onDisconnected: () => {
            console.log('%cEaseIM 已断开', 'color:red;')
            router.replace('/login')
        },
    })
}
