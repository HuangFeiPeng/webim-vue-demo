<template>
    <!-- 顶部安全区 -->
    <div class="van-safe-area-top"></div>
    <div class="systemnotifi_container">
        <div class="systemnotifi_container_card" v-for="(item, index) in systemNotfiList" :key="item.time + index">
            <div class="time">{{ item.time }}</div>
            <div class="card_body">
                <div class="card_content">
                    <img class="avatar" src="@/assets/images/login/loginIcon.png" alt="" />
                    <div class="content">
                        <div>{{ item.from }}</div>
                        <p>{{ item.content }}</p>
                    </div>
                </div>
                <div class="card_footer">
                    <div>同意</div>
                    <div>拒绝</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSystemNotfiStore } from '@/stores'

const systemNotfiStore = useSystemNotfiStore()
const systemNotfiList = computed(() => systemNotfiStore.systemNotificationList)
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
