<template>
    <div class="chat-grounp">
        <ChatNavBar
            title="我的群组"
            :nav-type="2"
            :has-right="true"
            icon-name="add"
            @handle-click-right="handleAddGrounp"
        />

        <div class="chat-grounp-container">
            <div
                v-if="myChatGrounp.length > 0"
                class="chat-grounp-container-list"
            >
                <div
                    v-for="(chatroom, chatindex) in myChatGrounp"
                    :key="chatindex"
                    class="chat-grounp-container-list-item"
                    @click="goToGrounpChatPage(chatroom)"
                >
                    <van-image
                        width="50"
                        height="50"
                        :src="chatroom.chatRoomImg"
                    />
                    <span class="chat-name">{{ chatroom.chatRoomName }}</span>
                </div>

                <p class="chat-grounp-container-desc">
                    共{{ myChatGrounp.length }}个群组
                </p>
            </div>

            <van-empty
                v-else
                description="暂无群组"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import axios from 'axios';
import {showToast, showLoadingToast, closeToast} from 'vant';

import {useUserStore} from '@/store/user';
import {IChatRoom} from '@/typings';
import ChatNavBar from '@/components/chat-nav-bar.vue';
const userStore = useUserStore();

const myChatGrounp = ref<Array<IChatRoom>>([]);
const router = useRouter();
async function handleGetAllMyChatRoom() {
    const chatRoomIdArr = JSON.stringify(userStore.userInfo.chatRooms);
    const formData = new FormData();
    formData.append('chatRoomIdArr', chatRoomIdArr);
    const headers = {
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'multipart/form-data'
        }
    };
    const myChatRoomApi = process.env.NODE_ENV === 'development' ? '/api/chatroom/myChatRoom' : '/chatroom/myChatRoom';
    showLoadingToast({});
    axios
        .post(myChatRoomApi, formData, headers)
        .then(res => {
            if (res.data.status === 2) {
                closeToast();
                myChatGrounp.value = res.data.data;
            } else {
                showToast('获取群组失败');
            }
        })
        .catch(err => {
            throw Error(err);
        });
}
function handleAddGrounp() {
    router.push('/selectchatfriends');
}
function goToGrounpChatPage(chatroom: IChatRoom) {
    router.push(`/grounpchatpage/${chatroom._id}`);
}
onMounted(() => {
    handleGetAllMyChatRoom();
});
</script>

<style lang="scss" scoped>
.chat-grounp {
    &-container {
        padding-top: 50px;
        &-list {
            box-sizing: border-box;
            padding: 10px 16px;
            &-item {
                display: flex;

                align-items: center;
                padding-bottom: 10px;
                // justify-content: space-between;
                border-bottom: 1px solid #eee;
                &:last-child {
                    border-bottom: none;
                }
                .chat-name {
                    margin-left: 10px;
                    font-size: 15px;
                }
            }
        }
        &-desc {
            margin-top: 10px;
            text-align: center;
        }
    }
}
</style>
