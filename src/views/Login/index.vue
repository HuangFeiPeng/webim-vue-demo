<template>
    <div class="login_container">
        <p class="login_title">IM登录</p>
        <van-cell-group inset>
            <van-field v-model="loginParams.phoneNumber" type="tel" label="手机号" />
            <van-field v-model="loginParams.smsCode" type="number" label="验证码" />
        </van-cell-group>
        <div class="login_button_box">
            <van-button class="login_btn" @click="loginEaseIM" type="primary">登录</van-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import './index.scss'
const loginParams = reactive({
    phoneNumber: '',
    username: '',
    password: '',
    smsCode: '',
})
const loginEaseIM: () => void = () => {
    console.log('>>>>登录环信')
}
</script>
