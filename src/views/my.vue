<template>
    <div>
        <ChatNavBar title="我的" />
        <div class="my-contain">
            <ConfigProvider>
                <Row
                    type="flex"
                    style="align-items: center; padding: 10px 16px; background: #fff"
                >
                    <Image
                        width="60"
                        height="60"
                        :src="userStore.userInfo.vuechatAvatar || defaultAvatar"
                    />
                    <div class="chat-info">
                        <p class="chat-title">
                            <span>
                                {{ userStore.userInfo.vuechatName }}
                            </span>
                            <Icon
                                v-if="userStore.userInfo.sex === '男'"
                                :name="maleLogo"
                            />
                            <Icon
                                v-else
                                :name="femaleLogo"
                            />
                        </p>
                        <p class="chat-content">
                            <span>vuechat号：</span>
                            <span>{{ userStore.userInfo.vuechatAccount }}</span>
                        </p>
                        <p class="chat-content">
                            <span>地区：</span>
                            <span>{{ userStore.userInfo.address }}</span>
                        </p>
                    </div>
                    <i
                        data-v-15c04174
                        class="van-icon van-icon-arrow Cell__right-icon"
                        @click="handleGoPersonal"
                    />
                </Row>
                <CellGroup style="margin-top: 10px">
                    <Cell
                        is-link
                        to="applyfriends"
                    >
                        <!-- 使用 title 插槽来自定义标题 -->
                        <template v-slot:title>
                            <Icon
                                :name="chatgroupPng"
                                style="margin-right: 4px"
                                size="16"
                            />
                            <span class="custom-title">新的朋友</span>
                            <Badge
                                v-if="sendApplyNum > 0"
                                :content="sendApplyNum"
                                style="margin-left: 6px"
                            />
                        </template>
                    </Cell>
                    <Cell
                        :icon="chatgroupPng"
                        title="我的群组"
                        is-link
                        to="mychatgrounp"
                    />
                    <Cell
                        :icon="applicationPng"
                        title="我的应用"
                        is-link
                        to="application"
                    />
                    <Cell
                        :icon="changePwdPng"
                        title="更改密码"
                        is-link
                        to="changepassword"
                    />
                    <Cell
                        :icon="logoutPng"
                        title="退出登录"
                        is-link
                        @click="openDialog"
                    />
                </CellGroup>
            </ConfigProvider>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {useUserStore} from '@/store/user';
import storage from '@/common/storage';
import {Row, Image, CellGroup, Cell, ConfigProvider, Icon, Badge, showConfirmDialog} from 'vant';
import ChatNavBar from '@/components/chat-nav-bar.vue';
import maleLogo from '@/assets/image/male.png';
import femaleLogo from '@/assets/image/female.png';
import defaultAvatar from '@/assets/image/avatar.jpg';
import chatgroupPng from '@/assets/image/chatgroup.png';
import applicationPng from '@/assets/image/application.png';
import changePwdPng from '@/assets/image/changePwd.png';
import logoutPng from '@/assets/image/logout.png';
const router = useRouter();
const sendApplyNum = ref(0);
const userStore = useUserStore();
function handleGoPersonal() {
    router.push(`/personalinfo/${userStore.userId}`);
}
function openDialog() {
    showConfirmDialog({
        title: '标题',
        message: '确定退出登录吗？'
    })
        .then(async () => {
            await storage.removeItem('vue3-chat-token');
            await storage.removeItem('vue3-chat-id').then(() => {
                router.replace('/login');
            });
        })
        .catch(() => {
            // on cancel
        });
}
</script>

<style lang="scss" scoped>
p {
    padding: 0;
    margin: 0;
}
.my-contain {
    padding-top: 50px;
}
.chat-info {
    // height:40px;
    flex: 1;
    margin-left: 15px;
    .chat-title {
        display: flex;
        align-items: center;
        font-size: 15px;
    }
    .chat-content {
        margin-top: 6px;
        color: #999;
        font-size: 13px;
    }
}
</style>
