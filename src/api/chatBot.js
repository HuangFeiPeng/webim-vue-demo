import request from '@/utils/request'
//获取机器人名字
export function fetchChatBotName() {
    return request({
        url: '/inside/chatGPT/robot/name',
        baseURL: '//a41.easemob.com',
        method: 'get'
    })
}
