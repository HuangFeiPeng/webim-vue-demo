import EChatSDK, { EasemobChat } from 'easemob-websdk'
import miniCore, { MiniCore } from 'easemob-websdk/miniCore/miniCore'
import contactPlugin from 'easemob-websdk/contact/contact'
import groupPlugin from 'easemob-websdk/group/group'
import { EM_APP_KEY, EM_USE_OWN_URL } from './config'
const EChatClient = new EChatSDK.connection({
    appKey: EM_APP_KEY,
    useOwnUploadFun: EM_USE_OWN_URL,
})

let EMClient = {} as MiniCore
EMClient = new miniCore({
    appKey: EM_APP_KEY,
    useOwnUploadFun: EM_USE_OWN_URL,
})
EMClient.usePlugin(contactPlugin, 'contact')
EMClient.usePlugin(groupPlugin, 'group')
// type MyFunctionParamType = Parameters<typeof EMClient.contact.setContactRemark>[0];
//TODO  设置日志输出等级，此处应为可配置
EChatSDK.logger.setLevel(4, false, 'none')
export { EChatClient, EChatSDK, EMClient, EasemobChat }
