<template>
    <div>
        <div class="video_wrapper" :id="elId"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, toRefs, nextTick } from 'vue'
/* 视频播放使用 */
import ChimeeMobilePlayer from 'chimee-mobile-player'
import 'chimee-mobile-player/lib/chimee-mobile-player.min.css'
interface Props {
    elId: string
    videoUrl: string
}
const props = withDefaults(defineProps<Props>(), {
    elId: 'video_wrapper',
    videoUrl: '',
})
const { elId, videoUrl } = toRefs(props)
// 视频播放
onMounted(() => {
    nextTick(() => {
        const player = new ChimeeMobilePlayer({
            wrapper: `#${elId.value}`, // video dom容器
            src: videoUrl.value,
            autoplay: false,
            controls: true,
            playsInline: true,
            preload: true,
            x5VideoPlayerFullscreen: true,
            x5VideoOrientation: true,
            xWebkitAirplay: true,
            muted: true,
        })
    })
})
</script>

<style lang="scss" scoped>
.video_wrapper {
    width: 350px;
    height: 400px;
}
</style>
