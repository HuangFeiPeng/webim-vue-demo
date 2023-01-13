/* 环信与服务器建立回调方法 */
import { EChatClient } from '../index'
import { IloginOptions } from '../types/login'
export const useEMLogin = () => {
    const EMlogin = async (params: IloginOptions): Promise<void> => {
        //检测如果已连接return
        if (EChatClient.isOpened()) return
        const options = {
            user: params.imId,
            pwd: params.imPwd,
            accessToken: params.imToken,
        }
        const res = await EChatClient.open(options)
        //根据传入的参数判断是否需要缓存IM——TOKEN
        if (params.isCacheToken) {
            window.localStorage.setItem(`EM_${params.imId}_IM_TOKEN`, JSON.stringify(res.accessToken))
        }
    }
    //规划提供重连方法
    // const EMrelogin = (): void => {
    //     // EChatClient.open()
    // }
    const EMlogout = (): void => {
        EChatClient.close()
    }
    return {
        EMlogin,
        EMlogout,
    }
}
