<template>
    <div class="messages_container">
        <van-pull-refresh v-model="loading" @refresh="onRefresh">
            <p>刷新次数: {{ count }}</p>
            <div v-for="item in 100" :key="item">{{ item }}</div>
        </van-pull-refresh>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
const loading = ref(false)

const onRefresh = () => {
    setTimeout(() => {
        loading.value = false
        count.value++
    }, 1000)
}
</script>

<style lang="scss" scoped>
.messages_container {
    width: 100%;
    height: calc(100% - 190px);
    background: blue;
    overflow-y: scroll;
}
</style>
