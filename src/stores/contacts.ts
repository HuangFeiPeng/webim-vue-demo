import { defineStore } from 'pinia'
import { EChatClient, EasemobChat } from '@/EaseIM'
import _ from 'lodash'
import { pinyin } from 'pinyin-pro'
import { ContactItem, UpdateOwnUserInfoParams } from 'easemob-websdk/types/indexApi'

interface State {
    contactsList: ContactItem[]
    contactsProfile: Map<string, UpdateOwnUserInfoParams>
}
export const useContactsStore = defineStore('contactsStore', {
    state: (): State => {
        return {
            contactsList: [],
            contactsProfile: new Map(),
        }
    },
    getters: {
        // getSortPinyinFriendItem: (state) => {
        //     const resultObj: Map<string, UpdateOwnUserInfoParams[]> = new Map()
        //     const containerObj: MapKey = {}
        //     for (const key in state.contacts) {
        //         if (Object.hasOwnProperty.call(state.contacts, key)) {
        //             const v = state.contacts[key]
        //             let pinyinKey = (
        //                 v.nickname
        //                     ? pinyin(v.nickname, { pattern: 'initial' })[0]
        //                     : pinyin(v.hxId, { pattern: 'initial' })[0]
        //             ).toUpperCase()
        //             //不适用于拼音规则的转换会为空，因此替换为#展示。
        //             if (pinyinKey === ' ') {
        //                 pinyinKey = '#'
        //             }
        //             if (containerObj[pinyinKey]) {
        //                 containerObj[pinyinKey].push(v)
        //             } else {
        //                 containerObj[pinyinKey] = []
        //                 containerObj[pinyinKey].push(v)
        //             }
        //         }
        //     }
        //     const resultObjKeys = _.sortBy(_.keys(containerObj))
        //     resultObjKeys.forEach((a) => {
        //         resultObj[a] = containerObj[a]
        //     })
        //     return resultObj
        // },
    },
    actions: {
        //获取用户好友列表
        // async fetchContactsData(needMetadata: boolean) {
        //     try {
        //         const res = await EChatClient.getContacts()
        //         if (res?.data) {
        //             res.data.length &&
        //                 res.data.forEach((user) => {
        //                     this.$state.contacts[user] = { hxId: user }
        //                 })
        //             //如果需要获取用户属性则执行fetchUsersInfo
        //             needMetadata && this.fetchUsersInfo(res.data)
        //         }
        //         console.log('好友列表拉取成功', res)
        //     } catch (error) {
        //         console.log('>>>>>请求失败')
        //     }
        // },
        //获取指定用户属性
        // async fetchUsersInfo(users: string[]) {
        //     if (!users.length) return
        //     const fetchUsersTask: Promise<
        //         EasemobChat.AsyncResult<{
        //             [key: string]: EasemobChat.UpdateOwnUserInfoParams
        //         }>
        //     >[] = []
        //     try {
        //         if (users.length > 99) {
        //             const splicedUsersList = _.chunk(users, 99)
        //             splicedUsersList.forEach((usersList) => {
        //                 fetchUsersTask.push(EChatClient.fetchUserInfoById(usersList))
        //             })
        //             const resList = await Promise.all(fetchUsersTask)
        //             resList.length &&
        //                 resList.forEach((res) => {
        //                     res?.data && _.merge(this.$state.contacts, res.data)
        //                 })
        //         } else {
        //             const res = await EChatClient.fetchUserInfoById(users)
        //             if (res?.data) {
        //                 _.merge(this.$state.contacts, res.data)
        //             }
        //             console.log('>>>>>用户属性接口返回', res)
        //         }
        //     } catch (error) {
        //         console.log('>>>>用户属性获取失败', error)
        //     }
        // },
    },
})
