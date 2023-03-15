<script setup>
import { ref, toRefs, defineProps } from 'vue'
import { useStore } from 'vuex'
import { handleSDKErrorNotifi } from '@/utils/handleSomeData'
import { messageType } from '@/constant'
import { ElMessage } from 'element-plus'
import _ from 'lodash'
/* 组件 */
const store = useStore()
const props = defineProps({
    nowPickInfo: {
        type: Object,
        required: true,
        default: () => ({})
    },
    waitRobotReplyState: {
        type: Boolean,
        default: false
    }
})
const { ALL_MESSAGE_TYPE, CHAT_TYPE } = messageType
const { nowPickInfo, waitRobotReplyState } = toRefs(props)
/* emits */
const emits = defineEmits(['changeRobotReplayState'])
/* 文本消息相关 */
//发送文本内容
const textContent = ref('')
const sendTextMessage = _.debounce(async () => {
    //如果输入框全部为空格同样拒绝发送
    if (textContent.value.match(/^\s*$/)) return
    if (waitRobotReplyState.value) {
        return ElMessage({
            type: 'warning',
            message: '等待机器人回复完再问~',
            center: true
        })
    }
    const msgOptions = {
        id: nowPickInfo.value.id,
        chatType: nowPickInfo.value.chatType,
        msg: textContent.value
    }
    textContent.value = ''
    try {
        emits('changeRobotReplayState', true)
        await store.dispatch('sendShowTypeMessage', {
            msgType: ALL_MESSAGE_TYPE.TEXT,
            msgOptions
        })
    } catch (error) {
        handleSDKErrorNotifi(error.type, error.message)
        console.log('>>>>>>>发送失败+++++++', error)
    } finally {
        // emits('changeRobotReplayState', false)
    }
}, 50)
</script>
<template>
    <textarea
        ref="editable"
        v-model="textContent"
        class="chat_content_editable"
        spellcheck="false"
        contenteditable="true"
        placeholder="请输入消息内容..."
        onkeydown="if (event.keyCode === 13) event.preventDefault();"
        @keyup.enter="sendTextMessage"
        @paste="onPasteImage"
    >
    </textarea>
    <el-button
        :class="[textContent === '' ? 'no_content_send_btn' : 'chat_send_btn']"
        type="primary"
        @click="sendTextMessage"
        >发送</el-button
    >
</template>

<style lang="scss" scoped>
.chat_func_box {
    display: flex;
    align-items: center;
    height: 42px;
    width: 100%;
    background-color: #f7f7f7;
}

/* loading svg大小调整 */
::v-deep .circular {
    margin-top: 8px;
    width: 25px;
    height: 25px;
}

.chat_content_editable {
    font-family: 'PingFang SC';
    width: 100%;
    box-sizing: border-box;
    min-height: 100px;
    border: none;
    background: none;
    letter-spacing: 0.5px;
    resize: none;
    padding: 10px 20px;
    font-size: 14px;
    border-top: 1px solid #f3f3f3;
}

.no_content_send_btn {
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 80px;
    opacity: 0.5;
}

.chat_send_btn {
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 80px;
}

.iconfont {
    margin-right: 12px;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: scale(1.2);
        color: #1b83f9;
    }
}

.record_box {
    width: 250px;
    height: 180px;
}
</style>
