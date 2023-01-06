<template>
    <!-- 顶部安全区 -->
    <div class="van-safe-area-top"></div>
    <div class="me_container">
        <div class="my_infors_card">
            <van-cell is-link>
                <template #value>
                    <div class="my_profile_card">
                        <van-image class="contacts_avatar" :src="loginUserProfile.avatarurl || defaultAvatarUrl" />
                        <div class="contacts_namese">
                            <p class="van-ellipsis">{{ loginUserProfile.nickname || loginUserProfile.loginHxId }}</p>
                            <p class="van-ellipsis">环信ID：{{ loginUserProfile.loginHxId }}</p>
                        </div>
                    </div>
                </template>
            </van-cell>
        </div>
        <div class="my_more_settings">
            <van-cell-group>
                <van-cell title="设置" is-link />
                <van-cell title="关于环信IM" is-link />
                <van-cell title="开发者服务" is-link />
                <van-cell title="投诉建议" is-link />
            </van-cell-group>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLoginStore } from '@/stores'
const defaultAvatarUrl = 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
const loginStore = useLoginStore()
const loginUserProfile = computed(() => {
    return loginStore.getLoginInfos
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
