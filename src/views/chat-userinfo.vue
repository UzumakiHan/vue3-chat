<template>
    <div
        v-if="userInfo"
        class="user"
    >
        <ChatNavBar
            :title="userInfo.vuechatName"
            :nav-type="2"
        />
        <div class="user-page">
            <van-image
                width="60"
                height="60"
                :src="userInfo.vuechatAvatar"
                @click="handlePreviewImg(userInfo.vuechatAvatar)"
            />
            <div class="chat-info">
                <p class="chat-title">
                    <span style="margin-right: 5px; font-weight: bold">{{ userInfo.vuechatName }}</span>
                    <van-icon
                        v-if="userInfo.sex === '男'"
                        :name="maleLogo"
                    />
                    <van-icon
                        v-else
                        :name="femaleLogo"
                    />
                </p>
                <p class="chat-content">
                    <span>vuechat号：</span>
                    <span>{{ userInfo.vuechatAccount }}</span>
                </p>
                <p class="chat-content">
                    <span>地区：</span>
                    <span>{{ userInfo.address }}</span>
                </p>
            </div>
            <i
                data-v-15c04174
                class="van-icon van-icon-arrow van-cell__right-icon"
                @click="hanleCheckuserInfo(userInfo)"
            >
                <!---->
            </i>
        </div>
        <div class="function-list">
            <div
                class="wechat-moment"
                @click="goWechatMoment(userInfo)"
            >
                <span>朋友圈</span>
                <div class="recent-moment">
                    <van-image
                        v-for="(baseimg, imgIndex) in imgShowList"
                        :key="imgIndex"
                        width="60"
                        height="60"
                        :src="baseimg"
                        style="margin-right: 6px"
                    />
                </div>
                <i
                    data-v-15c04174
                    class="van-icon van-icon-arrow van-cell__right-icon arrow-icon"
                >
                    <!---->
                </i>
            </div>
        </div>
        <div
            v-if="judgeKey && userId !== userStore.userId"
            class="send-message-div"
            @click="handleSendMessage"
        >
            <van-icon name="chat-o" />
            <span>发消息</span>
        </div>
        <div
            v-if="!judgeKey && userId !== userStore.userId"
            class="send-message-div"
            @click="handleSendApply"
        >
            <van-icon :name="addIcon" />
            <span>添加好友</span>
        </div>
        <div
            v-if="judgeKey && userId !== userStore.userId"
            class="send-message-div"
            @click="handleDelFriend"
        >
            <van-icon :name="delIcon" />
            <span>删除好友</span>
        </div>
        <div
            v-if="judgeKey && userId !== userStore.userId"
            class="send-message-div"
            @click="handleCleanMessage"
        >
            <van-icon name="delete-o" />
            <span class="send-message-div-span">删除聊天记录</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, defineAsyncComponent} from 'vue';
import {showToast} from 'vant';
import {useRouter} from 'vue-router';

import socketIo from '@/common/socketio';
import {handlePreviewImg} from '@/common/util';
import {useUserStore} from '@/store/index';
import useChatInfo from '@/hooks/use-chat-info';
import maleLogo from '@/assets/img/male.png';
import femaleLogo from '@/assets/img/female.png';
import addIcon from '@/assets/img/add-icon.png';
import delIcon from '@/assets/img/del-icon.png';
const ChatNavBar = defineAsyncComponent(() => import('@/components/chat-nav-bar.vue'));
const {
    userInfo,
    judgeKey,
    userId,
    imgShowList,
    handleGetuserInfo,
    handleCleanMessage,
    handleJudgeMyFriends,
    handleDelFriend,
    handleGetImgShowList,
    hanleCheckuserInfo,
    goWechatMoment
} = useChatInfo();
const userStore = useUserStore();
const router = useRouter();

function handleSendMessage() {
    const targetId = userId;
    const sendId = userStore.userId;
    router.push(`/chatpage/${targetId}/${sendId}`);
}
function handleCommonApply() {
    const sendApplyData = {
        applyUserInfoId: userStore.userId,
        recieveUserInfoId: userId
    };
    socketIo.emit('sendApplyMessage', sendApplyData);
    socketIo.on('receiveApplyMessage', msg => {
        showToast(msg.message);
        if (msg.status !== 1) {
            userStore.handleGetUserInfo();
            handleJudgeMyFriends();
        }
    });
}
function handleSendApply() {
    const vuechatUserInfo: Array<string> = userStore.userInfo.myApplyVuechatFriendsList;
    if (vuechatUserInfo.length > 0) {
        vuechatUserInfo.forEach(item => {
            if (item === userId) {
                showToast('好友已申请中，切勿重复发起申请。');
            } else {
                handleCommonApply();
            }
        });
    } else {
        handleCommonApply();
    }
}

onMounted(() => {
    userStore.handleGetUserInfo();
    setTimeout(() => {
        handleGetuserInfo();
        handleGetImgShowList();
    }, 200);
});
</script>

<style lang="scss" scoped>
.user {
    min-height: 100vh;
    background-color: #f5f5f5;
    &-page {
        display: flex;
        align-items: center;
        padding: 10px 8px;
        margin-top: 46px;
        background: #fff;
        .chat-info {
            //   height:40px;
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
    }
}
.function-list {
    padding: 10px 8px;
    margin-top: 10px;
    background: #fff;
    .wechat-moment {
        position: relative;
        display: flex;
        align-items: center;
        padding: 6px 0;
        // border-bottom: 1px solid #eee;
        margin-bottom: 6px;
        span {
            font-size: 16px;
        }
        .recent-moment {
            width: 70%;
            margin-left: 10px;
        }
        .arrow-icon {
            position: absolute;
            right: 0;
        }
    }
}
.send-message-div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 8px;
    margin-top: 10px;
    background: #fff;
    &-span {
        margin-left: 5px;
        color: #3485fb;
        font-size: 15px;
    }
}
</style>
