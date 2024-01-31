<template>
    <div class="contacts_container">
        <search-input />
        <div class="contacts_header_box">
            <van-cell-group>
                <van-cell title-class="contacts_cell_title" is-link>
                    <template #title>
                        <van-image
                            class="contacts_avatar"
                            src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                        />
                        <span class="custom-title">{{ $t('contacts.newFriends') }}</span>
                    </template>
                </van-cell>
                <van-cell is-link>
                    <template #title>
                        <van-image
                            class="contacts_avatar"
                            src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                        />
                        <span class="custom-title">{{ $t('contacts.groupsChat') }}</span>
                    </template>
                </van-cell>
            </van-cell-group>
        </div>
        <div class="contacts_main_box">
            <van-index-bar>
                <div v-for="(val, key, index) in getSortedContacts" :key="index">
                    <van-index-anchor :index="key"></van-index-anchor>
                    <van-cell v-for="item in val" :key="item.hxId">
                        <template #title>
                            <van-image class="contacts_avatar" :src="item.avatarurl || defaultAvatarUrl" />
                            <span class="custom-title">{{ item?.nickname || item.hxId }}</span>
                        </template>
                    </van-cell>
                </div>
            </van-index-bar>
            <van-divider>{{ contactsNums + $t('contacts.friendsNum') }}</van-divider>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import _ from 'lodash'
/* 搜索组件 */
import SearchInput from '@/components/SearchInput/index.vue'
import { useContactsStore } from '@/stores'
const defaultAvatarUrl = 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
const contactsStore = useContactsStore()
//联系人源数据
const contactsNums = computed(() => {
    return contactsStore.contactsList.length
})
//拼音排序后的联系人列表
const getSortedContacts = computed(() => {
    return contactsStore.getSortPinyinFriendItem
})
// const indexList = computed(() => {
//     return _.keys(contactsStore.getSortPinyinFriendItem)
// })
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
