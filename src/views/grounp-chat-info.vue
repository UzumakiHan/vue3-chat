<template>
    <div
        v-if="chatRoomInfo"
        class="grounp-chat"
    >
        <ChatNavBar
            :title="title"
            :nav-type="2"
            :no-right="true"
        />
        <div class="grounp-chat-info">
            <ul class="account-info">
                <li
                    v-for="(account, index) in chatRoomMember"
                    :key="index"
                    class="vuechat-account-info"
                    @click="handleCheckUserInfo(account)"
                >
                    <img
                        :src="account.vuechatAvatar"
                        class="vuechatavatar"
                    >
                    <p class="vuechatname">
                        {{ account.vuechatName }}
                    </p>
                    <van-icon
                        v-if="cleanFlag"
                        name="clear"
                        class="clean-icon"
                        color="#e01d06"
                        size="20"
                        @click="handleShowCleanDialog(account)"
                    />
                </li>
                <li
                    class="add-account-box"
                    @click="handleAddChatMember"
                >
                    <van-icon
                        name="plus"
                        color=" #969799"
                    />
                </li>
                <li
                    v-if="userStore.userId === chatRoomInfo.chatRoomOwner && chatRoomMember.length > 3"
                    class="add-account-box"
                    @click.stop="handleShowCleanIcon"
                >
                    <van-icon
                        name="minus"
                        color=" #969799"
                    />
                </li>
            </ul>
            <van-cell-group style="margin-top: 10px">
                <van-cell
                    title="群聊名称"
                    is-link
                    :value="chatRoomInfo.chatRoomName"
                    @click="openEditNameDialog"
                />
                <van-cell
                    title="群公告"
                    :label="chatRoomInfo.chatRoomAd"
                    center
                    is-link
                    @click="openEditAdDialog"
                />
            </van-cell-group>
            <van-cell-group style="margin-top: 10px; margin-bottom: 10px">
                <van-cell
                    title="清除聊天记录"
                    is-link
                    @click="handleCleanChatList"
                />
            </van-cell-group>
            <van-button
                type="danger"
                size="large"
                @click="handleDeleteChatGrounp"
            >
                删除并退出
            </van-button>
        </div>

        <ChatDialog
            :show="dialogshow"
            placeholder="请输入群昵称"
            title="更改群昵称"
            @handle-confirm-edit="handleConfirmEdit"
        />
        <ChatDialog
            :show="adDialogshow"
            @handle-confirm-edit="handleConfirmEditAd"
        />
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {showToast, showDialog} from 'vant';
import {
    IAjaxRes,
    IDeleteChatOwner,
    IEditChatRoomAd,
    IEditChatRoomName,
    IRemoveChatMember,
    IUserInfo
} from '@/common/typings';
import {useUserStore} from '@/store/index';
import ChatDialog from '@/components/chat-dialog.vue';
import {
    getChatRoomInfo,
    getChatUserInfo,
    removeChatMember,
    editChatRoomName,
    editChatRoomAd,
    cleanChatList,
    deleteChatOwner
} from '@/common/api';

import ChatNavBar from '@/components/chat-nav-bar.vue';
const userStore = useUserStore();

