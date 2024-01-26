import { EMClient } from '../index'

export const emConnect = () => {
    const EMLoginWithPassword = async (username: string, password: string) => {
        return new Promise((resolve, reject) => {
            EMClient.open({
                username: username,
                password: password,
            })
                .then((res) => {
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
    const EMLoginWithAccessToken = async (username: string, accessToken: string) => {
        return new Promise((resolve, reject) => {
            EMClient.open({
                username: username,
                accessToken: accessToken,
            })
                .then((res) => {
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
    const EMLogout = async () => {
        EMClient.close()
    }
    return {
        EMLoginWithPassword,
        EMLoginWithAccessToken,
        EMLogout,
    }
}
