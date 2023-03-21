<template>
    <div class="addfriends_container">
        <van-row>
            <van-col span="24">
                <!-- 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
                <form action="javascript:return true;">
                    <van-search
                        v-model="searchValue"
                        show-action
                        placeholder="请输入搜索关键词"
                        @search="onSearch"
                        @cancel="onCancel"
                        @clear="onClear"
                    />
                </form>
            </van-col>
            <van-col span="24">
                <div class="addfriends_searchResult" v-for="item in searchResults" :key="item.hxId">
                    <!-- 添加好友 -->
                    <div class="searchResult_card">
                        <div class="searchResult_card_main">
                            <van-image round :src="item?.avatarurl || defaultAvatar" />
                            <div class="name">{{ item?.nickname || item.hxId }}</div>
                        </div>

                        <van-button
                            class="add_btn"
                            type="primary"
                            :disabled="!item.canApply"
                            :text="!item.canApply ? '已添加' : '添加'"
                            @click="actionAddFriend"
                        ></van-button>
                    </div>
                </div>
            </van-col>
        </van-row>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import router from '@/router'
import { EChatClient } from '@/EaseIM'
import { showToast } from 'vant'
import { useContactsStore } from '@/stores'
import defaultAvatar from '@/assets/images/login/loginIcon.png'
interface SearchResultsParams {
    hxId: string
    nickname?: string
    avatarurl?: string
    canApply: boolean
}
const contactsStore = useContactsStore()
const searchValue = ref('')
const searchResults = ref<SearchResultsParams[]>([])
watch(searchValue, (newVal, oldVal) => {
    if (newVal === '') {
        console.log('>>>>>清空输入结果')
        searchResults.value = []
    }
})
//校验是否在好友列表
const checkIsInFriends = (hxId: string) => {
    if (contactsStore.contacts[hxId]) {
        return false
    } else {
        return true
    }
}
//执行搜索好友
const onSearch = async () => {
    console.log('>>>>执行搜索')
    if (searchValue.value) {
        if (searchValue.value === EChatClient.user) {
            showToast('您不能添加自己为好友！')
            return
        }
        try {
            let params: SearchResultsParams = {
                hxId: searchValue.value,
                canApply: checkIsInFriends(searchValue.value),
            }
            const { data } = await EChatClient.fetchUserInfoById(searchValue.value, ['nickname', 'avatarurl'])
            if (data && JSON.stringify(data[searchValue.value]) !== '{}') {
                params.nickname = data[searchValue.value]?.nickname
                params.avatarurl = data[searchValue.value]?.avatarurl
            }
            searchResults.value.push(params)
        } catch (error) {
            console.log('>>>>搜索失败')
        }
    }
}
//取消搜索
const onCancel = () => {
    router.back()
}
const onClear = () => (searchValue.value = '')
//执行添加动作
const actionAddFriend = () => {
    EChatClient.addContact(searchValue.value)
    showToast('好友申请已发出~')
    searchValue.value = ''
    searchResults.value = []
}
</script>

<style lang="scss" scoped>
.addfriends_container {
    width: 100%;
    height: 100vh;
}
.addfriends_searchResult {
    width: 100%;
    height: 100px;
    .searchResult_card {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px;
        .searchResult_card_main {
            width: 80%;
            display: flex;
            flex-direction: row;
            align-items: center;
        }
        .add_btn {
            font-size: 13px;
            width: 150px;
            height: 50px;
        }
        :deep(.van-image__img) {
            width: 80px;
            height: 80px;
            margin-right: 20px;
        }
    }
}
</style>
