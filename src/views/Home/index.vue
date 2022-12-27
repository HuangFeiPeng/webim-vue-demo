<template>
    <div class="app_container">
        <!-- NavBar -->
        <nav-bar />
        <!-- Main -->
        <router-view></router-view>
        <!-- TabBar -->
        <tab-bar />
    </div>
</template>

<script setup lang="ts">
import './index.scss'
import NavBar from '@/layout/NavBar/index.vue'
import TabBar from '@/layout/TabBar/index.vue'
</script>
