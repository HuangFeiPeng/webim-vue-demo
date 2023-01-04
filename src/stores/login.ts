import { defineStore } from 'pinia'
interface InitLoginParams {
    loginHxId: string
}
export const useLoginStore = defineStore('loginStore', {
    state: () => {
        return {
            isLogined: false,
            loginHxId: '',
        }
    },
    getters: {
        getLoginInfos: (state) => {
            return { loginHxId: state.loginHxId }
        },
    },
    actions: {
        initLoginState(params: InitLoginParams) {
            const { loginHxId } = params
            this.$state.loginHxId = loginHxId
            this.$state.isLogined = true
        },
    },
})
