<template>
    <div class="login_container">
        <p class="login_title">{{ $t('login.title') }}</p>
        <van-cell-group inset>
            <van-field
                v-model="loginParams.phoneNumber"
                type="tel"
                :label="$t('login.inputLabel.phoneNumber')"
                :placeholder="$t('login.inputPlaceholder.phoneNumber')"
            />
            <van-field
                v-model="loginParams.smsCode"
                type="number"
                :label="$t('login.inputLabel.code')"
                :placeholder="$t('login.inputPlaceholder.code')"
            />
        </van-cell-group>
        <div class="login_button_box">
            <van-button class="login_btn" @click="loginEaseIM" type="primary">{{ $t('login.loginBtn') }}</van-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useEMLogin } from '@/EaseIM/hooks'
import './index.scss'
const loginParams = reactive({
    phoneNumber: '',
    username: 'hfp',
    password: '1',
    smsCode: '',
})
const { EMlogin } = useEMLogin()
const loginEaseIM: () => void = () => {
    EMlogin({ imId: loginParams.username, imPwd: loginParams.password, isCacheToken: true })
    console.log('>>>>登录环信')
}
</script>
