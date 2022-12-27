<template>
    <van-nav-bar fixed placeholder :title="navBarTitle" :safe-area-inset-top="true">
        <template #right>
            <van-popover
                v-model:show="showPopover"
                :actions="actions"
                @select="onSelect"
                placement="bottom-end"
                theme="dark"
            >
                <template #reference>
                    <van-icon name="add-o" size="20" color="#000" />
                </template>
            </van-popover>
        </template>
    </van-nav-bar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()
/* 标题国际化 */
const navBarTitle = computed(() => {
    const title: string = route.name as string
    return t(`layout.navbar.${title}`)
})
/* 右侧add反馈 */
interface Iaction {
    text: string
    icon: string
}
const showPopover = ref(false)
// 通过 actions 属性来定义菜单选项
const actions = [
    { text: '发起会话', icon: 'chat' },
    { text: '添加好友', icon: 'manager' },
    { text: '添加群组', icon: 'friends' },
]
const onSelect = (action: Iaction) => console.log(action)
</script>

<style scoped></style>
