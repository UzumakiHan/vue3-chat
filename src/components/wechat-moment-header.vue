<template>
    <div class="wechat-moment">
        <ChatNavBar
            title="朋友圈"
            :nav-type="2"
            icon-name="plus"
            :has-right="props.userId === userStore.userId"
            :has-left="bgFlag"
            @handle-click-right="handleGoPlubish"
        />
        <div class="wechat-moment-header">
            <header>
                <van-image
                    scale-down
                    width="100%"
                    height="200px"
                    :src="userInfo.wechatMomentBg || defaultMomentBg"
                />
                <p
                    id="user-name"
                    class="data-name"
                >
                    {{ props.userInfo.vuechatAccount }}
                </p>
                <img
                    id="avt"
                    class="data-avt"
                    :src="props.userInfo.vuechatAvatar"
                    @click="handleAvatarClick"
                >
                <div
                    v-if="bgFlag"
                    class="wechat-moment-header-switch"
                    @click="hanldeGoChangeBg"
                >
                    <van-icon
                        :name="switchPng"
                        size="16"
                    />
                    <span style="margin-left: 4px; font-size: 13px"> 更改背景</span>
                </div>
            </header>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineAsyncComponent} from 'vue';
import {useRouter} from 'vue-router';

import {useUserStore} from '@/store/index';

import {IUserInfo} from '@/common/typings';

import defaultMomentBg from '@/assets/img/default-moment.jpg';
import switchPng from '@/assets/img/switchbg.png';

const ChatNavBar = defineAsyncComponent(() => import('@/components/chat-nav-bar.vue'));
const props = defineProps({
    userInfo: {
        type: Object as () => IUserInfo,
        default: () => {
            return {};
        }
    },
    userId: {
        type: String,
        default: ''
    },
    bgFlag: {
        type: Boolean,
        default: false
    }
});
const emits = defineEmits(['handleAvatarClick']);
const userStore = useUserStore();
const router = useRouter();

function handleGoPlubish() {
    router.push('/publicmoments');
}
function hanldeGoChangeBg() {
    router.push('/changemomentbg');
}
function handleAvatarClick() {
    emits('handleAvatarClick');
}
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
