import _ from 'lodash'
import store from '@/store'
import { EaseChatClient } from '@/IM/initwebsdk'
const getUpdateConversation = (conversationId, conversationType) => {
    let updatedConversationItem = {}
    //根据传入的conversationId查找需要更新的会话列表
    const findIncludesConversation = (conversationId) => {
        const localConversationList = store.state.Conversation.conversationList
        const isIncludesList = localConversationList.filter(
            (item) => item.conversationId === conversationId
        )
        //不存在则创建
        if (!isIncludesList.length) {
            buildConversationItem('create')
        }
        //存在则更新
        else {
            buildConversationItem('update', isIncludesList[0])
        }
    }
    const getLastMessageBody = () => {
        const messageState = store.state.Message.messageList
        const sourceMessageList = messageState[conversationId]
        if (sourceMessageList && sourceMessageList.length) {
            return sourceMessageList[sourceMessageList.length - 1]
        }
    }
    const handleCalcUnReadNum = (msgBody, toDoUpdateConversation) => {
        // 确定当前未读数，如果会话不存在，未读数初始为0
        let currentUnreadNum = toDoUpdateConversation
            ? toDoUpdateConversation.unReadCount
            : 0
        // 如果消息来自当前用户，或者是被召回的消息，或者消息处于读取状态，未读数不变
        if (
            msgBody.from === EaseChatClient.user ||
            msgBody.isRecall ||
            msgBody.read
        ) {
            return currentUnreadNum
        }

        //如果会话不存在，则返回未读数为1
        if (!toDoUpdateConversation) {
            return 1
        }

        //如果消息包含修改信息，未读数不变
        if (msgBody.modifiedInfo) {
            return currentUnreadNum
        }

        // 其他情况，未读数+1
        return currentUnreadNum + 1
    }
    const buildConversationItem = (type, lastConversationItem) => {
        const conversationItem = {
            /** 会话ID。*/
            conversationId: '',
            /** The conversation type. */
            /** 会话类型。*/
            conversationType: '',
            /** The conversation unread count. */
            /** 会话未读数。*/
            unReadCount: 0,
            /** The conversation last message. */
            /** 最近的一条消息。*/
            lastMessage: getLastMessageBody(),
            /** The custom filed. */
            /** 自定义字段。*/
            customField: {}
        }
        if (type === 'create') {
            conversationItem.conversationId = conversationId
            conversationItem.conversationType = conversationType
            conversationItem.unReadCount = handleCalcUnReadNum(
                getLastMessageBody()
            )
            return (updatedConversationItem = conversationItem)
        } else if (type === 'update') {
            conversationItem.conversationId = conversationId
            conversationItem.conversationType = conversationType
            conversationItem.unReadCount = handleCalcUnReadNum(
                getLastMessageBody(),
                _.assign({}, lastConversationItem)
            )
            conversationItem.customField = _.assign(
                lastConversationItem.customField
            )
            return (updatedConversationItem = conversationItem)
        }
    }
    findIncludesConversation(conversationId)
    console.log('>>>>>updatedConversationItem', updatedConversationItem)
    return updatedConversationItem
}

export default getUpdateConversation