const route = useRoute();
const router = useRouter();
const {chatRoomId} = route.params;
const title = ref('');
const chatRoomInfo = ref();
const cleanFlag = ref(false);
const chatRoomMember = ref<Array<IUserInfo>>([]);
const dialogshow = ref(false);
const chatRoomName = ref('');
const adDialogshow = ref(false);
// 获取群成员
async function getChatRoomMember() {
    const chatRoomMemberId = chatRoomInfo.value.chatRoomMemberId;
    const memberLength = chatRoomMemberId.length;
    for (let i = 0; i < memberLength; i++) {
        if (chatRoomMemberId[i] === chatRoomInfo.value.chatRoomOwner) {
            chatRoomMemberId.splice(i, 1);
            break;
        }
    }
    chatRoomMemberId.unshift(chatRoomInfo.value.chatRoomOwner);
    chatRoomMemberId.forEach(async (memberId: string) => {
        const result = (await getChatUserInfo(memberId)) as IAjaxRes;
        if (result.status === 2) {
            chatRoomMember.value.push(result.data as IUserInfo);
        }
    });
}
// 获取聊天室信息
async function handleGetChatGrounp() {
    const result = (await getChatRoomInfo(chatRoomId as string)) as IAjaxRes;
    if (result.status === 2) {
        chatRoomInfo.value = result.data;
        title.value = `聊天信息(${chatRoomInfo.value.chatRoomMemberId.length})`;
        chatRoomName.value = chatRoomInfo.value.chatRoomName;
        getChatRoomMember();
    }
}
function handleCheckUserInfo(account: IUserInfo) {
    router.push(`/chatuserInfo/${account._id}`);
}
function handleShowCleanDialog(account: IUserInfo) {
    const removeInfo: IRemoveChatMember = {
        chatRoomId: chatRoomId as string,
        removeChatId: account._id
    };
    showDialog({
        message: '确定移除该用户吗？',
        showCancelButton: true
    })
        .then(async () => {
            const result = (await removeChatMember(removeInfo)) as IAjaxRes;
            showToast(result.message);
            if (result.status === 2) {
                setTimeout(() => {
                    handleGetChatGrounp();
                }, 1000);
            }
        })
        .catch(() => {
            cleanFlag.value = false;
        });
}
function handleAddChatMember() {
    router.push(`/selectchatfriends?chatRoomId=${chatRoomId}`);
}
function handleShowCleanIcon() {
    cleanFlag.value = true;
}
function openEditNameDialog() {
    dialogshow.value = true;
}
function openEditAdDialog() {
    adDialogshow.value = true;
}
async function handleCleanChatList() {
    const sendAccountAndchatRoomId = userStore.userId + chatRoomId;
    showDialog({
        message: '确定删除聊天记录吗？',
        showCancelButton: true
    })
        .then(async () => {
            const result = (await cleanChatList(sendAccountAndchatRoomId)) as IAjaxRes;
            showToast(result.message);
        })
        .catch(() => {
            // on cancel
        });
}
async function handleDeleteChatGrounp() {
    showDialog({
        title: '退出群聊',
        message: `将群组“${chatRoomInfo.value.chatRoomName}”删除，将同时删除与该群组的聊天记录`,
        showCancelButton: true
    })
        .then(async () => {
            if (userStore.userId === chatRoomInfo.value.chatRoomOwner) {
                chatRoomInfo.value.chatRoomMemberId.splice(
                    chatRoomInfo.value.chatRoomMemberId.findIndex((item: string) => item === userStore.userId),
                    1
                );
                const newChatRoomOwner = chatRoomInfo.value.chatRoomMemberId[0];
                const removeInfo: IDeleteChatOwner = {
                    chatRoomId: chatRoomId as string,
                    removeChatId: userStore.userId,
                    newChatRoomOwner: newChatRoomOwner
                };
                const result = (await deleteChatOwner(removeInfo)) as IAjaxRes;
                showToast(result.message);
                if (result.status === 2) {
                    router.push('/mychatgrounp');
                }
            } else {
                const removeInfo: IRemoveChatMember = {
                    chatRoomId: chatRoomId as string,
                    removeChatId: userStore.userId
                };
                const result = (await removeChatMember(removeInfo)) as IAjaxRes;
                showToast(result.message);
                if (result.status === 2) {
                    router.push('/mychatgrounp');
                }
            }
        })
        .catch(() => {
            // on cancel
        });
}
async function handleConfirmEdit(dialogContent: string) {
    if (chatRoomName.value === '') {
        showToast('群昵称不能为空');
        chatRoomName.value = chatRoomInfo.value.chatRoomName;
    } else {
        const editInfo: IEditChatRoomName = {
            id: chatRoomId as string,
            chatRoomName: dialogContent
        };
        const result = (await editChatRoomName(editInfo)) as IAjaxRes;
        if (result.status === 2) {
            showToast(result.message);
            chatRoomInfo.value.chatRoomName = dialogContent;
            dialogshow.value = false;
        }
    }
}
async function handleConfirmEditAd(dialogContent: string) {
    const editAdInfo: IEditChatRoomAd = {
        id: chatRoomId as string,
        chatRoomAd: dialogContent
    };
    const result = (await editChatRoomAd(editAdInfo)) as IAjaxRes;
    if (result.status === 2) {
        showToast(result.message);
        adDialogshow.value = false;
        chatRoomInfo.value.chatRoomAd = dialogContent;
    }
}
onMounted(() => {
    handleGetChatGrounp();
});
</script>

<style lang="scss" scoped>
.grounp-chat {
    &-info {
        margin-top: 46px;
        .account-info {
            display: flex;
            flex-wrap: wrap;
            // width: 100%;
            padding: 10px;
            // height: 300px;
            background-color: #fff;
            list-style: none;
            .vuechat-account-info {
                position: relative;
                display: flex;
                // width: 80px;
                height: 80px;
                // flex: 1;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin: 7px 4px;
                .vuechatavatar {
                    width: 60px;
                    height: 60px;
                    border-radius: 8px;
                }
                .vuechatname {
                    margin-top: 4px;
                    color: #969799;
                    // width: 60;
                    font-size: 14px;
                    text-align: center;
                }
                .clean-icon {
                    position: absolute;
                    top: -10px;
                    right: 0;
                }
            }
            .add-account-box {
                display: flex;
                width: 60px;
                height: 60px;
                align-items: center;
                justify-content: center;
                border: 1px dotted #969799;
                border-radius: 8px;
                margin: 7px 4px;
                // background-color: red;
            }
        }
    }
}
</style>
