<template>
    <router-view />
</template>
<script setup lang="ts">
import { useEMConnectListener } from '@/EaseIM/hooks'
useEMConnectListener()
</script>
<style lang="scss">
@import '@/assets/reset.css';
</style>
