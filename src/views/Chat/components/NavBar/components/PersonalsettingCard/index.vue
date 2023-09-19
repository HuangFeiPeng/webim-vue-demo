<script setup>
import { ref, watchEffect } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { usePlayRing, useSetEMLogConfig } from '@/hooks'
import { CNNECTION_CUSTOM_CONFIG_KEY } from '@/IM/config'
const dialogVisible = ref(false)
const { isOpenPlayRing } = usePlayRing()
const { isOpenedEMLog, donwLoadEMLog } = useSetEMLogConfig()
const EM_CONNECTION_CUSTOM_CONFIG = useLocalStorage(
    CNNECTION_CUSTOM_CONFIG_KEY,
    {}
)
const isEnableLocalCache = ref(false)
const isEnableLocalCacheLoading = ref(false)
watchEffect(() => {
    isEnableLocalCache.value = EM_CONNECTION_CUSTOM_CONFIG.value
        ?.enableLocalCache
        ? true
        : false
})
const handleSwitchEnableLocalCache = (value) => {
    isEnableLocalCacheLoading.value = true
    EM_CONNECTION_CUSTOM_CONFIG.value.enableLocalCache = value
    window.location.reload()
}
defineExpose({
    dialogVisible
})
</script>

<template>
    <el-dialog
        custom-class="personal_setting_card"
        v-model="dialogVisible"
        width="366px"
        title="个人设置"
        :show-close="true"
        :destroy-on-close="true"
    >
        <div class="setting_main">
            <div class="setting_main_item">
                <el-tooltip
                    class="item"
                    effect="dark"
                    content="开启后可在收到消息时，播放消息提示音。"
                    placement="top"
                >
                    <span>新消息提示音</span>
                </el-tooltip>

                <el-switch
                    v-model="isOpenPlayRing"
                    active-text="开启"
                    inactive-text="关闭"
                />
            </div>
            <div class="setting_main_item">
                <el-tooltip
                    class="item"
                    effect="dark"
                    content="开启后会话列表将会从DB中获取"
                    placement="top"
                >
                    <span>会话本地存储</span>
                </el-tooltip>

                <el-switch
                    v-model="isEnableLocalCache"
                    :loading="isEnableLocalCacheLoading"
                    active-text="开启"
                    inactive-text="关闭"
                    @change="handleSwitchEnableLocalCache"
                />
            </div>
            <div class="setting_main_item">
                <el-tooltip
                    class="item"
                    effect="dark"
                    content="开启SDK日志后，会在控制台输出SDK日志,并可下载SDK缓存日志。"
                    placement="top"
                >
                    <span>开启SDK日志</span></el-tooltip
                >
                <el-switch
                    v-model="isOpenedEMLog"
                    active-text="开启"
                    inactive-text="关闭"
                />
            </div>
            <div class="setting_main_item" v-if="isOpenedEMLog">
                <el-button
                    class="download_log"
                    type="primary"
                    plain
                    @click="donwLoadEMLog"
                    >下载SDK缓存日志</el-button
                >
            </div>
            <!-- <div>
                <span>新消息系统推送</span>
                <el-switch v-model="" active-text="开启" inactive-text="关闭" />
            </div> -->
        </div>
    </el-dialog>
</template>

<style lang="scss" scoped>
.setting_main {
    width: 100%;
    height: 100%;

    .setting_main_item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
