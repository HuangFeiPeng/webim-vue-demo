//引入环信SDK
// import EaseChatSDK from 'easemob-websdk'
import EaseChatSDK from '@/SDK/Easemob-chat'
import {
    DEFAULT_EASEMOB_CONNECTIONS_OPTIONS,
    CNNECTION_CUSTOM_CONFIG_KEY
} from './config'
import _ from 'lodash'
import { useLocalStorage } from '@vueuse/core'
const EM_CONNECTION_CUSTOM_CONFIG = useLocalStorage(
    CNNECTION_CUSTOM_CONFIG_KEY,
    {}
)
console.log('EM_CONNECTION_CUSTOM_CONFIG', EM_CONNECTION_CUSTOM_CONFIG.value)
let EaseChatClient = {}
/**
 * @param {object} options
 * @example {appKey:'',isHttpDNS:false}
 * @description 初始化环信客户端，如果传入了自定义配置则实例化传入的自定义配置
 */
const initEasemChatClient = (options) => {
    if (
        options &&
        _.isObject(options) &&
        Array.from(Object.keys(options)).length
    ) {
        EaseChatClient = new EaseChatSDK.connection(
            _.assign(DEFAULT_EASEMOB_CONNECTIONS_OPTIONS, ...options)
        )
    } else {
        EaseChatClient = new EaseChatSDK.connection(
            _.assign(DEFAULT_EASEMOB_CONNECTIONS_OPTIONS)
        )
    }
}

initEasemChatClient()
if (Array.from(EM_CONNECTION_CUSTOM_CONFIG.value)) {
    initEasemChatClient(EM_CONNECTION_CUSTOM_CONFIG.value)
}
export { EaseChatSDK, EaseChatClient, initEasemChatClient }
