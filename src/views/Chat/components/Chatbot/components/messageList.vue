<script setup>
import { reactive, ref, computed, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useClipboard, usePermission } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { EaseChatClient } from '@/IM/initwebsdk'
import dateFormat from '@/utils/dateFormater'
import { messageType } from '@/constant'
/* 默认头像 */
import defaultAvatar from '@/assets/images/avatar/theme2x.png'
/* vuex store */
const store = useStore()
/* props */
const props = defineProps({
    messageData: {
        type: [Array, Object],
        default: () => []
    },
    nowPickInfo: {
        type: Object,
        default: () => ({})
    },
    waitRobotReplyState: {
        type: Boolean,
        default: false
    }
})
/* emits */
const emit = defineEmits(['scrollMessageList', 'reEditMessage'])
const { messageData, waitRobotReplyState } = toRefs(props)
/* constant */
const { ALL_MESSAGE_TYPE, CUSTOM_TYPE } = messageType
/* login hxId */
const loginUserId = EaseChatClient.user

/* computed-- 消息来源是否为自己 */
const isMyself = computed(() => {
    return (msgBody) => {
        return msgBody.from === loginUserId
    }
})
/* 获取自己的用户信息 */
const loginUserInfo = computed(() => store.state.loginUserInfo)

/* 获取他人的用户信息 */
const otherUserInfo = computed(() => {
    return (otherId) => {
        const otherInfos = store.state.Contacts.friendList[otherId] || {
            avatarurl: defaultAvatar
        }
        return otherInfos
    }
})
/* 处理时间显示间隔 */
const handleMsgTimeShow = computed(() => {
    return (time, index) => {
        const msgList = Array.from(messageData.value)
        if (index !== 0) {
            const lastTime = msgList[index - 1].time
            if (time - lastTime > 50000) {
                return dateFormat('MM/DD/HH:mm', time)
            } else {
                return false
            }
        } else {
            return dateFormat('MM/DD/HH:mm', time)
        }
        return time
    }
})
//复制文本
const { copy, copied, isSupported } = useClipboard() //copy 复制方法 copied 是否已经复制 isSupported 是否支持剪切板
const copyTextMessages = (msg) => {
    copy(msg)
    if (copied) {
        ElMessage({
            type: 'success',
            message: '成功复制到剪切板',
            center: true
        })
        console.log('>>>>>成功复制')
    }
}

//打开免责声明
const openStatement = () =>
    window.open('https://www.easemob.com/protocol/chatbot')
</script>
<template>
    <div>
        <p class="inform_style">
            本会话基于外部API二次开发，仅供试用AI使用
            <span class="statement" @click="openStatement">查看免责声明</span>
        </p>
        <div
            class="messageList_box"
            v-for="(msgBody, index) in messageData"
            :key="msgBody.id"
        >
            <div
                v-if="
                    !msgBody.isRecall &&
                    msgBody.type !== ALL_MESSAGE_TYPE.INFORM
                "
                class="message_box_item"
                :style="{
                    flexDirection: isMyself(msgBody) ? 'row-reverse' : 'row'
                }"
            >
                <div class="message_item_time">
                    {{ handleMsgTimeShow(msgBody.time, index) || '' }}
                </div>
                <el-avatar
                    class="message_item_avator"
                    :src="
                        isMyself(msgBody)
                            ? loginUserInfo.avatarurl
                            : otherUserInfo(msgBody.from).avatarurl ||
                              defaultAvatar
                    "
                >
                </el-avatar>
                <el-dropdown
                    class="message_box_content"
                    :class="[
                        isMyself(msgBody)
                            ? 'message_box_content_mine'
                            : 'message_box_content_other'
                    ]"
                    trigger="contextmenu"
                    placement="bottom-end"
                >
                    <!-- 文本类型消息 -->
                    <span>
                        <p
                            style="padding: 10px"
                            v-if="msgBody.type === ALL_MESSAGE_TYPE.TEXT"
                        >
                            {{ msgBody.msg }}
                        </p>
                    </span>

                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item
                                v-if="
                                    msgBody.type === ALL_MESSAGE_TYPE.TEXT &&
                                    isSupported
                                "
                                @click="copyTextMessages(msgBody.msg)"
                            >
                                复制
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div
                v-if="msgBody.type === ALL_MESSAGE_TYPE.INFORM"
                class="inform_style"
            >
                <p>
                    {{ msgBody.msg }}
                </p>
            </div>
        </div>
        <!-- 机器人等待消息 -->
        <div v-if="waitRobotReplyState" class="messageList_box">
            <div
                class="message_box_item"
                :style="{
                    flexDirection: 'row'
                }"
            >
                <el-avatar class="message_item_avator" :src="defaultAvatar">
                </el-avatar>
                <div
                    class="message_box_content"
                    :class="[
                        false
                            ? 'message_box_content_mine'
                            : 'message_box_content_other'
                    ]"
                    trigger="contextmenu"
                    placement="bottom-end"
                >
                    <span>
                        <!-- 文本类型消息 -->
                        <p style="padding: 10px">
                            对方正在输入<span class="dot-ani"></span>
                        </p>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.messageList_box {
    width: 100%;

    .message_box_item {
        position: relative;
        display: flex;
        margin: 32px auto;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0.4px;
        color: #333333;

        .message_item_time {
            position: absolute;
            top: -25px;
            left: 0;
            right: 0;
            margin: auto;
            width: 74px;
            height: 20px;
            color: #adadad;
            font-weight: 400;
            font-size: 10px;
            line-height: 20px;
        }

        .message_item_avator {
            width: 38px;
            height: 38px;
        }

        .message_box_content {
            display: flex;
            align-items: center;
            max-width: 50%;
            min-height: 34px;
            margin: 0 6px;
            word-break: break-all;

            /* 文件消息样式 */
            .message_box_content_file {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 200px;
                min-height: 60px;
                max-height: 120px;
                padding: 10px;

                .file_text_box {
                    width: 75%;
                    height: 80%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;

                    .file_name {
                        width: 120px;
                        white-space: wrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        font-size: 15px;
                        font-weight: bold;
                    }

                    .file_size {
                        font-size: 13px;
                    }

                    .file_download {
                        width: 100%;
                        color: #333333;
                        font-size: 13px;
                        cursor: pointer;
                        transition: all 0.3s ease;

                        &:hover {
                            transform: scale(0.9);
                        }
                    }
                }

                .icon-wenjian {
                    font-size: 50px;
                    color: #8d8a8a;
                }
            }
        }

        .message_box_content_other {
            background: #fff;
            border-radius: 8px 8px 8px 0px;
        }

        .message_box_content_mine {
            background: #c1e3fc;
            border-radius: 8px 0px 8px 8px;
        }
    }
}
.inform_style {
    height: 60px;
    text-align: center;
    color: #aaaaaa;
    font-size: 10px;
    margin: 5px 0;

    .statement {
        color: #3e91fa;
        margin-left: 3px;
        text-decoration: underline;
        cursor: pointer;
    }
}
.dot-ani {
    display: inline-block;
    height: 12px;
    line-height: 12px;
    overflow: hidden;
}
.dot-ani::after {
    display: inline-table;
    white-space: pre;
    content: '\A.\A..\A...';
    animation: spin 2s steps(4) infinite;
}
@keyframes spin {
    to {
        -webkit-transform: translateY(-48px);
        transform: translateY(-48px);
    }
}
</style>
