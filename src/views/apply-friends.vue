<template>
    <div>
        <ChatNavBar
            title="好友申请"
            :nav-type="navType"
            :no-right="true"
        />
        <van-tabs
            v-model="active"
            style="margin-top: 46px"
        >
            <van-tab title="发出的好友申请">
                <van-empty
                    v-if="sendApplyList.length === 0"
                    description="暂未发出好友申请"
                />
                <ul
                    v-else
                    class="search-list"
                >
                    <li
                        v-for="(item, index) in sendApplyList"
                        :key="index"
                        class="search-item"
                    >
                        <van-image
                            width="60"
                            height="60"
                            :src="item.vuechatAvatar"
                        />
                        <div class="userinfo">
                            <p>
                                <span>vuechat号：</span>
                                <span>{{ item.vuechatAccount }}</span>
                            </p>
                            <p>
                                <span>vuechat昵称：</span>
                                <span>{{ item.vuechatName }}</span>
                            </p>
                        </div>
                        <div class="apply-btn">
                            <van-button
                                type="primary"
                                size="mini"
                            >
                                申请中
                            </van-button>
                        </div>
                    </li>
                </ul>
            </van-tab>
            <van-tab title="收到的好友申请">
                <van-empty
                    v-if="recieveApplyList.length === 0"
                    description="暂未收到好友申请"
                />
                <ul
                    v-else
                    class="search-list"
                >
                    <li
                        v-for="(item, index) in recieveApplyList"
                        :key="index"
                        class="search-item"
                    >
                        <van-image
                            width="60"
                            height="60"
                            :src="item.vuechatAvatar"
                        />
                        <div class="userinfo">
                            <p>
                                <span>vuechat号：</span>
                                <span>{{ item.vuechatAccount }}</span>
                            </p>
                            <p>
                                <span>vuechat昵称：</span>
                                <span>{{ item.vuechatName }}</span>
                            </p>
                        </div>
                        <div class="apply-btn">
                            <van-button
                                type="primary"
                                size="mini"
                                @click="applyVueChat(item)"
                            >
                                接受申请
                            </van-button>
                        </div>
                    </li>
                </ul>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import {showToast} from 'vant';
import ChatNavBar from '@/components/chat-nav-bar.vue';
import {useUserStore} from '@/store/user';
import {getUserInfo} from '@/common/api';
import {IUserInfo, IAjaxRes} from '@/typings';
import socketIo from '@/common/socketio';
const router = useRouter();
const userStore = useUserStore();
const sendApplyList = ref<Array<IUserInfo>>([]);
const recieveApplyList = ref<Array<IUserInfo>>([]);
const userId = ref('');
const active = ref(0);
const navType = ref(2);
function handleFriendsList() {
    const userInfo: IUserInfo = userStore.userInfo;
    userId.value = userStore.userId;
    userInfo.myApplyVuechatFriendsList.forEach(async (item: string) => {
        const userInfoRes = (await getUserInfo(item)) as IAjaxRes;
        const applyUserList = userInfoRes.data as IUserInfo;
        sendApplyList.value.push(applyUserList);
    });
    userInfo.applyVuechatFriendsList.forEach(async (item: string) => {
        const userInfoRes = (await getUserInfo(item)) as IAjaxRes;
        const recieveUserList = userInfoRes.data as IUserInfo;
        recieveApplyList.value.push(recieveUserList);
    });
}
// 接受好友的申请
function applyVueChat(applyinfo: IUserInfo) {
    const recieveApplyData = {
        applyUserInfoId: applyinfo._id,
        recieveUserInfoId: userId.value
    };
    socketIo.emit('recieveAddMessage', recieveApplyData);
    socketIo.on('sendMyAddMessage', msg => {
        showToast(msg.message);
        if (msg.status !== 1) {
            router.push('/');
        }
    });
}
onMounted(() => {
    userStore.handleGetUserInfo();
    setTimeout(() => {
        handleFriendsList();
    }, 500);
});
</script>

<style lang="scss" scoped>
.search-list {
    margin-top: 10px;
    background: #fff;
    .search-item {
        position: relative;
        display: flex;
        align-items: center;
        padding: 8px 6px 8px 6px;
        border-bottom: 1px solid #eee;
        &:last-of-type {
            border: none;
        }
        .userinfo {
            margin-left: 10px;
            span {
                font-size: 15px;
            }
        }
        .apply-btn {
            position: absolute;
            right: 10px;
        }
    }
}
</style>
