import { EMClient } from '../index'
import _ from 'lodash'
import { UpdateOwnUserInfoParams } from 'easemob-websdk/types/indexApi'
import { useLoginStore, useContactsStore } from '@/stores'
export const emUserInofs = () => {
    const loginStore = useLoginStore()
    const contactsStore = useContactsStore()
    const fetchUserInfoWithLoginId = () => {
        const userId = EMClient.user
        if (userId) {
            return EMClient.contact.fetchUserInfoById(userId).then((res) => {
                if (res?.data) {
                    loginStore.loginUserProfile = res.data[userId]
                }
            })
        }
    }
    const fetchOtherInfoFromServer = (userList: string[]) => {
        let friendList: string[] = []
        friendList = Object.assign([], userList)
        if (friendList.length < 99) {
            return EMClient.contact
                .fetchUserInfoById(friendList)
                .then((res) => {
                    if (res?.data) {
                        for (const key in res.data) {
                            if (Object.prototype.hasOwnProperty.call(res.data, key)) {
                                const userInfo = res.data[key]
                                contactsStore.contactsProfile.set(key, userInfo)
                            }
                        }
                    }
                    Promise.resolve(res)
                })
                .catch((err) => {
                    console.log(err)
                    Promise.reject(err)
                })
        } else {
            const newArr = _.chunk(friendList, 99)
            return Promise.all(
                newArr.map((item) => {
                    return EMClient.contact.fetchUserInfoById(item)
                }),
            )
        }
    }
    const updateUserInfosFromServer = (params: UpdateOwnUserInfoParams) => {
        return EMClient.contact.updateOwnUserInfo({ ...params })
    }
    return {
        fetchUserInfoWithLoginId,
        fetchOtherInfoFromServer,
        updateUserInfosFromServer,
    }
}
