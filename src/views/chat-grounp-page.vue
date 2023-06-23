<template>
    <div
        v-if="chatRoomInfo"
        class="chat-page"
    >
        <ChatNavBar
            :title="chatRoomInfo.chatRoomName"
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
                v-if="chatGrounpDigtalList.length > 0"
                v-model="flowLoading"
                :finished="flowFinished"
                :error="flowError"
                pullup-tips-bg="transparent"
                :show-pullup-tips="false"
                @load="onLoad"
            >
                <template v-for="(chatAccountItem, chatAccountIndex) in chatGrounpDigtalList">
                    <ChatContent
                        v-if="chatAccountItem.sendAccountId === userId"
                        :key="chatAccountIndex"
                        :user-name="chatAccountItem.sendAccountName"
                        :chat-message="chatAccountItem.chatMessage"
                        :chat-voice-url="chatAccountItem.chatVoice.chatVoiceUrl"
                        :chat-voice-time="chatAccountItem.chatVoice.chatVoiceTime"
                        :chat-time="chatAccountItem.chatTime"
                    >
                        <template v-slot:useravatar>
                            <img
                                :src="chatAccountItem.sendAccountAvatar"
                                @click="handleGoUser(chatAccountItem.sendAccountId)"
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

                    <ChatContent
                        v-else
                        :key="'info2-' + chatAccountIndex"
                        :user-name="chatAccountItem.sendAccountName"
                        :chat-message="chatAccountItem.chatMessage"
                        :chat-voice-url="chatAccountItem.chatVoice.chatVoiceUrl"
                        :chat-voice-time="chatAccountItem.chatVoice.chatVoiceTime"
                        :chat-time="chatAccountItem.chatTime"
                        :is-right="false"
                    >
                        <template v-slot:useravatar>
                            <img
                                :src="chatAccountItem.sendAccountAvatar"
                                @click="handleGoUser(chatAccountItem.sendAccountId)"
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
import {useUserStore} from '@/store/index';
import {getChatRoomInfo, getGroupChatList} from '@/common/api';
import socketIo from '@/common/socketio';

import {IAjaxRes, IChatRoomDialogList, IGetGroupChatList} from '@/common/typings';
import ChatNavBar from '@/components/chat-nav-bar.vue';
import FaceComp from '@/components/face-comp.vue';
import ChatContent from '@/components/chat-content.vue';

import voiceIcon from '@/assets/img/voice-circle.png';
import keyboardIcon from '@/assets/img/keyboard.png';
import recordvoiceIcon from '@/assets/img/voice.png';
import sendvoiceIcon from '@/assets/img/send.png';

const rc = new Recorderx();
const flowLoading = ref(false);
const flowFinished = ref(false);
const flowError = ref(false);
const page = ref(1);
const pageSize = 10;
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const {chatRoomId} = route.params;
const navType = ref(2);
const userId = ref('');
const faceShow = ref(false);
const voiceKeyBoardFlag = ref(true);
const fileList = ref([]);
const chatMsg = ref('');
const sendinputRef = ref<HTMLElement>();
// 聊天者信息
const chatboxRef = ref<HTMLElement>();
const faceBoxRef = ref<HTMLElement>();
const momentText = ref('');
const chatRoomInfo = ref();
const chatGrounpDigtalList = ref<Array<IChatRoomDialogList>>([]);
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
// 获取所有表情
function faceContent() {
    faceShow.value = !faceShow.value;

    sendinputRef.value?.focus();
}
function handleGoMore() {
    router.push(`/grounpchatinfo/${chatRoomId}`);
}

// 录制语音
function recordingVoice() {
    console.log('1');
}
// 发送语音
function sendVoice() {
    console.log('2');
}
// 显示语音录制区域
function showVoiceBlock() {
    rc.clear();
    voiceKeyBoardFlag.value = !voiceKeyBoardFlag.value;
}
// type: 1 文本，2：图片，3：语音 content
function handleSendMsg(type: number, content: string) {
    const commonMsgInfo = {
        chatRoomName: chatRoomInfo.value.chatRoomName,
        chatRoomImg: chatRoomInfo.value.chatRoomImg,
        chatRoomId: chatRoomId,
        chatMessage: type === 1 ? content : '',
        chatImg: type === 2 ? content : '',
        chatTime: new Date(),
        chatVoice: type === 3 ? content : '',
        sendAccountAvatar: userStore.userInfo.vuechatAvatar,
        sendAccountName: userStore.userInfo.vuechatAccount,
        sendAccountId: userStore.userId,

        chatRoomMemberId: chatRoomInfo.value.chatRoomMemberId
    };

    socketIo.emit('sendGrounpChatMessage', commonMsgInfo);
}
// 发送聊天信息
async function sendChatMsg(): Promise<void> {
    if (chatMsg.value.trim() === '') {
        showToast('发送不能为空');
    } else {
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

// 获取聊天室信息
async function handleGetChatGrounp() {
    const result = (await getChatRoomInfo(chatRoomId as string)) as IAjaxRes;
    if (result.status === 2) {
        chatRoomInfo.value = result.data;
    }
}
async function handleGetGroupChatList() {
    flowLoading.value = true;

    const grounpId = (userStore.userId + chatRoomId) as string;
    const chatGrounp: IGetGroupChatList = {
        sendAccountAndchatRoomId: grounpId,
        page: page.value,
        pageSize
    };

    const result = (await getGroupChatList(chatGrounp)) as IAjaxRes;
    flowLoading.value = false;
    if (result.status === 2) {
        const list = result.data?.groupChatList as Array<IChatRoomDialogList>;
        if (list?.length === 0) {
            flowFinished.value = true;
            return;
        }
        if (list.length > 0) {
            chatGrounpDigtalList.value = chatGrounpDigtalList.value.concat(list);
            flowFinished.value = false;
            page.value += 1;
        }
    }
}
function onLoad() {
    handleGetGroupChatList();
}
function handleGoUser(id: string) {
    router.push(`/chatuserInfo/${id}`);
}
onMounted(() => {
    userId.value = userStore.userId;
    if (chatRoomId) {
        handleGetChatGrounp();
        socketIo.on('receiveGrounpChatMessage', msg => {
            if (chatRoomId === msg.chatRoomId) {
                chatGrounpDigtalList.value.push(msg);
                scrollToButtom();
            }
        });
        handleGetGroupChatList();
    }
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
