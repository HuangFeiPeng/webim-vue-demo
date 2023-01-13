<template>
    <div class="input_bar_container">
        {{ msgSendStatus }}
        <van-button @click="sendTextTypeMsg">发送消息</van-button>
    </div>
</template>

<script setup lang="ts">
import { useSendDisplayMsg } from '@/EaseIM/hooks'
import { EMCreateMsgBodyType } from '@/EaseIM/types/messages'
const { msgSendStatus, actionSendMessages } = useSendDisplayMsg()
const sendTextTypeMsg = () => {
    msgSendStatus.value = 'sending'
    // const msgBody: EMCreateMsgBodyType = {
    //     type: 'txt',
    //     to: 'pfh',
    //     from: 'hfp',
    //     msg: 'hahhahah',
    //     chatType: 'singleChat',
    //     time: Date.now(),
    // }
    // actionSendMessages(msgBody)
}
</script>

<style lang="scss" scoped>
.input_bar_container {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100px;
    background: green;
}
</style>
