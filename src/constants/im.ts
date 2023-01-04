export enum EaseIMChatType {
    SINGLECHAT = 'singleChat',
    GROUPCHAT = 'groupChat',
}

// 置顶列表
export const STICK_LIST = 'STICK_LIST'

//需要特别展示的lastMsg

interface LastMsgPreview {
    [index: string]: string
}
export const LAST_MSG_PREVIEW: LastMsgPreview = {
    img: '[图片消息]',
    file: '[文件消息]',
    loc: '[位置消息]',
    audio: '[语音消息]',
}
