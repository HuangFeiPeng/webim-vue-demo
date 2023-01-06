import { defineStore } from 'pinia'
import { EChatClient, EasemobChat } from '@/EaseIM'
import _ from 'lodash'
interface State {
    isLogined: boolean
    loginHxId: string
    loginUserProfile: {
        [key: string]: EasemobChat.UpdateOwnUserInfoParams
    }
}
interface InitLoginParams {
    loginHxId: string
}
interface GetLoginInfos extends EasemobChat.UpdateOwnUserInfoParams {
    loginHxId: string
}
export const useLoginStore = defineStore('loginStore', {
    state: (): State => {
        return {
            isLogined: false,
            loginHxId: '',
            loginUserProfile: {},
        }
    },
    getters: {
        getLoginInfos: (state) => {
            const result: GetLoginInfos = { loginHxId: state.loginHxId, ...state.loginUserProfile }
            return result
        },
    },
    actions: {
        initLoginState(params: InitLoginParams) {
            const { loginHxId } = params
            this.$state.loginHxId = loginHxId
            this.$state.isLogined = true
        },
        async fetchLoginUserProfile() {
            try {
                const loginHxId = this.$state.loginHxId
                const res = await EChatClient.fetchUserInfoById(loginHxId)
                if (res?.data) {
                    _.merge(this.$state.loginUserProfile, res.data[loginHxId])
                }
            } catch (error) {}
        },
    },
})
