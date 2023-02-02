<template>
    <router-view />
</template>
<script setup lang="ts">
/* eruda */
import eruda from 'eruda'
import { useLocale } from '@/i18n/use-locale'
import { useEMConnectListener } from '@/EaseIM/hooks'
useEMConnectListener()
useLocale()
eruda.init()
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
