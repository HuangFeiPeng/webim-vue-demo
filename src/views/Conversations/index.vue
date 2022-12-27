<template>
    <div class="conversations_container">
        <van-list
            v-model:loading="loading"
            :finished="finished"
            :finished-text="$t('conversations.nomore')"
            @load="onLoad"
        >
            <van-swipe-cell v-for="item in list" :key="item">
                <div class="conversation_item_box">
                    <img src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" alt="" />
                    <div></div>
                </div>
                <template #right>
                    <van-button square type="warning" :text="$t('conversations.swipeCellBtn.stick')" />
                    <van-button square type="danger" :text="$t('conversations.swipeCellBtn.delete')" />
                </template>
            </van-swipe-cell>
        </van-list>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const list = ref<any>([])
const loading = ref(false)
const finished = ref(false)
const onLoad = () => {
    // 异步更新数据
    // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    setTimeout(() => {
        for (let i = 0; i < 10; i++) {
            list.value.push(list.value.length + 1)
        }

        // 加载状态结束
        loading.value = false

        // 数据全部加载完成
        if (list.value.length >= 40) {
            finished.value = true
        }
    }, 1000)
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
