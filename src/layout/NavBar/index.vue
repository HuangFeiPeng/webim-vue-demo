<template>
    <van-nav-bar fixed placeholder :title="title" :safe-area-inset-top="true">
        <template #left v-if="isBack">
            <van-icon name="arrow-left" size="20" color="#000" @click="backPage" />
        </template>
        <template #right>
            <template v-if="isActions">
                <van-popover
                    v-model:show="showPopover"
                    :actions="actions"
                    @select="emitSelect"
                    placement="bottom-end"
                    theme="dark"
                >
                    <template #reference>
                        <van-icon name="add-o" size="20" color="#000" />
                    </template>
                </van-popover>
            </template>
            <template v-if="isMore">
                <van-icon name="ellipsis" size="20" color="#000" @click="emitOnMore" />
            </template>
        </template>
    </van-nav-bar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

/* props */
interface Iaction {
    text: string
    icon: string
}
interface Props {
    title?: string
    isBack?: boolean
    isActions?: boolean
    isMore?: boolean
    actionsList?: Iaction[]
}
withDefaults(defineProps<Props>(), {
    title: '环信IM',
    isBack: false,
    isActions: false,
    isMore: true,
})

// /* emits */
const emits = defineEmits<{
    (e: 'onSelect', params: string): void
    (e: 'onMore'): void
}>()
/* 右侧add反馈 */
const showPopover = ref(false)
// 通过 actions 属性来定义菜单选项
const actions = [
    { text: '发起会话', icon: 'chat' },
    { text: '添加好友', icon: 'manager' },
    { text: '添加群组', icon: 'friends' },
]
const emitSelect = (action: Iaction) => {
    console.log('>>>>>1111', action)
    emits('onSelect', action.icon)
}
const emitOnMore = () => {
    emits('onMore')
}
//左侧返回
const $router = useRouter()
const backPage = () => {
    $router.go(-1)
}
</script>

<style scoped></style>
