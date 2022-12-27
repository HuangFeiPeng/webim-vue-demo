<template>
    <form action="/">
        <van-search v-model="value" clearable placeholder="请输入搜索关键词" @search="onSearch" @cannel="onCannel" />
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref('')
const onSearch = () => {
    console.log('>>>>触发搜索')
}
const onCannel = () => {
    console.log('>>>取消搜索')
}
</script>

<style scoped></style>
