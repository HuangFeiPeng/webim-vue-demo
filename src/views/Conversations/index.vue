<template>
    <div class="conversations_container">
        <van-list
            v-model:loading="loading"
            :finished="finished"
            :finished-text="$t('conversations.nomore')"
            @load="onLoadConversations"
        >
            <!-- 搜索组件 -->
            <SearchInput />
            <van-swipe-cell v-for="item in conversationList" :key="item.id">
                <div class="conversation_item_box">
                    <div class="avatar_box">
                        <van-badge :content="item.unReadNum" max="99" :show-zero="false">
                            <img
                                class="avatar_box_img"
                                src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                                alt=""
                            />
                        </van-badge>
                    </div>
                    <div class="chat_infor_main">
                        <p class="name">{{ item.id }}</p>
                        <p class="last_msg">
                            {{ item.lastMessage.msg || item.lastMessage.url }}
                        </p>
                    </div>
                    <div class="chat_infor_right">11:10</div>
                </div>
                <template #right>
                    <div class="conversation_swipe_right">
                        <van-button square type="warning" :text="$t('conversations.swipeCellBtn.stick')" />
                        <van-button square type="danger" :text="$t('conversations.swipeCellBtn.delete')" />
                    </div>
                </template>
            </van-swipe-cell>
        </van-list>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
/* pinia */
import { useConversationStore } from '@/stores'
/* IM */
import { useFetchConversation } from '@/EaseIM/hooks'
import SearchInput from '@/components/SearchInput/index.vue'
//会话列表
const store = useConversationStore()
const conversationList = computed(() => {
    return store.getConversationListvalues
})

//下拉加载更多数据
const loading = ref(false)
const finished = ref(false)
const pageNum = ref(0)
const pageSize = ref(20)
const { fetchConversionList } = useFetchConversation()
const onLoadConversations = async () => {
    try {
        if (conversationList.value.length) {
            console.log('>>>>忽略')
        } else {
            console.log('conversationList', conversationList.value.length)
            await fetchConversionList({ pageNum: pageNum.value, pageSize: pageSize.value })
        }
    } catch (error) {
        console.log('>>>>>>> Error')
    } finally {
        loading.value = false
        finished.value = true
    }

    console.log('>>>>>加载一下')
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
