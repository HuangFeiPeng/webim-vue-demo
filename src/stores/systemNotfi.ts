import { defineStore } from 'pinia'
import { SystemNotfiParams } from '@/EaseIM/types'
import { useLocalStorage } from '@vueuse/core'
import { EChatClient } from '@/EaseIM'

import _ from 'lodash'
interface State {
    systemNotificationList: SystemNotfiParams[]
}
export const useSystemNotfiStore = defineStore('systemNotfiStore', {
    state: (): State => ({
        systemNotificationList: [],
    }),
    getters: {
        unReadNotifCount(state: State) {
            return state.systemNotificationList.filter((item) => !item.isReaded).length
        },
    },
    actions: {
        //初始化系统存储本地数据
        initSystemNotfiList() {
            const localSystemNotfiData = useLocalStorage<SystemNotfiParams[]>(`EM_${EChatClient.user}_INFORM`, [])
            this.$state.systemNotificationList = localSystemNotfiData.value
        },

        //添加一条系统通知
        addSystemNotfi(systemNotfi: SystemNotfiParams): void {
            const systemNotificationList = _.assign([], this.$state.systemNotificationList)
            systemNotificationList.unshift(systemNotfi)
            this.$state.systemNotificationList = systemNotificationList
            console.log('addSystemNotfi')
        },
    },
})
