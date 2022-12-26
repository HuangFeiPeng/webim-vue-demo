<template>
    <div>Home页面</div>
    <div>
        <van-button class="login_btn" @click="logout" type="primary">退出登录</van-button>
    </div>
</template>

<script setup lang="ts">
import { useEMLogin } from '@/EaseIM/hooks'
const { EMlogout } = useEMLogin()
const logout = () => EMlogout()
</script>

<style scoped lang="scss"></style>
