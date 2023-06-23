<template>
    <div
        v-if="userInfo"
        class="wechat-moment"
    >
        <WechatMomentHeader
            :user-info="userInfo"
            :user-id="userId"
            :bg-flag="true"
        />
        <WechatMomentList
            :user-info="userInfo"
            :user-id="userId"
        />
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';

import {useUserStore} from '@/store/index';
import {IUserInfo, IAjaxRes} from '@/common/typings';
import {getUserInfo} from '@/common/api';

import WechatMomentList from '@/components/wechat-moment-list.vue';
import WechatMomentHeader from '@/components/wechat-moment-header.vue';

const userStore = useUserStore();

const route = useRoute();
const userId = (route.query?.userId || userStore.userId) as string;
const userInfo = ref();

async function handlGetUserInfo() {
    const result = (await getUserInfo(userId)) as IAjaxRes;
    userInfo.value = result.data as IUserInfo;
}

onMounted(() => {
    handlGetUserInfo();
});
</script>

<style lang="scss" scoped>
@import '@/scss/wechat-friend';
.wechat-moment {
    &-header {
        header {
            position: relative;
        }
        &-switch {
            position: absolute;
            top: 8px;
            right: 16px;
            display: flex;
            width: 84px;
            height: 24px;
            align-items: center;
            padding-left: 8px;
            border-radius: 15px;
            background-color: rgb(0, 0, 0);
            color: #fff;
            opacity: 0.6;
        }
    }
}
</style>
