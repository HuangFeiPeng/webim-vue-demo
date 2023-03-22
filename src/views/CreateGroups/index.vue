<template>
    <van-nav-bar
        :title="navBarTitle"
        left-text="返回"
        right-text="完成"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
    />
    <div class="creategroups_container">
        <van-cell-group>
            <van-cell
                title="名称"
                is-link
                :value="createNewGroupsForm.groupname || '请输入群组名称'"
                @click="showDialog('groupname')"
            />
            <van-cell title="简介" is-link :value="createNewGroupsForm.desc || '请输入群组简介'" />
            <van-cell title="群组人数" is-link :value="createNewGroupsForm.maxusers" @click="showDialog('maxusers')" />
        </van-cell-group>
        <van-cell-group>
            <van-cell
                center
                title="是否公开群组"
                :label="createNewGroupsForm.public ? '其他用户可以查到此群' : '其他用户不能查找到此群'"
            >
                <template #value>
                    <van-switch v-model="createNewGroupsForm.public" />
                </template>
            </van-cell>
            <van-cell
                v-show="!createNewGroupsForm.public"
                center
                title="群成员是否有邀请权限"
                :label="createNewGroupsForm.allowinvites ? '允许群成员邀请用户进群' : '只允许群主邀请用户进群'"
            >
                <template #value>
                    <van-switch v-model="createNewGroupsForm.allowinvites" />
                </template>
            </van-cell>
            <van-cell
                v-show="createNewGroupsForm.public"
                center
                title="加入是否需要验证"
                :label="createNewGroupsForm.approval ? '用户加入群组需要群主同意' : '用户可直接加入群组'"
            >
                <template #value>
                    <van-switch v-model="createNewGroupsForm.approval" />
                </template>
            </van-cell>
        </van-cell-group>
        <van-cell-group>
            <van-cell title="群组人数" is-link :value="createNewGroupsForm.members.length" @click="router.back()" />
        </van-cell-group>
        <van-dialog v-model:show="isShowDialog" :title="SHOWDIALOG_TITLE[showDialogType]" show-cancel-button>
            <template v-if="showDialogType === 'groupname'">
                <van-field
                    v-model="createNewGroupsForm.groupname"
                    :center="true"
                    placeholder="请输入群组名称"
                    maxlength="15"
                />
            </template>
            <template v-if="showDialogType === 'maxusers'">
                <van-field v-model="createNewGroupsForm.maxusers" type="digit" />
            </template>
        </van-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { EChatClient } from '@/EaseIM'
import { showToast } from 'vant'
import type { RouteRecordName, RouteLocationNormalizedLoaded } from 'vue-router'
const route: RouteLocationNormalizedLoaded = useRoute()
const { t } = useI18n()
const navBarTitle = computed(() => {
    const title: RouteRecordName = route.name || '标题'
    return t(`layout.navbar.${String(title)}`)
})

const onClickLeft = () => router.replace('conversations')
const onClickRight = () => {
    console.log('>>>>完成开始创建', createNewGroupsForm)
    actionCreateNewGroups()
}

/* 创建新群组 */
interface CreateNewGroupsInterface {
    groupname: string
    desc: string
    members: string[]
    public: boolean
    maxusers: number
    approval: boolean
    allowinvites: boolean
    inviteNeedConfirm: boolean
}
const createNewGroupsForm = reactive<CreateNewGroupsInterface>({
    groupname: '',
    desc: '',
    members: [],
    public: false,
    maxusers: 200,
    approval: false,
    allowinvites: false,
    inviteNeedConfirm: false, //暂时未启用
})
onMounted(() => {
    createNewGroupsForm.members = route?.query?.checkedList as string[]
})
//编辑创建群内容（群名&群人数）
type ShowDialogType = 'groupname' | 'maxusers'
const SHOWDIALOG_TITLE = {
    groupname: '设置群组名称',
    maxusers: '设置群组人数',
}
const isShowDialog = ref(false)
const showDialogType = ref<ShowDialogType>('groupname')

const showDialog = (showType: ShowDialogType) => {
    if (showType === 'groupname') {
        showDialogType.value = showType
    }
    if (showType === 'maxusers') {
        showDialogType.value = showType
    }
    isShowDialog.value = true
}
const actionCreateNewGroups = async () => {
    if (createNewGroupsForm.groupname === '') {
        return showToast('请输入群组名称！')
    }
    try {
        const { data } = await EChatClient.createGroup({ data: { ...createNewGroupsForm } })
        console.log('>>>>>创建成功', data)
        showToast(`${createNewGroupsForm.groupname}已创建`)
    } catch (error) {
        console.log('>>>>创建失败')
    }
}
</script>

<style lang="scss" scoped>
.creategroups_container {
}
</style>
