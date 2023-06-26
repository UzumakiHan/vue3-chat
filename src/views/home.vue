<template>
    <div class="home">
        <ChatNavBar title="首页" />
        <div style="padding-top: 50px">
            <List v-if="allChatList.length > 0">
                <div
                    v-for="(item, index) in allChatList"
                    :key="index"
                    class="chat-list"
                    @click="goChatPage(item)"
                >
                    <template v-if="item.targetAccountAvatar || item.chatRoomId">
                        <Image
                            v-if="item.chatRoomId"
                            width="50"
                            height="50"
                            :src="item.chatRoomImg"
                        />
                        <van-image
                            v-else
                            width="50"
                            height="50"
                            :src="item.targetAccountId === userId ? item.sendAccountAvatar : item.targetAccountAvatar"
                        />
                        <div
                            v-if="item.chatRoomId"
                            class="chat-info"
                        >
                            <div class="chat-info-box chat-room">
                                <div>
                                    <p class="chat-info-box-title">
                                        <span>{{ item.chatRoomName }}</span>
                                    </p>
                                    <p
                                        v-if="item.chatMessage"
                                        class="chat-info-box-content"
                                    >
                                        {{ item.sendAccountName }}:{{ item.chatMessage }}
                                    </p>
                                    <p
                                        v-if="item.chatImg"
                                        class="chat-info-box-content"
                                    >
                                        {{ item.sendAccountName }}:[ 图片 ]
                                    </p>
                                    <p
                                        v-if="item.chatVoice.chatVoiceUrl"
                                        class="chat-info-box-content"
                                    >
                                        {{ item.sendAccountName }}:[ 语音 ]
                                    </p>
                                </div>
                                <span class="chat-info-box-time">{{ dayjs(item.chatTime).format('HH:mm:ss') }}</span>
                            </div>
                        </div>
                        <div
                            v-else
                            class="chat-info"
                        >
                            <div class="chat-info-box">
                                <p class="chat-info-box-title">
                                    <span>{{
                                        item.sendAccountId === userId ? item.targetAccountName : item.sendAccountName
                                    }}</span>
                                </p>
                                <p
                                    v-if="item.chatMessage"
                                    class="chat-info-box-content"
                                >
                                    {{ item.chatMessage }}
                                </p>
                                <p
                                    v-if="item.chatImg"
                                    class="chat-info-box-content"
                                >
                                    [ 图片 ]
                                </p>
                                <p
                                    v-if="item.chatVoice.chatVoiceUrl"
                                    class="chat-info-box-content"
                                >
                                    [ 语音 ]
                                </p>
                            </div>
                            <span class="chat-info-box-time">{{ dayjs(item.chatTime).format('HH:mm:ss') }}</span>
                        </div>
                    </template>
                </div>
            </List>
            <Empty
                v-else
                description="暂未聊天消息"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted, defineAsyncComponent} from 'vue';
import {useRouter} from 'vue-router';
import {List, Image, Empty, showToast} from 'vant';
import dayjs from 'dayjs';

import {IChatList, IAjaxRes} from '@/common/typings';
import storage from '@/common/storage';
import {alldigtalChatList, getAllgrounpChatList} from '@/common/api';
import socketIo from '@/common/socketio';
const ChatNavBar = defineAsyncComponent(() => import('@/components/chat-nav-bar.vue'));

const router = useRouter();
const allChatList = ref<Array<IChatList>>([]);
const userId = ref<string>('');
const getChatList = async () => {
    storage.getItem('vue3-chat-id').then(async value => {
        userId.value = value as string;
        const chatUserRes = (await alldigtalChatList(userId.value)) as IAjaxRes;
        const allGrounpRes = (await getAllgrounpChatList(userId.value)) as IAjaxRes;
        const chatDigtalList = chatUserRes.data?.chatDigtalList as Array<IChatList>;
        const chatDigtalGrounpList = allGrounpRes.data?.allGrounpChatList as Array<IChatList>;

        if (chatUserRes.status === 2 && chatDigtalList.length > 0) {
            allChatList.value = allChatList.value.concat(chatDigtalList);
        } else {
            showToast(chatUserRes.message);
        }
        if (allGrounpRes.status === 2) {
            allChatList.value = allChatList.value.concat(chatDigtalGrounpList);
        }
    });
};
// 跳转聊天页面
function goChatPage(item: IChatList) {
    if (item.chatRoomId) {
        router.push(`/grounpchatpage/${item.chatRoomId}`);
    } else {
        const targetId = item.targetAccountId;
        const sendId = item.sendAccountId;
        router.push(`/chatpage/${targetId}/${sendId}`);
    }
}
function handleCommonMsg(msg: IChatList, i: number) {
    if (msg.chatMessage) {
        allChatList.value[i].chatVoice = {
            chatVoiceUrl: '',
            chatVoiceTime: ''
        };
        allChatList.value[i].chatImg = '';
        allChatList.value[i].chatMessage = msg.chatMessage;
    } else if (msg.chatVoice) {
        allChatList.value[i].chatMessage = '';
        allChatList.value[i].chatImg = '';
        allChatList.value[i].chatVoice = msg.chatVoice;
    } else if (msg.chatImg) {
        allChatList.value[i].chatMessage = '';
        allChatList.value[i].chatVoice = {
            chatVoiceUrl: '',
            chatVoiceTime: ''
        };
        allChatList.value[i].chatImg = msg.chatImg;
    }
}
function handleReceiveMsg(msg: IChatList) {
    if (msg && msg.targetAccountId === userId.value) {
        const sendAccountAndTargetAccountId = msg.sendAccountId + msg.targetAccountId;
        const targetAccountAndSendAccountId = msg.targetAccountId + msg.sendAccountId;
        const allChatListLength = allChatList.value.length;
        if (allChatListLength > 0) {
            for (let i = 0; i < allChatListLength; i++) {
                if (
                    sendAccountAndTargetAccountId === allChatList.value[i].sendAccountAndTargetAccountId ||
                    targetAccountAndSendAccountId === allChatList.value[i].sendAccountAndTargetAccountId
                ) {
                    handleCommonMsg(msg, i);
                    allChatList.value[i].chatTime = msg.chatTime;
                }
            }
        }
    }
}
function handleSocketIo() {
    socketIo.on('connect', () => {
        console.log('socketio-connect');
    });
    socketIo.emit('online', userId.value);
    // 实时监听在线私聊消息
    socketIo.on('receiveChatMessage', msg => {
        handleReceiveMsg(msg);
    });
    // 实时监听离线私聊消息
    socketIo.on('receiveOffLineChatMessage', msg => {
        handleReceiveMsg(msg);
    });
}
onMounted(() => {
    getChatList();
    handleSocketIo();
});
</script>

<style lang="scss" scoped>
p {
    padding: 0;
    margin: 0;
}
.home {
    margin-bottom: 50px;
    // min-height: 100vh;
}
.chat-list {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    align-items: center;
    padding: 10px 16px;
}
.chat-info {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    margin-left: 15px;
    &-box {
        &.chat-room {
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: space-between;
        }
        &-title {
            display: flex;
            font-size: 15px;
        }
        &-content {
            overflow: hidden;
            margin-top: 10px;
            color: #999;
            // width: 240px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        &-time {
            color: #999;
        }
    }
}
.chat-time {
    color: #999;
}
</style>
