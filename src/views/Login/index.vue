<template>
    <div class="login_container">
        <!-- <p class="login_title">{{ $t('login.title') }}</p> -->
        <div class="login_logo_box">
            <div class="login_logo">
                <img :src="loginLogo" alt="logo" />
                <span class="sdk_version">V{{ EaseIMVersion }}</span>
            </div>
        </div>
        <div class="login_input_box">
            <div class="login_input">
                <van-field v-model="loginParams.username" center placeholder="请输入手机号" />
            </div>
            <div class="login_input login_input_sms">
                <van-field v-model="loginParams.smsCode" center clearable placeholder="请输入短信验证码">
                    <template #button>
                        <van-button size="small" type="primary">发送验证码</van-button>
                    </template>
                </van-field>
            </div>
            <div class="clause_text_box">
                <van-checkbox v-model="isAgree" checked-color="#7DED6A" icon-size="12px"
                    ><span class="clause_text">
                        同意<a href="http://" target="_blank" rel="noopener noreferrer">《环信服务条款》</a> 与<a
                            href="https://www.easemob.com/protocol"
                            target="_blank"
                            rel="noopener noreferrer"
                            >《环信隐私协议》</a
                        >
                    </span>
                </van-checkbox>
            </div>
            <div class="login_action_btn">
                <van-button
                    class="login_btn"
                    @click="loginEaseIM"
                    color="linear-gradient(90deg, #04AEF0 0%, #5A5DD0 100%)"
                >
                    登录
                </van-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useEMLogin } from '@/EaseIM/hooks'
import { EChatClient } from '@/EaseIM'
/* images */
import loginLogo from '@/assets/images/login/loginIcon.png'

/* 登录逻辑 */
const loginParams = reactive({
    phoneNumber: '',
    username: 'hfp',
    password: '1',
    smsCode: '',
})
const isAgree = ref(false)
const { EMlogin } = useEMLogin()
const loginEaseIM: () => void = () => {
    EMlogin({ imId: loginParams.username, imPwd: loginParams.password, isCacheToken: true })
    console.log('>>>>登录环信')
}
/* EaseIM version */
const EaseIMVersion = EChatClient.version
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
