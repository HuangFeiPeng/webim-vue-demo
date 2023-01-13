import EChatSDK, { EasemobChat } from 'easemob-websdk'

import { EASEIM_APPKEY, EASEIM_USE_OWNURL } from '@/config/im_config'
const EChatClient = new EChatSDK.connection({
    appKey: EASEIM_APPKEY,
    useOwnUploadFun: EASEIM_USE_OWNURL,
})

//TODO  设置日志输出等级，此处应为可配置
EChatSDK.logger.setLevel(4, false, 'none')
export { EChatClient, EChatSDK, EasemobChat }
