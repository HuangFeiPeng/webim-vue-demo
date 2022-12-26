import EChatSDK, { EasemobChat } from 'easemob-websdk'

import { EASEIM_APPKEY, EASEIM_USE_OWNURL } from '@/config/im_config'
const EChatClient = new EChatSDK.connection({
    appKey: EASEIM_APPKEY,
    useOwnUploadFun: EASEIM_USE_OWNURL,
})
export { EChatClient, EChatSDK, EasemobChat }
