<template>
    <div class="container">
        <!-- 基础音频采集 -->
        <div class="collect_box" @touchstart.prevent="startRecord" @touchmove="recording" @touchend="recordOver">
            <p v-show="!collectAudioState.voice.type">{{ $t('chat.inputBar.inputAudio.holdTalk') }}</p>
            <p v-show="collectAudioState.voice.type">{{ $t('chat.inputBar.inputAudio.releaseSend') }}</p>
        </div>
        <van-popup
            :class="[isCannleRecord ? 'cannel_popup_style' : 'popup_style']"
            v-model:show="isShowPopup"
            :overlay="false"
            round
            :duration="0"
            :style="{ padding: '15px' }"
        >
            <div class="collect_detail">
                <!-- <p class="time">00:30</p> -->
                <p class="text" v-show="isCannleRecord">{{ $t('chat.inputBar.inputAudio.unFingerCannelSend') }}</p>
                <p class="text" v-show="!isCannleRecord">{{ $t('chat.inputBar.inputAudio.upsideCannelSend') }}</p>
            </div>
        </van-popup>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject } from 'vue'
/* i18n */
import { useI18n } from 'vue-i18n'
/* EaseIM */
import { EChatSDK, EasemobChat } from '@/EaseIM'
import { useSendDisplayMsg } from '@/EaseIM/hooks'
import { EMCreateMsgBodyType } from '@/EaseIM/types/messages'
import { showToast } from 'vant'
//音频采集插件
import BenzAMRRecorder from 'benz-amr-recorder'
/* inject */
const chatType = inject('chatType') as EasemobChat.ChatType
const targetId = inject('targetId') as string
interface CollectAudioState {
    voice: {
        interval: number | undefined
        type: boolean
        length: number
        src: null | Blob
    }
    amrRec: BenzAMRRecorder | null
    changedTouches: TouchList | null
}
const collectAudioState = reactive<CollectAudioState>({
    voice: {
        interval: undefined, // 录音定时器
        type: false, // 0未录音 1录音中 2录音完毕 false未录音 true在录音
        length: 0, // 录音长度
        src: null, // 录音资源
    },
    amrRec: null, //录音对象
    changedTouches: null,
})

/* 整体音频采集发送逻辑 */
/* i18n */
const { t } = useI18n()
//Popup
const isShowPopup = ref(false)
//Popup 内容
//是否为取消发送样式
const isCannleRecord = ref(false)
//发送语音消息
const { actionSendMessages } = useSendDisplayMsg()
const sendAudioMessage = async () => {
    const file: EasemobChat.FileObj = {
        url: EChatSDK.utils.parseDownloadResponse(collectAudioState.voice.src),
        filename: '录音',
        filetype: '.amr',
        data: collectAudioState.voice.src as File,
    }
    const messages: EMCreateMsgBodyType = {
        type: 'audio',
        time: Date.now(),
        chatType: chatType,
        to: targetId,
        file: file,
        filename: file.filename,
        length: collectAudioState.voice.length,
    }
    actionSendMessages(messages)
    initVocie()
    console.log('>>>>>')
}
//初始化录音状态
const initVocie = () => {
    collectAudioState.voice.interval = undefined
    collectAudioState.voice.length = 0
    collectAudioState.voice.type = false
    collectAudioState.voice.src = null
    isShowPopup.value = false
    isCannleRecord.value = false
}
//按下的时候开始计时，并且还是采集录音
const startRecord = (e: TouchEvent) => {
    console.log('startRecord+++')
    collectAudioState.changedTouches = e.changedTouches //获取touch初始位置
    if (!collectAudioState.voice.type) {
        collectAudioState.amrRec = new BenzAMRRecorder()
        collectAudioState.amrRec
            .initWithRecord()
            .then(() => {
                if (collectAudioState.amrRec) {
                    collectAudioState.amrRec.startRecord() //开始录音
                    collectAudioState.voice.type = true
                    isShowPopup.value = true
                    //开启录音时长定时器
                    collectAudioState.voice.interval = setInterval(() => {
                        collectAudioState.voice.length++
                    }, 1000)
                }
            })
            .catch((e) => {
                collectAudioState.voice.type = false
                isShowPopup.value = false
                console.log('>>>>录制失败', e)
                showToast(`${e}`)
            })
    }
}

//移动的时候提示上滑滑出按钮取消录音，滑动回来录音正常
const recording = (e: TouchEvent) => {
    if (!collectAudioState.changedTouches || !collectAudioState.amrRec) return
    // console.log('e.touches[0].pageY', e.touches[0].pageY)
    if (collectAudioState.changedTouches[0].pageY - e.touches[0].pageY > 60) {
        //开始的坐标减去 移动的最后的坐标如果大于20，<20是一个旷量防止用户误触> 则是向上移动
        // collectAudioState.amrRec.cancelRecord()
        // clearInterval(collectAudioState.voice.interval)
        // initVocie()
        // showToast('已取消')
        // return
        isCannleRecord.value = true
    } else {
        isCannleRecord.value = false
    }
}

//抬起的时候录音暂停且发送出去。
const recordOver = () => {
    if (!collectAudioState.amrRec) return
    collectAudioState.amrRec
        .finishRecord()
        .then(() => {
            clearInterval(collectAudioState.voice.interval)
            if (collectAudioState.amrRec && collectAudioState.voice.length <= 1) {
                initVocie()
                // 放弃录音
                collectAudioState.amrRec.cancelRecord()
                showToast(`${t('chat.inputBar.inputAudio.toastTimeshort')}`)
                isShowPopup.value = false
            } else if (collectAudioState.amrRec && !isCannleRecord.value) {
                console.log('录音发送')
                collectAudioState.voice.length =
                    collectAudioState.amrRec && Math.ceil(collectAudioState.amrRec.getDuration())
                // 获取音频文件
                collectAudioState.voice.src = collectAudioState.amrRec.getBlob()
                clearInterval(collectAudioState.voice.interval)
                sendAudioMessage()
                // initVocie()
            } else if (collectAudioState.amrRec && isCannleRecord.value) {
                console.log('上滑执行取消录音')
                collectAudioState.amrRec.cancelRecord()
                initVocie()
            }
        })
        .catch((e) => {
            showToast('录音失败，请检查相关权限')
        })
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    border-radius: 50px;
    font-size: 17px;
}
.collect_box {
    width: 100%;
    text-align: center;
    user-select: none;
}
:deep(.popup_style) {
    background: rgba(3, 3, 3, 0.5);
}
:deep(.cannel_popup_style) {
    background: rgba(246, 1, 1, 0.5);
}
.collect_detail {
    width: 250px;
    height: 250px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    .time {
        font-size: 12px;
        font-weight: 300;
    }
    .text {
        font-size: 12px;
        font-weight: bold;
    }
}
</style>
