<template>
    <div class="container">
        <van-field rows="5" autosize type="textarea" placeholder="请输入留言" enterkeyhint="send" />
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
:deep(.van-cell) {
    height: 100px;
}
</style>
