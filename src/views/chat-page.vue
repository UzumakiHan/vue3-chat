<template>
    <div
        v-if="receiveUserInfo"
        class="chat-page"
    >
        <ChatNavBar
            :title="receiveUserInfo.vuechatName"
            :nav-type="navType"
            :has-right="true"
            @handle-click-right="handleGoMore"
        />
        <div
            id="chatbox"
            ref="chatboxRef"
            class="chat-content"
        >
            <hfex-list
                v-if="chatDigtalList.length > 0"
                v-model="flowLoading"
                :finished="flowFinished"
                :error="flowError"
                pullup-tips-bg="transparent"
                :show-pullup-tips="false"
                @load="onLoad"
            >
                <template v-for="(chatAccountItem, chatAccountIndex) in chatDigtalList">
                    <ChatContent
                        v-if="chatAccountItem.sendAccountId === userId"
                        :key="chatAccountIndex"
                        :user-name="userStore.userInfo.vuechatAccount"
                        :chat-message="chatAccountItem.chatMessage"
                        :chat-voice-url="chatAccountItem.chatVoice.chatVoiceUrl"
                        :chat-voice-time="chatAccountItem.chatVoice.chatVoiceTime"
                        :chat-time="chatAccountItem.chatTime"
                    >
                        <template v-slot:useravatar>
                            <img
                                :src="userStore.userInfo.vuechatAvatar"
                                @click="checkUserInfo(receiveUserInfo)"
                            >
                        </template>
                        <template
                            v-if="chatAccountItem.chatImg"
                            v-slot:chatimg
                        >
                            <van-image
                                :src="chatAccountItem.chatImg"
                                width="220"
                                height="250"
                                fit="cover"
                                @click="handlePreviewImg(chatAccountItem.chatImg)"
                            />
                            <div style="height: 240px" />
                        </template>
                    </ChatContent>

                    <!-- Right -->

                    <ChatContent
                        v-if="chatAccountItem.targetAccountId === userId && receiveUserInfo"
                        :key="'info2-' + chatAccountIndex"
                        :user-name="receiveUserInfo.vuechatName"
                        :chat-message="chatAccountItem.chatMessage"
                        :chat-voice-url="chatAccountItem.chatVoice.chatVoiceUrl"
                        :chat-voice-time="chatAccountItem.chatVoice.chatVoiceTime"
                        :chat-time="chatAccountItem.chatTime"
                        :is-right="false"
                    >
                        <template v-slot:useravatar>
                            <img
                                :src="receiveUserInfo.vuechatAvatar"
                                @click="checkUserInfo(receiveUserInfo)"
                            >
                        </template>
                        <template
                            v-if="chatAccountItem.chatImg"
                            v-slot:chatimg
                        >
                            <van-image
                                :src="chatAccountItem.chatImg"
                                width="220"
                                height="250"
                                fit="cover"
                                @click="handlePreviewImg(chatAccountItem.chatImg)"
                            />
                            <div style="height: 240px" />
                        </template>
                    </ChatContent>
                </template>
            </hfex-list>
        </div>

        <div class="send-box">
            <div
                class="voice-box"
                @click="showVoiceBlock"
            >
                <van-icon
                    v-if="voiceKeyBoardFlag"
                    :name="voiceIcon"
                    size="24"
                />
                <van-icon
                    v-else
                    :name="keyboardIcon"
                    size="24"
                />
            </div>
            <div class="input-box">
                <van-field
                    v-if="voiceKeyBoardFlag"
                    ref="sendinputRef"
                    v-model="chatMsg"
                    class="vue-input"
                    @keyup.enter="sendChatMsg"
                />
                <van-button
                    v-else
                    type="default"
                    class="voice-btn"
                >
                    <van-icon
                        :name="recordvoiceIcon"
                        size="24"
                        @click="recordingVoice"
                    />
                    <van-icon
                        :name="sendvoiceIcon"
                        size="24"
                        style="margin-left: 40px"
                        @click="sendVoice"
                    />
                </van-button>
            </div>
            <div class="other-box">
                <van-icon
                    name="smile-o"
                    style="margin-right: 5px"
                    size="24"
                    @click.stop="faceContent"
                />
                <van-uploader
                    v-model="fileList"
                    :after-read="uploadImg"
                >
                    <van-icon
                        name="plus"
                        size="24"
                    />
                </van-uploader>
            </div>
            <FaceComp
                v-show="faceShow"
                ref="faceBoxRef"
                :face-bottom="50"
                @handle-get-current-face="handleGetCurrentFace"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref, nextTick} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {showToast, showImagePreview} from 'vant';
