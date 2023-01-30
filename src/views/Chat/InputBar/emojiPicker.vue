<template>
    <div class="container">
        <ul class="emojis_container">
            <li v-show="nearestEmojis.length" class="nearest_emojis">
                <p class="title">{{ $t('chat.inputBar.emojiPicker.nearest') }}</p>
                <div class="nearest_emojis_box">
                    <div
                        class="van-haptics-feedback"
                        v-for="(emoji, index) in nearestEmojis"
                        :key="emoji + index"
                        @click.prevent="pickedTheEmoji(emoji)"
                    >
                        {{ emoji }}
                    </div>
                </div>
            </li>
            <li class="all_emojis">
                <p class="title">{{ $t('chat.inputBar.emojiPicker.allEmoji') }}</p>
                <div class="all_emojis_box">
                    <div
                        class="van-haptics-feedback"
                        v-for="(emoji, index) in emojis"
                        :key="emoji + index"
                        @click="pickedTheEmoji(emoji)"
                    >
                        {{ emoji }}
                    </div>
                </div>
            </li>
        </ul>
        <div class="handnle_btn"><van-button class="btn" icon="close" @click="deleTheEmoji" type="success" /></div>
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { useLocalStorage } from '@vueuse/core'
import { EChatClient } from '@/EaseIM'
import emojis from '@/constants/emojis'
interface HandleInputValContent {
    type: 'DELETE' | 'ADD'
    data?: string
}
const emit = defineEmits<{
    (e: 'handleInputValContent', params: HandleInputValContent): void
}>()
//处理展示最近表情
const nearestEmojis = useLocalStorage<string[]>(`EM_${EChatClient.user}_NEAREMOJIS`, [])
const updateNearestEmojis = (emoji: string) => {
    const oldnearestEmojis = _.clone(nearestEmojis.value)
    oldnearestEmojis.unshift(emoji)
    //将去重后的最近表情赋值。
    nearestEmojis.value = _.union(oldnearestEmojis)
    //如果已经存储的最近表情大于10则删除多余emoji
    if (nearestEmojis.value.length > 10) {
        nearestEmojis.value = _.dropRight(nearestEmojis.value, nearestEmojis.value.length - 10)
    }
}
//选中Emoji
const pickedTheEmoji = (emoji: string) => {
    emit('handleInputValContent', { type: 'ADD', data: emoji })
    updateNearestEmojis(emoji)
}
//删除键删除输入框内容
const deleTheEmoji = () => {
    emit('handleInputValContent', { type: 'DELETE' })
}
</script>

<style lang="scss" scoped>
.container {
    position: relative;
    width: 100%;
    min-height: 300px;
    background: #ededed;
}
.emojis_container {
    width: 100%;
    max-height: 400px;
    padding: 25px 10px 50px 10px;
    overflow-y: scroll;
}
.handnle_btn {
    position: fixed;
    bottom: 50px;
    right: 10px;
    z-index: 99;
    .btn {
        width: 80px;
        height: 50px;
    }
}
.nearest_emojis,
.all_emojis {
    width: 100%;
    .title {
        font-size: 17px;
        font-weight: bold;
    }
}
.nearest_emojis_box,
.all_emojis_box {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    div {
        padding: 5px;
    }
}
</style>
