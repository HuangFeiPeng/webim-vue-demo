<template>
    <router-view />
</template>
<script setup lang="ts">
import { useLocale } from '@/i18n/use-locale'
import { useEMConnectListener } from '@/EaseIM/hooks'
useEMConnectListener()
useLocale()
</script>
<style lang="scss">
@import '@/assets/reset.css';
html,
body,
#app {
    height: 100%;
    overflow: hidden;
}
</style>
