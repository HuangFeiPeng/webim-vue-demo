import { nextTick } from 'vue'
interface Params {
    className: string
    direction: 'up' | 'bottom'
}
//direction滚动方向 bottom向下滚动 up表示正常在可视区域
export const useMessagesScroll = (params: Params): void => {
    const { className, direction } = params
    //direction滚动方向 bottom向下滚动 normal向上滚动
    nextTick(() => {
        const messageNodeList = document.querySelectorAll(`.${className}`)
        // console.log('messageNodeList', messageNodeList)
        const fistMsgElement = messageNodeList[0]
        const lastMsgElement = messageNodeList[messageNodeList.length - 1]
        //直接滚动置底
        if (direction === 'bottom') {
            console.log('>>>滚动置底')
            lastMsgElement && lastMsgElement.scrollIntoView(false)
        }
        //保持当前的消息位于当前可视窗口
        if (direction === 'up') {
            fistMsgElement.scrollIntoView(true)
        }
    })
}
