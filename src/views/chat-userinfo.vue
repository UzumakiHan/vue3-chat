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
                @click="handlePpreviewImg(userInfo.vuechatAvatar)"
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
import {onMounted, ref} from 'vue';
import {showToast, showImagePreview, showDialog} from 'vant';
import {useRoute, useRouter} from 'vue-router';
import {IUserInfo, IWechatMoment, IAjaxRes, IDelMyFriend, IGetMyWechatMoments} from '@/common/typings';
import socketIo from '@/common/socketio';

import {useUserStore} from '@/store/index';
import {delMyFriend, cleanDigtalChatMessage, getMyWechatMoments, getUserInfo} from '@/common/api';
import ChatNavBar from '@/components/chat-nav-bar.vue';
import maleLogo from '@/assets/img/male.png';
import femaleLogo from '@/assets/img/female.png';
import addIcon from '@/assets/img/add-icon.png';
import delIcon from '@/assets/img/del-icon.png';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const userId = route.params.id as string;
const userInfo = ref();
const imgShowList = ref<Array<string>>([]);
const judgeKey = ref(false);
// 判断当前用户是否为 好友
function handleJudgeMyFriends() {
    const friendsList: Array<string> = userStore.userInfo.friendsList;
    if (friendsList.length > 0) {
        friendsList.forEach(item => {
            if (item === userId) {
                judgeKey.value = true;
            }
        });
    }
}
async function handleGetuserInfo() {
    const result = (await getUserInfo(userId)) as IAjaxRes;
    if (result.status === 2) {
        const userRes = result.data as IUserInfo;
        userInfo.value = userRes;
        handleJudgeMyFriends();
    }
}
function handlePpreviewImg(avatar: string) {
    const avatarArr = [];
    avatarArr.push(avatar);
    showImagePreview(avatarArr);
}
function hanleCheckuserInfo(currentUser: IUserInfo) {
    router.push(`/personalinfo/${currentUser._id}`);
}
function goWechatMoment(currentUser: IUserInfo) {
    router.push(`/wechatmoments?userId=${currentUser._id}`);
}
// 获取朋友圈照片
async function handleGetImgShowList() {
    const getInfo: IGetMyWechatMoments = {
        id: userId,
        pageSize: 3,
        page: 1
    };
    const result = (await getMyWechatMoments(getInfo)) as IAjaxRes;
    const userWechatmoment = result.data?.list;
    if (!userWechatmoment) {
        return;
    }
    const wechatMomentList = userWechatmoment.reverse();
    const imglist: Array<string> = [];
    wechatMomentList.forEach((item: IWechatMoment) => {
        item.base64ImgList.forEach((base64Img: string) => {
            imglist.push(base64Img);
        });
    });

    imgShowList.value = imglist.slice(0, 3);
}

function handleSendMessage() {
    const targetId = userId;
    const targetName = userInfo.value.vuechatName;
    router.push(`/chatpage/${targetId}/${targetName}`);
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
function handleDelFriend() {
    const delInfo: IDelMyFriend = {
        delId: userId,
        myId: userStore.userId
    };
    showDialog({
        showCancelButton: true,
        title: '删除联系人',
        message: `将联系人“${userInfo.value.vuechatName}”删除，将同时删除与该联系人的聊天记录`
    }).then(async () => {
        const result = (await delMyFriend(delInfo)) as IAjaxRes;
        showToast(result.message);
        if (result.status === 2) {
            router.push('/maillist');
        }
    });
}
function handleCleanMessage() {
    showDialog({
        showCancelButton: true,
        title: '删除聊天记录',
        message: `将联系人“${userInfo.value.vuechatName}”的聊天记录删除`
    }).then(async () => {
        const delId = userStore.userId + userId;

        const result = (await cleanDigtalChatMessage(delId)) as IAjaxRes;
        showToast(result.message);
    });
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
