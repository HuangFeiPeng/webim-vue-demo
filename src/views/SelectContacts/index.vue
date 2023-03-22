<template>
    <van-nav-bar
        :title="navBarTitle"
        left-text="返回"
        :right-text="`完成${checked.length ? '(' + checked.length + ')' : ''}`"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
    />
    <div class="select_contacts_container">
        <van-checkbox-group v-model="checked">
            <van-cell-group inset>
                <van-cell
                    v-for="(item, index) in contactList"
                    clickable
                    :key="item"
                    :title="mapUserInfos(item).nickname"
                    @click="toggle(index)"
                >
                    <template #icon>
                        <van-image round :src="mapUserInfos(item).avatarurl" />
                    </template>
                    <template #right-icon>
                        <van-checkbox
                            :name="item"
                            :ref="(el) => (checkboxRefs[index] = el as CheckboxInstance)"
                            @click.stop
                        />
                    </template>
                </van-cell>
            </van-cell-group>
        </van-checkbox-group>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUpdate } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import _ from 'lodash'
import type { CheckboxInstance } from 'vant'
import type { RouteRecordName, RouteLocationNormalizedLoaded } from 'vue-router'
// import router from '@/router'
import { useContactsStore } from '@/stores'
import defaultAvatar from '@/assets/images/login/loginIcon.png'
import router from '@/router'
const route: RouteLocationNormalizedLoaded = useRoute()
const { t } = useI18n()
const navBarTitle = computed(() => {
    const title: RouteRecordName = route.name || '标题'
    return t(`layout.navbar.${String(title)}`)
})
const nextToRouterName = computed(() => {
    return route.query.nextToRouterName
})
const onClickLeft = () => history.back()
const onClickRight = () => {
    router.push({ name: nextToRouterName.value as string, query: { checkedList: checked.value } })
}

/* 复选联系人 */
const contactList = ref<string[]>([])
const contactsStore = useContactsStore()
onMounted(() => {
    contactList.value = _.keys(contactsStore.contacts)
})
const checked = ref<string[]>([])
const checkboxRefs = ref<CheckboxInstance[]>([])
const toggle = (index: number) => {
    if (checkboxRefs.value) {
        checkboxRefs.value[index].toggle()
    }
}
//获取对应的联系人的昵称头像展示
const mapUserInfos = computed(() => {
    return (hxId: string) => {
        return {
            nickname: contactsStore.contacts[hxId]?.nickname || hxId,
            avatarurl: contactsStore.contacts[hxId]?.avatarurl || defaultAvatar,
        }
    }
})
onBeforeUpdate(() => {
    checkboxRefs.value = []
})
</script>

<style lang="scss" scoped>
:deep(.van-image__img) {
    width: 80px;
    height: 80px;
    margin-right: 20px;
}
</style>
