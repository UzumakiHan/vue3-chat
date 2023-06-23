<template>
    <div class="select">
        <ChatNavBar
            title="选择好友"
            :nav-type="2"
        />
        <div class="select-container">
            <div class="select-container-list">
                <van-checkbox-group
                    ref="checkboxGroup"
                    v-model="selectResult"
                >
                    <div
                        v-for="(item, index) in userStore.mailList"
                        :key="index"
                        class="select-container-list-item"
                    >
                        <van-checkbox :name="item._id" />
                        <van-image
                            width="50"
                            height="50"
                            :src="item.vuechatAvatar"
                            style="margin-left: 10px"
                        />
                        <span class="chat-name">{{ item.vuechatAccount }}</span>
                    </div>
                    <van-divider />
                </van-checkbox-group>
            </div>
        </div>
        <div class="select-btn-fixed">
            <van-cell class="btn-cell">
                <van-button
                    type="primary"
                    @click="handleCheckAll"
                >
                    全选
                </van-button>
                <van-button
                    type="primary"
                    style="margin: 0 10px"
                    @click="handleToggleAll"
                >
                    反选
                </van-button>
                <van-button
                    type="success"
                    @click="handleSureAddChat"
                >
                    确定
                </van-button>
            </van-cell>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {showToast, showLoadingToast, closeToast} from 'vant';
import axios from 'axios';

import {useRouter} from 'vue-router';
import {useUserStore} from '@/store/index';

import ChatNavBar from '@/components/chat-nav-bar.vue';
import wechatBg from '@/assets/img/wechatbg.png';
const router = useRouter();
const checkboxGroup = ref();
const userStore = useUserStore();
const selectResult = ref<Array<string>>([]);

function handleCheckAll() {
    checkboxGroup.value.toggleAll(true);
}
function handleToggleAll() {
    checkboxGroup.value.toggleAll();
}
function handleSureAddChat() {
    if (selectResult.value.length === 0) {
        showToast('请选择好友');
        return;
    }
    if (selectResult.value.length > 1) {
        const formData = new FormData();
        const chatRoomMemberId = [];
        selectResult.value.forEach(member => {
            chatRoomMemberId.push(member);
        });
        chatRoomMemberId.push(userStore.userId);
        formData.append('chatRoomMemberId', JSON.stringify(chatRoomMemberId));
        formData.append('chatRoomImg', wechatBg);
        formData.append('chatRoomOwner', userStore.userId);
        const headers = {
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Type': 'multipart/form-data'
            }
        };
        showLoadingToast({
            forbidClick: true,
            duration: 0,
            overlay: true
        });
        const createChatRoomApi =
            import.meta.env.MODE === 'development' ? '/api/chatroom/createChatRoom' : '/chatroom/createChatRoom';

        axios
            .post(createChatRoomApi, formData, headers)
            .then(res => {
                closeToast();
                if (res.data.status === 2) {
                    showToast(res.data.message);
                    router.replace('/mychatgrounp');
                } else {
                    showToast('创建失败');
                }
            })
            .catch(err => {
                throw Error(err);
            });
    } else {
        showToast('请选择大于1个人的群聊');
    }
}
onMounted(() => {
    userStore.getMailList();
});
</script>

<style lang="scss" scoped>
.select {
    &-container {
        padding-top: 50px;
        &-list {
            box-sizing: border-box;
            padding: 10px 16px;
            &-item {
                display: flex;

                align-items: center;
                // justify-content: space-between;
                .chat-name {
                    margin-left: 10px;
                    font-size: 15px;
                }
            }
        }
    }
    &-btn-fixed {
        position: fixed;
        z-index: 990;
        bottom: 10px;
        left: 10px;
    }
}
</style>
