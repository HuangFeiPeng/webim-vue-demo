<template>
    <van-nav-bar fixed placeholder :title="navBarTitle" :safe-area-inset-top="true" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const navBarTitle = computed(() => {
    const title: string = route.meta.title as string
    return title
})
</script>

<style scoped></style>
