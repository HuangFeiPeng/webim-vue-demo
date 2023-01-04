/* 用以获取消息存储格式时的key */
export const getEMKey = (loginId: string, fromId: string, toId: string, chatType: string): string => {
    let key = ''
    if (chatType === 'singleChat') {
        if (loginId === fromId) {
            key = toId
        } else {
            key = fromId
        }
    } else if (chatType === 'groupChat') {
        key = toId
    }
    return key
}
