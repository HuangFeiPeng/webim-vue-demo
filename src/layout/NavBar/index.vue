<template>
    <van-nav-bar fixed placeholder :title="navBarTitle" :safe-area-inset-top="true" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
const route = useRoute()
const { t } = useI18n()
const navBarTitle = computed(() => {
    const title: string = route.name as string
    return t(`layout.navbar.${title}`)
})
</script>

<style scoped></style>
