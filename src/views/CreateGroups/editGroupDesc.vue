<template>
    <van-nav-bar
        title="编辑群组公告"
        left-text="返回"
        right-text="保存"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
    />
    <div>
        <van-field
            v-model="groupDescripion"
            rows="2"
            autosize
            label="群组详情"
            type="textarea"
            maxlength="50"
            placeholder="请输入群组详情"
            show-word-limit
        />
    </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteRecordName, RouteLocationNormalizedLoaded } from 'vue-router'
const route: RouteLocationNormalizedLoaded = useRoute()
const groupDescripion = ref('')
onMounted(() => {
    if (route?.query?.groupDescripion) {
        groupDescripion.value = route?.query?.groupDescripion as string
    }
})
const onClickLeft = () => router.back()
interface QueryInterface {
    [index: string]: string
}
const onClickRight = () => {
    const query: QueryInterface = {}
    if (groupDescripion.value) query.groupDescripion = groupDescripion.value
    router.push({
        name: 'creategroups',
        query,
    })
}
</script>

<style scoped></style>
