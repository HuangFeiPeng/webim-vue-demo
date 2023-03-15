<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { EaseChatClient } from '@/IM/initwebsdk'
import { handleSDKErrorNotifi } from '@/utils/handleSomeData'
import { fetchUserLoginSmsCode, fetchUserLoginToken } from '@/api/login'
import { useStore } from 'vuex'
import { usePlayRing } from '@/hooks'
const store = useStore()
const loginValue = reactive({
    phoneNumber: '',
    password: '1'
})
const buttonLoading = ref(false)
//根据登陆初始化一部分状态
const loginState = computed(() => store.state.loginState)
watch(loginState, (newVal) => {
    console.log('>>>>>登录状态改变')
    if (newVal) {
        buttonLoading.value = false
        loginValue.phoneNumber = ''
    }
})
const rules = reactive({
    phoneNumber: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: ['blur', 'change']
        }
    ]
})
//登陆接口调用
const loginIM = async () => {
    const { clickRing } = usePlayRing()
    clickRing()
    buttonLoading.value = true
    /* SDK 登陆的方式 */
    try {
        let { accessToken } = await EaseChatClient.open({
            user: loginValue.phoneNumber,
            pwd: loginValue.password
        })
        window.localStorage.setItem(
            `EASEIM_loginUser`,
            JSON.stringify({
                user: loginValue.phoneNumber,
                accessToken: accessToken
            })
        )
    } catch (error) {
        console.log('>>>>登陆失败', error)
        const {
            data: { extraInfo }
        } = error
        if (extraInfo.errDesc === 'user not found') {
            registerAndLogin()
        } else {
            handleSDKErrorNotifi(error.type, extraInfo.errDesc)
            loginValue.phoneNumber = ''
        }
    } finally {
        buttonLoading.value = false
    }
}
//用户不存在帮助注册
const registerAndLogin = async () => {
    console.log('>>>>注册', loginValue.phoneNumber)
    try {
        await EaseChatClient.registerUser({
            username: loginValue.phoneNumber,
            password: loginValue.password
        })
        loginIM()
    } catch (error) {
        handleSDKErrorNotifi(error?.type, error?.extraInfo?.errDesc)
        loginValue.phoneNumber = ''
    }
}
</script>

<template>
    <el-form :model="loginValue" :rules="rules">
        <el-form-item prop="phoneNumber">
            <el-input
                class="login_input_style"
                v-model="loginValue.phoneNumber"
                placeholder="手机号"
                clearable
            />
        </el-form-item>
        <el-form-item>
            <div class="function_button_box">
                <el-button
                    v-if="loginValue.phoneNumber"
                    class="haveValueBtn"
                    :loading="buttonLoading"
                    @click="loginIM"
                    >登录</el-button
                >
                <el-button v-else class="notValueBtn">登录</el-button>
            </div>
        </el-form-item>
    </el-form>
</template>

<style lang="scss" scoped>
.login_input_style {
    margin: 10px 0;
    width: 400px;
    height: 50px;
    padding: 0 16px;
}

::v-deep .el-input__inner {
    padding: 0 20px;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 1.75px;
    color: #3a3a3a;

    &::placeholder {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        /* identical to box height */
        letter-spacing: 1.75px;
        color: #cccccc;
    }
}

::v-deep .el-input__suffix-inner {
    font-size: 20px;
    margin-right: 15px;
}

::v-deep .el-form-item__error {
    margin-left: 16px;
}

::v-deep .el-input-group__append {
    background: linear-gradient(90deg, #04aef0 0%, #5a5dd0 100%);
    width: 60px;
    color: #fff;
    border: none;
    font-weight: 400;

    button {
        font-weight: 300;
    }
}

.login_text {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 17px;
    text-align: right;

    .login_text_isuserid {
        display: inline-block;
        // width: 100px;
        color: #f9f9f9;
    }

    .login_text_tologin {
        margin-right: 20px;
        width: 80px;
        color: #05b5f1;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }
}

.function_button_box {
    margin-top: 10px;
    width: 400px;

    button {
        margin: 10px;
        width: 380px;
        height: 50px;
        border-radius: 57px;
    }

    .haveValueBtn {
        background: linear-gradient(90deg, #04aef0 0%, #5a5dd0 100%);
        border: none;
        font-weight: 300;
        font-size: 17px;
        color: #f4f4f4;

        &:active {
            background: linear-gradient(90deg, #0b83b2 0%, #363df4 100%);
        }
    }

    .notValueBtn {
        border: none;
        font-weight: 300;
        font-size: 17px;
        background: #000000;
        mix-blend-mode: normal;
        opacity: 0.3;
        color: #ffffff;
        cursor: not-allowed;
    }
}
</style>
