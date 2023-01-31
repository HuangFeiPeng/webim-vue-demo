<template>
    <div class="container">
        <van-field
            v-model="value"
            rows="5"
            autosize
            type="textarea"
            enterkeyhint="send"
            @focus="$emit('hideAllShowBox')"
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
    (e: 'hideAllShowBox'): void
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
.container {
    width: 100%;
    width: 100%;
    height: 80px;
}
:deep(.van-cell) {
    border-radius: 20px;
    height: 80px;
}
</style>
