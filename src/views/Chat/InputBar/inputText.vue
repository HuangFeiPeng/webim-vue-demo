<template>
    <div class="container">
        <van-field
            v-model="value"
            rows="5"
            autosize
            type="textarea"
            placeholder="请输入留言"
            enterkeyhint="send"
            @focus="$emit('hideEmojiPicker')"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
interface Props {
    modelValue: string
}
const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
})
const emit = defineEmits<{
    (e: 'update:modelValue', params: string): void
    (e: 'hideEmojiPicker'): void
}>()
// const emit = defineEmits(['update:modelValue'])

const value = computed<string>({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    },
})
</script>

<style lang="scss" scoped>
:deep(.van-cell) {
    height: 100px;
}
</style>
