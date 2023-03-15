<script setup>
import { ref, watch, nextTick, computed, onMounted } from 'vue'
import _ from 'lodash'
import { EaseChatClient } from '@/IM/initwebsdk'
import { useStore } from 'vuex'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { messageType, warningText } from '@/constant'
import { ElMessage } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import waterMark from '@/utils/waterMark'
/* 组件 */
import MessageList from './components/messageList.vue'
import InputBox from './components/inputBox.vue'
/* store */
const store = useStore()
/* route */
const route = useRoute()
const { CHAT_TYPE } = messageType
const { EASEIM_HINT, SWINDLER_GO_DIE, WARM_TIP } = warningText
const nowPickInfo = ref({})
const friendList = computed(() => store.state.Contacts.friendList)
const groupList = computed(() => store.state.Contacts.groupList)
/* loginstatus */
const loginState = computed(() => store.state.loginState)

/* warningTips */
const isShowWarningTips = computed(() => store.state.isShowWarningTips)
const randomTips = computed(() => {
    return _.toString(_.sampleSize(SWINDLER_GO_DIE, 1))
})
/* warterMark */
onMounted(() => {
    const chatContainer = document.querySelector('.chat_message_main')
    setTimeout(() => {
        waterMark({ container: chatContainer })
    }, 0)
})
const closeWarningTips = () => store.commit('CLOSE_WARNING_TIPS')
/* userInfo */
//获取路由ID对应的信息
const getIdInfo = async ({ id, chatType }) => {
    //类型为单聊
    if (chatType === CHAT_TYPE.SINGLE) {
        if (friendList.value[id]) {
            nowPickInfo.value.userInfo = friendList.value[id]
        } else {
            return
        }
    }
    //类型为群组
    if (chatType === CHAT_TYPE.GROUP) {
        const goupid =
            groupList.value[id]?.groupid && groupList.value[id]?.groupid
        goupid && (await store.dispatch('fetchMultiGoupsInfos', goupid))
        if (groupList.value[id]?.groupDetail) {
            return (nowPickInfo.value.groupDetail =
                groupList.value[id].groupDetail)
        } else {
            //如果不存在用户属性则请求获取该群群详情。
            await store.dispatch('getAssignGroupDetail', id)
            return (nowPickInfo.value.groupDetail =
                groupList.value[id].groupDetail)
        }
    }
}
//监听路由改变获取对应的getIdInfo
const stopWatchRoute = watch(
    () => route.query,
    (routeVal) => {
        console.log('>>>>>>>>监听到路由参数变化', routeVal)
        if (routeVal) {
            nowPickInfo.value = { ...routeVal }
            loginState.value && getIdInfo(routeVal)
        }
    },
    {
        immediate: true
    }
)
//离开该路由销毁route监听
onBeforeRouteLeave(() => {
    stopWatchRoute()
})
/* 消息相关 */
const loadingHistoryMsg = ref(false) //是否正在加载中
const isMoreHistoryMsg = ref(true) //加载文案展示为加载更多还是已无更多。
const notScrollBottom = ref(false) //是否滚动置底
//获取历史记录
const fechHistoryMessage = (loadType) => {
    if (!nowPickInfo.value) return []
    return async () => {
        loadingHistoryMsg.value = true
        notScrollBottom.value = true
        if (loadType == 'fistLoad') {
            const { messages } = await store.dispatch('getHistoryMessage', {
                ...nowPickInfo.value,
                cursor: -1
            })
            if (messages.length > 0) {
                //返回数组有数据显示加载更多
                isMoreHistoryMsg.value = true
            } else {
                //否则已无更多。
                isMoreHistoryMsg.value = false
            }
            setTimeout(() => {
                scrollMessageList('bottom')
            }, 500)
        } else {
            const fistMessageId =
                messageData.value[0] && messageData.value[0].id
            const { messages } = await store.dispatch('getHistoryMessage', {
                ...nowPickInfo.value,
                cursor: fistMessageId
            })
            if (messages.length > 0) {
                //返回数组有数据显示加载更多
                isMoreHistoryMsg.value = true
            } else {
                //否则已无更多。
                isMoreHistoryMsg.value = false
            }
            scrollMessageList('normal')
        }
        loadingHistoryMsg.value = false
        notScrollBottom.value = false
    }
}
//获取其id对应的消息内容
const messageData = computed(() => {
    //如果Message.messageList中不存在的话调用拉取漫游取一下历史消息
    if (store.state.loginState) {
        return (
            (nowPickInfo.value.id &&
                store.state.Message.messageList[nowPickInfo.value.id]) ||
            fechHistoryMessage('fistLoad')()
        )
    }
})

