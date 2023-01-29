<template>
    <transition name="van-slide-up">
        <div class="input_bar_container" ref="inputContainer">
            <div class="input_bar_container_base">
                <div class="van-haptics-feedback input_bar_container_left" @click="changeInputType">
                    <van-icon v-show="isInputText" name="volume-o" />
                    <van-icon v-show="!isInputText" name="chat-o" />
                </div>
                <div class="input_bar_container_main">
                    <input-text v-show="isInputText" v-model="inputTextVal" @hideEmojiPicker="hideEmojiPicker" />
                    <input-audio v-show="!isInputText" />
                </div>
                <div class="input_bar_container_right">
                    <div class="van-haptics-feedback" @click="changeEmojiInput">
                        <van-icon v-show="isShowEmojiPicker" name="chat-o" />
                        <p v-show="!isShowEmojiPicker">😁</p>
                    </div>
                    <transition name="van-slide-left">
                        <div class="van-haptics-feedback" v-show="!inputTextVal"><van-icon name="add-o" /></div>
                    </transition>

                    <transition name="van-slide-right">
                        <van-button class="send_btn" icon="guide-o" v-show="inputTextVal" type="success" />
                    </transition>
                </div>
            </div>
            <transition name="van-slide-up">
                <emoji-picker v-show="isShowEmojiPicker" @handleInputValContent="handleInputValContent" />
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
/*
 * 在JavaScript中，字符串字符与单独的Emoji表情之间并不总是存在一对一的关系。
 * 某些Emoji表情由多个字符表示。这可能会导致分割字符串时出现问题，
 * 并且无意中将多字母字母切成两半，或者当您需要统计字符串中的实际长度时出现错误。
 * 因此引入【GraphemeSplitter】库用来正确计算并且统计实际输入框内容长度。
 **/
import GraphemeSplitter from 'grapheme-splitter'

/* 输入框逻辑 */
const isShowEmojiPicker = ref(false) //是否展示表情框
const inputContainer = ref<HTMLElement>() //处理点击外部重置部分输入框功能状态
const hideEmojiPicker = () => {
    return (isShowEmojiPicker.value = false)
}
useClickAway(inputContainer, () => {
    hideEmojiPicker()
})

/* 文本输入框 */
const inputTextVal = ref('') //文本输入框内容，且以组件双向绑定的形式与文本输入组件关联了起来。
const isInputText = ref(true) //是否展示文本输入框
//切换输入框输入类型[audio->text,text-audio]
const changeInputType = () => {
    hideEmojiPicker()
    isInputText.value = !isInputText.value
}
//输入框内容处理（emoji添加或者删除）
interface HandleInputValContent {
    type: 'DELETE' | 'ADD'
    data?: string
}
const splitter = new GraphemeSplitter()
//执行删除或添加表情
const handleInputValContent = (params: HandleInputValContent) => {
    if (params.type === 'ADD') {
        return (inputTextVal.value += params.data)
    }
    if (params.type === 'DELETE') {
        if (!inputTextVal.value) return
        const graphemes = splitter.splitGraphemes(inputTextVal.value)
        graphemes.pop()
        return (inputTextVal.value = graphemes.join(''))
    }
}
//切换表情与文本输入状态
const changeEmojiInput = () => {
    isShowEmojiPicker.value = !isShowEmojiPicker.value
    //如果切换时为音频输入状态，则修改为文本状态。
    if (!isInputText.value) return (isInputText.value = true)
}
</script>

<style lang="scss" scoped>
.input_bar_container {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #f8f8f8;

    .input_bar_container_base {
        width: 100%;
        height: 100px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        box-sizing: border-box;
        .input_bar_container_left {
            width: 15%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .input_bar_container_main {
            width: 70%;
            height: 100px;
            max-height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .input_bar_container_right {
            min-width: 20%;
            max-width: 20%;
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .send_btn {
                width: 90px;
                height: 50px;
                font-size: 11px;
            }
        }
    }
}
</style>
