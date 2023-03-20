/* 联系人相关监听回调 */
import { onBeforeMount, onUnmounted } from 'vue'
import { EChatClient } from '@/EaseIM'
import { SystemNotfiParams, LISTENNER_EVENT_NAME } from '@/EaseIM/types'
import { useContactsStore, useSystemNotfiStore } from '@/stores'
export const useContactsListener = () => {
    const contactsStore = useContactsStore()
    const systemNotfiStore = useSystemNotfiStore()
    onBeforeMount(() => {
        EChatClient.addEventHandler(LISTENNER_EVENT_NAME.contacts, {
            // 当前用户收到好友请求。用户 B 向用户 A 发送好友请求，用户 A 收到该事件。
            onContactInvited: function (msg) {
                const { from, status, to, type } = msg
                console.log('>>>>>收到好友申请', msg)
                const params: SystemNotfiParams = {
                    notifType: 'contacts',
                    from,
                    title: '好友申请',
                    content: status,
                    to: to,
                    type,
                    time: Date.now(),
                    isReaded: false,
                    isNeedHandle: true,
                }
                systemNotfiStore.addSystemNotfi(params)
            },
            // 当前用户被其他用户从联系人列表上移除。用户 B 将用户 A 从联系人列表上删除，用户 A 收到该事件。
            // onContactDeleted: function (msg) {},
            // 当前用户新增了联系人。用户 B 向用户 A 发送好友请求，用户 A 同意该请求，用户 A 收到该事件，而用户 B 收到 `onContactAgreed` 事件。
            // onContactAdded: function (msg) {},
            // 当前用户发送的好友请求被拒绝。用户 A 向用户 B 发送好友请求，用户 B 收到好友请求后，拒绝加好友，则用户 A 收到该事件。
            // onContactRefuse: function (msg) {},
            // 当前用户发送的好友请求经过了对方同意。用户 A 向用户 B 发送好友请求，用户 B 收到好友请求后，同意加好友，则用户 A 收到该事件。
            // onContactAgreed: function (msg) {},
        })
    })
    onUnmounted(() => {
        EChatClient.removeEventHandler(LISTENNER_EVENT_NAME.contacts)
    })
}