import {onClickOutside} from '@vueuse/core';
import HfexList from 'hfex-list';

import Recorderx from 'recorderx';
import {useUserStore} from '@/store/user';
import storage from '@/common/storage';
import {getDigtalChatMsg, getUserInfo} from '@/common/api';
import socketIo from '@/common/socketio';

import {IChatList, IUserInfo, IAjaxRes, IGetDigtalChatMsg} from '@/typings';
import ChatNavBar from '@/components/chat-nav-bar.vue';
import FaceComp from '@/components/face-comp.vue';
import ChatContent from '@/components/chat-content.vue';

import voiceIcon from '@/assets/image/voice-circle.png';
import keyboardIcon from '@/assets/image/keyboard.png';
import recordvoiceIcon from '@/assets/image/voice.png';
import sendvoiceIcon from '@/assets/image/send.png';

const rc = new Recorderx();
const flowLoading = ref(false);
const flowFinished = ref(false);
const flowError = ref(false);
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const {targetId, sendId} = route.params;
const navType = ref(2);
const chatDigtalList = ref<Array<IChatList>>([]);
const userId = ref('');
const faceShow = ref(false);
const voiceKeyBoardFlag = ref(true);
const fileList = ref([]);
const page = ref(1);
const pageSize = 10;
const chatMsg = ref('');
const sendinputRef = ref<HTMLElement>();
// 聊天者信息
const receiveUserInfo = ref();
const onlineUserList = ref([]);
const chatboxRef = ref<HTMLElement>();
const faceBoxRef = ref<HTMLElement>();
const momentText = ref('');
onClickOutside(faceBoxRef, () => {
    faceShow.value = false;
});
function handleGetCurrentFace(faceContents: string) {
    momentText.value += faceContents;
}
function handlePreviewImg(img: string) {
    const imglist = [];
    imglist.push(img);
    showImagePreview(imglist);
}
// 获取接受者信息
async function handleReceiveUserInfo() {
    const id = targetId === userStore.userId ? sendId : targetId;
    const userInfoRes: IAjaxRes = (await getUserInfo(id as string)) as IAjaxRes;
    receiveUserInfo.value = userInfoRes.data;
}
// 获取当前聊天室内容
async function handleChatMsg() {
    flowLoading.value = true;
    const chatMsgInfo: IGetDigtalChatMsg = {
        targetAccountId: targetId as string,
        sendAccountId: sendId as string,
        page: page.value,
        pageSize
    };
    const chatMsgRes = (await getDigtalChatMsg(chatMsgInfo)) as IAjaxRes;
    flowLoading.value = false;
    if (chatMsgRes.status === 2) {
        const list = chatMsgRes.data?.chatDigtalList as Array<IChatList>;
        if (list.length === 0) {
            flowFinished.value = true;
            return;
        }
        if (list.length > 0) {
            chatDigtalList.value = chatDigtalList.value.concat(list);
            flowFinished.value = false;
            page.value += 1;
        }
        handleReceiveUserInfo();
    }
}

function checkUserInfo(user: IUserInfo) {
    router.push(`/chatuserInfo/${user._id}`);
}
// 获取所有表情
function faceContent() {
    faceShow.value = !faceShow.value;

    sendinputRef.value?.focus();
}

