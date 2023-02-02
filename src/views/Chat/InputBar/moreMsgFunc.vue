<template>
    <div class="container">
        <div class="func_box" @click="sendImageMessage">照片</div>
        <div class="func_box">拍摄</div>
        <div class="func_box">文件</div>
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { useGetMsgFileData } from '@/hooks'
import { getImageSize } from '@/utils'
/* vant */
import { showLoadingToast, closeToast } from 'vant'
/* EaseIM*/
import { EasemobChat } from '@/EaseIM'
import { useSendDisplayMsg } from '@/EaseIM/hooks'
import { EMCreateMsgBodyType } from '@/EaseIM/types/messages'
/* inject */
const chatType = inject('chatType') as EasemobChat.ChatType
const targetId = inject('targetId') as string
/* emits */
const emit = defineEmits<{
    (e: 'hideAllShowBox'): void
}>()
/* send msg */
const { actionSendMessages } = useSendDisplayMsg()
/* 各类型消息组件 */
const sendFileObj: EasemobChat.FileObj = {
    url: '',
    filename: '',
    filetype: '',
    data: '' as unknown as File,
}

const { checkMsgFileData, fileData, inputElement } = useGetMsgFileData()
const sendImageMessage = () => {
    const actionSend = async () => {
        showLoadingToast({
            duration: 0,
            message: '上传中...',
            forbidClick: true,
        })
        if (fileData.value) {
            const { width, height, src } = await getImageSize(fileData.value)
            sendFileObj.filename = fileData.value.name
            sendFileObj.filetype = fileData.value.type
            sendFileObj.data = fileData.value
            sendFileObj.url = src
            const messages: EMCreateMsgBodyType = {
                time: Date.now(),
                type: 'img',
                chatType: chatType,
                to: targetId,
                width: width,
                height: height,
                file: sendFileObj,
                onFileUploadComplete: () => {
                    closeToast()
                    emit('hideAllShowBox')
                    console.log('>>>>上传完成')
                },
            }
            await actionSendMessages(messages)
            if (inputElement.value?.value) {
                inputElement.value.value = ''
            }
        }
        console.log('>>>>执行发送')
    }
    checkMsgFileData(actionSend)
}
</script>

<style lang="scss" scoped>
.container {
    position: relative;
    width: 100%;
    min-height: 300px;
    background: #ededed;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}
.func_box {
    width: 100px;
    height: 100px;
    background: pink;
    margin: 15px;
}
</style>
