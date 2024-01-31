import { defineStore } from 'pinia'
import { UpdateOwnUserInfoParams } from 'easemob-websdk/types/indexApi'
import _ from 'lodash'
interface State {
    isLogined: boolean
    loginEMId: string
    loginUserProfile: UpdateOwnUserInfoParams
}
interface InitLoginParams {
    loginEMId: string
}
export const useLoginStore = defineStore('loginStore', {
    state: (): State => {
        return {
            isLogined: false,
            loginEMId: '',
            loginUserProfile: {},
        }
    },
    getters: {
        getLoginInfos: (state) => {
            return { loginEMId: state.loginEMId, ...state.loginUserProfile }
        },
    },
    actions: {
        initLoginState(params: InitLoginParams) {
            const { loginEMId } = params
            this.$state.loginEMId = loginEMId
            this.$state.isLogined = true
        },
    },
})
