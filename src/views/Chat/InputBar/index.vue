<template>
    <div class="input_bar_container">
        <search-input />
    </div>
</template>

<script setup lang="ts">
import SearchInput from '@/components/SearchInput/index.vue'
</script>

<style lang="scss" scoped>
.input_bar_container {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100px;
    background: green;
}
</style>
