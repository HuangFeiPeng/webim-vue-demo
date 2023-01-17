<template>
    <transition name="van-slide-up">
        <div class="input_bar_container" ref="inputContainer">
            <div class="input_bar_container_base">
                <div class="van-haptics-feedback" @click="changeInputType">
                    <van-icon v-show="isInputText" name="volume-o" />
                    <van-icon v-show="!isInputText" name="chat-o" />
                </div>
                <div class="input_bar_container_main">
                    <input-text v-show="isInputText" />
                    <input-audio v-show="!isInputText" />
                </div>
                <div class="van-haptics-feedback" @click="isShowEmojiPicker = !isShowEmojiPicker">
                    <van-icon v-show="isShowEmojiPicker" name="chat-o" />
                    <p v-show="!isShowEmojiPicker">😁</p>
                </div>
                <div class="van-haptics-feedback" v-show="!isInputText"><van-icon name="add-o" /></div>
                <transition name="van-slide-right">
                    <div v-show="isInputText">发送</div>
                </transition>
            </div>
            <transition name="van-slide-up">
                <emoji-picker v-show="isShowEmojiPicker" />
            </transition>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
/* vant use */
import { useClickAway } from '@vant/use'
/* 组件 */
//文本输入
import InputText from './inputText.vue'
//语音输入
import InputAudio from './inputAudio.vue'
// emoji组件
import EmojiPicker from './emojiPicker.vue'

/* 输入框逻辑 */
const isShowEmojiPicker = ref(false)
//处理点击外部重置部分输入框功能状态
const inputContainer = ref<HTMLElement>()
useClickAway(inputContainer, () => {
    if (isShowEmojiPicker.value) return (isShowEmojiPicker.value = false)
    console.log('>>>>>点击了外部状态')
})
const isInputText = ref(true)
const changeInputType = () => (isInputText.value = !isInputText.value)
</script>

<style lang="scss" scoped>
.input_bar_container {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: green;

    .input_bar_container_base {
        width: 100%;
        height: 100px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        .input_bar_container_main {
            width: 70%;
            height: 100px;
            max-height: 100px;
        }
    }
}
</style>
