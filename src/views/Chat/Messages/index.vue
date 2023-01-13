<template>
    <van-pull-refresh class="messages_container" v-model="historyMsgLoading" @refresh="onRefresh">
        <div class="messages_box" v-for="(msg, index) in messagesList" :key="msg.time">
            <div class="messages_box_items" :class="[isMyself(msg) ? 'myMsgbox' : 'otherMsgbox']">
                <van-image width="50" height="50" src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" />
                <div v-if="msg.type === 'txt'">
                    {{ msg.msg }}
                </div>
                <div v-if="msg.type === 'img'">
                    <van-image
                        :width="msg.width && msg.width / 30"
                        :height="msg.height && msg.height / 30"
                        :src="msg.thumb || msg.url + '?thumbnail=true'"
                    />
                </div>
                <div v-if="msg.type === 'audio'" @click="startplayAudio(msg, index)">音频</div>
                <div id="wrapper" v-if="msg.type === 'video'">
                    <video-wrapper :video-url="msg.url" :el-id="`_${msg.id}`" />
                </div>
                <div v-if="msg.type === 'file'">
                    <p @click="downLoadFile(msg)">下载文件</p>
                </div>
            </div>
        </div>
    </van-pull-refresh>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { EasemobChat } from '@/EaseIM'
import { useRoute } from 'vue-router'
import { useMessagesStore, useLoginStore } from '@/stores'
import { useFetchHistoryMessages } from '@/EaseIM/hooks/useFetchHistoryMessages'
import { EMMsgType } from '@/EaseIM/types/messages'
/* 音频播放使用 */
import BenzAMRRecorder from 'benz-amr-recorder'
/* 视频播放组件 */
import videoWrapper from './videoWrapper.vue'
const route = useRoute()
//当前用户的方法
const nowChatUser = computed(() => {
    const queryParams = route.query
    const result = {
        id: String(queryParams.id),
        chatType: queryParams.chatType as EasemobChat.ChatType,
    }
    return result
})

/* 消息处理相关 */
const { historyMsgLoading, historyCursor, fetchHistoryMsg } = useFetchHistoryMessages()
//拉取历史消息
const getHistoryMesssage = (cursor: string | undefined) => {
    fetchHistoryMsg({
        targetId: String(nowChatUser.value.id),
        chatType: nowChatUser.value.chatType,
        cursor,
        pageSize: 10,
    })
}
//获取当前联系人的消息记录
const messagesStore = useMessagesStore()
const messagesList = computed(() => {
    return messagesStore.usersMessages[String(nowChatUser.value.id)] || getHistoryMesssage(undefined)
})
//下拉加载更多
const onRefresh = () => {
    getHistoryMesssage(historyCursor.value)
}

//判断消息来源是否为自己
const loginStore = useLoginStore()
const isMyself = computed(() => {
    return (msg: EMMsgType) => {
        return msg.from === loginStore.loginHxId
    }
})

//音频播放
//音频播放状态
const audioPlayStatus = reactive({
    isPlaying: false, //是否在播放中
    playIndex: -1, //在播放的音频消息下标
})
//开始播放
const startplayAudio = (msg: EMMsgType, index: number) => {
    if (msg.type !== 'audio') return
    const armRec = new BenzAMRRecorder()
    const src = msg.url as string
    audioPlayStatus.playIndex = index
    console.log('>>>>>开始播放音频', msg.url)
    //初始化音频源并调用播放
    armRec.initWithUrl(src).then(() => {
        if (!audioPlayStatus.isPlaying) {
            armRec.play()
        }
    })
    //播放开始监听
    armRec.onPlay(() => {
        audioPlayStatus.isPlaying = true
        audioPlayStatus.playIndex = index
    })
    //播放结束监听
    armRec.onStop(() => {
        audioPlayStatus.isPlaying = false
        audioPlayStatus.playIndex = -1
    })
}

//文件下载
const downLoadFile = (msg: EMMsgType) => {
    if (msg.type === 'file') {
        const a = document.createElement('a')
        a.style.display = 'none'
        a.setAttribute('target', '_blank')
        /*
         * download的属性是HTML5新增的属性
         * href属性的地址必须是非跨域的地址，如果引用的是第三方的网站或者说是前后端分离的项目(调用后台的接口)，这时download就会不起作用。
         * 此时，如果是下载浏览器无法解析的文件，例如.exe,.xlsx..那么浏览器会自动下载，但是如果使用浏览器可以解析的文件，比如.txt,.png,.pdf....浏览器就会采取预览模式
         * 所以，对于.txt,.png,.pdf等的预览功能我们就可以直接不设置download属性(前提是后端响应头的Content-Type: application/octet-stream，如果为application/pdf浏览器则会判断文件为 pdf ，自动执行预览的策略)
        //  */
        msg.filename && a.setAttribute('download', msg.filename)
        a.href = msg.url as string
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
