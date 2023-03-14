import { defineStore } from 'pinia'
import { EChatClient, EasemobChat } from '@/EaseIM'
import _ from 'lodash'
interface GroupInfo extends EasemobChat.GroupDetailInfo {
    groupName?: string
    groupId?: string
}
interface State {
    groups: {
        [index: string]: {
            groupid: string
            groupInfo?: GroupInfo
        }
    }
}
export const useGroupsStore = defineStore('groupsStore', {
    state: (): State => {
        return {
            groups: {},
        }
    },
    getters: {},
    actions: {
        async fetchJoinedGroups(pageNum = 0) {
            // TODO:此接口类型确实较多，待后续SDK修复BaseGroupInfo 类型定义不全，暂时用any解决。
            return new Promise<any[]>((resolve, reject) => {
                EChatClient.getJoinedGroups({
                    pageNum: pageNum,
                    pageSize: 20,
                    needAffiliations: true,
                    needRole: true,
                })
                    .then((res: any) => {
                        if (res?.entities) {
                            res.entities &&
                                res.entities.forEach((group: any) => {
                                    this.$state.groups[group.groupId] = {
                                        groupid: group.groupId,
                                        groupInfo: { ...group },
                                    }
                                })
                            resolve(res.entities)
                        }
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        },
        async fetchGroupsInfos(groupId: string | string[]) {
            console.log('groupId', groupId)
            const res = await EChatClient.getGroupInfo({ groupId })
            if (res?.data) {
                res.data.length &&
                    res.data.forEach((groupInfo) => {
                        if (this.$state.groups[groupInfo.id]) {
                            this.$state.groups[groupInfo.id] = _.merge(this.$state.groups[groupInfo.id], {
                                groupid: groupInfo.id,
                                groupInfo: { ...groupInfo },
                            })
                        } else {
                            this.$state.groups[groupInfo.id] = { groupid: groupInfo.id, groupInfo: { ...groupInfo } }
                        }
                    })
            }
        },
    },
})