const messageContainer = ref(null)
//控制消息滚动
const scrollMessageList = (direction) => {
    console.log('>>>>>scrollMessageList', direction)
    //direction滚动方向 bottom向下滚动 normal向上滚动
    nextTick(() => {
        const messageNodeList = document.querySelectorAll('.messageList_box')
        const fistMsgElement = messageNodeList[0]
        const lastMsgElement = messageNodeList[messageNodeList.length - 1]
        //直接滚动置底
        if (direction === 'bottom') {
            console.log('>>>滚动置底')
            lastMsgElement && lastMsgElement.scrollIntoView(false)
        }
        //保持当前的消息位于当前可视窗口
        if (direction === 'normal') {
            fistMsgElement.scrollIntoView(true)
        }
    })
}
//等待机器人回复
const waitRobotReplyState = ref(false)
const changeRobotReplayState = (state) => {
    waitRobotReplyState.value = state
}
watch(
    () => _.cloneDeep(messageData.value),
    (newMsg, oldMsg) => {
        nextTick(() => {
            //获取最后一条消息，如果不为当前登录ID则清除等待问答状态。
            const lastMsg = newMsg?.length && newMsg[newMsg.length - 1]
            if (lastMsg && lastMsg.from !== EaseChatClient.user) {
                waitRobotReplyState.value = false
            }
            console.log('>>>>>监听到消息变化', notScrollBottom.value)
            //判断拉取漫游导致的消息变化不需要执行滚动置底
            if (notScrollBottom.value) {
                return
            } else {
                setTimeout(() => {
                    scrollMessageList('bottom')
                }, 300)
            }
        })
    },
    {
        deep: true,
        immediate: true
    }
)
//监听到nowPickInfo改变 让消息直接置底
watch(
    () => route.query,
    () => {
        if (Object.keys(nowPickInfo.value).length > 0) {
            nextTick(() => {
                scrollMessageList('bottom')
            })
        }
    }
)
</script>
<template>
    <el-container class="app_container">
        <el-header class="chat_message_header">
            <template v-if="nowPickInfo.chatType === CHAT_TYPE.SINGLE">
                <div v-if="nowPickInfo.userInfo" class="chat_user_box">
                    <span class="chat_user_name">
                        {{
                            nowPickInfo.userInfo.nickname || nowPickInfo.id
                        }}</span
                    >
                </div>
                <div v-else>
                    {{ nowPickInfo.id }}
                </div>
            </template>
        </el-header>
        <div v-if="isShowWarningTips" class="easeim_safe_tips">
            <p>{{ EASEIM_HINT }}</p>
            <p>【防骗提示】{{ randomTips }}</p>
            <p
                v-show="
                    nowPickInfo.chatType === CHAT_TYPE.GROUP &&
                    nowPickInfo?.groupDetail?.custom !== 'default'
                "
            >
                {{ WARM_TIP }}
            </p>
            <span class="easeim_close_tips" @click="closeWarningTips">
                <el-icon>
                    <Close />
                </el-icon>
            </span>
        </div>
        <el-main class="chat_message_main">
            <el-scrollbar class="main_container" ref="messageContainer">
                <div class="innerRef">
                    <div v-show="isMoreHistoryMsg" class="chat_message_tips">
                        <div
                            v-show="
                                messageData?.length &&
                                messageData[0].type !== 'inform'
                            "
                            class="load_more_msg"
                        >
                            <el-link
                                v-show="!loadingHistoryMsg"
                                :disabled="!isMoreHistoryMsg"
                                :underline="false"
                                @click="fechHistoryMessage()()"
                            >
                                加载更多
                            </el-link>
                            <el-link v-show="loadingHistoryMsg" disabled
                                >消息加载中...</el-link
                            >
                        </div>
                    </div>
                    <MessageList
                        :messageData="messageData"
                        :waitRobotReplyState="waitRobotReplyState"
                        @scrollMessageList="scrollMessageList"
                    />
                </div>
            </el-scrollbar>
        </el-main>
        <el-footer class="chat_message_inputbar">
            <InputBox
                ref="inputBox"
                :nowPickInfo="nowPickInfo"
                :waitRobotReplyState="waitRobotReplyState"
                @changeRobotReplayState="changeRobotReplayState"
            />
        </el-footer>
    </el-container>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>