// 录制语音
function recordingVoice() {
    console.log('1');
}
// 发送语音
function sendVoice() {
    console.log('1');
}
// 显示语音录制区域
function showVoiceBlock() {
    rc.clear();
    voiceKeyBoardFlag.value = !voiceKeyBoardFlag.value;
}
// type: 1 文本，2：图片，3：语音 content
function handleSendMsg(type: number, content: string) {
    const idx = onlineUserList.value.findIndex(item => item === receiveUserInfo.value._id); // -1不在线

    const commonMsgInfo = {
        sendAccountId: userId.value,
        targetAccountId: receiveUserInfo.value._id,
        chatMessage: type === 1 ? content : '',
        chatImg: type === 2 ? content : '',
        chatTime: new Date(),
        chatVoice: type === 3 ? content : '',
        targetAccountAvatar: receiveUserInfo.value.vuechatAvatar,
        sendAccountAvatar: userStore.userInfo.vuechatAvatar,
        targetAccountName: receiveUserInfo.value.vuechatName,
        sendAccountName: userStore.userInfo.vuechatName
    };
    const sendChatMsgInfo = {
        ...commonMsgInfo,
        sendAccountAndTargetAccountId: userId.value + receiveUserInfo.value._id
    };
    const targetChatMsgInfo = {
        ...commonMsgInfo,
        sendAccountAndTargetAccountId: receiveUserInfo.value._id + userId.value
    };
    const chatInfoArr = [sendChatMsgInfo, targetChatMsgInfo];

    if (idx === -1) {
        socketIo.emit('sendOffLineChatMessage', chatInfoArr);
    } else {
        socketIo.emit('sendChatMessage', chatInfoArr);
    }
}
// 发送聊天信息
async function sendChatMsg(): Promise<void> {
    if (chatMsg.value.trim() === '') {
        showToast('发送不能为空');
    } else {
        const onlineList = (await storage.getItem('vue-chat-userlistId')) as string;
        onlineUserList.value = JSON.parse(onlineList);
        handleSendMsg(1, chatMsg.value);
        chatMsg.value = '';
    }
}
// 发送图片
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function uploadImg(file: any) {
    fileList.value = [];
    handleSendMsg(2, file.content);
}

function scrollToButtom() {
    nextTick(() => {
        const chatboxContainer = chatboxRef.value; // 获取对象
        if (chatboxContainer) {
            document.body.scrollTop = chatboxContainer.scrollHeight; // 滚动高度
            document.documentElement.scrollTop = chatboxContainer.scrollHeight;
        }
    });
}
function handleGoMore() {
    const id = targetId === userStore.userId ? sendId : targetId;

    router.push(`/chatuserInfo/${id}`);
}
function onLoad() {
    handleChatMsg();
}
onMounted(() => {
    userId.value = userStore.userId;
    socketIo.emit('online', userId.value);
    socketIo.on('userlist', msg => {
        storage.setItem('vue-chat-userlistId', JSON.stringify(msg));
    });
    socketIo.on('receiveChatMessage', msg => {
        chatDigtalList.value.push(msg);
        scrollToButtom();
    });
    socketIo.on('receiveOffLineChatMessage', msg => {
        chatDigtalList.value.push(msg);
        scrollToButtom();
    });

    handleChatMsg();
    scrollToButtom();
});
</script>

<style lang="scss" scoped>
@import '@/scss/chat-page';
.chat-page {
    width: 100%;
    min-height: 100vh;
    background-color: #f5f5f5;
    overflow-x: hidden;
    overflow-y: scroll;
}
.chat-content {
    padding: 10px;
    margin-top: 50px;
    margin-bottom: 50px;
    span {
        font-size: 14px;
        word-break: break-all;
    }
}
.send-box {
    position: fixed;
    z-index: 999;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    padding: 6px;
    background: #ddd;
    .voice-box {
        display: flex;
        align-items: center;
    }
    .input-box {
        margin-right: 6px;
        margin-left: 10px;
        .vue-input {
            width: 270px;
            padding: 6px;
        }
        .voice-btn {
            width: 270px;
            height: 36px;
            // padding: 6px;
        }
    }
    .other-box {
        display: flex;
        align-items: center;
    }
}
.facelist {
    position: fixed;
    bottom: 48px;
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    padding: 10px;
    background: #fff;
}
.chat-voice {
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0;
    color: #222;
    font-size: 14px;
    text-align: left;
}
</style>
