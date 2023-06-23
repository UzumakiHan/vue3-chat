<template>
    <div class="mail">
        <ChatNavBar
            title="通讯录"
            :nav-type="1"
            :no-left="true"
        />
        <div style="padding-top: 62px">
            <div v-if="userStore.mailList.length > 0">
                <div
                    v-for="(item, index) in userStore.mailList"
                    :key="index"
                    class="mail-list"
                >
                    <div
                        class="mail-list-info"
                        @click="handleGoUserDetail(item)"
                    >
                        <van-image
                            width="50"
                            height="50"
                            :src="item.vuechatAvatar"
                        />
                        <span class="chat-name">{{ item.vuechatAccount }}</span>
                    </div>
                    <van-divider />
                </div>
            </div>
            <van-empty
                v-else
                description="暂无好友"
            />
            <div class="mail-navbar">
                <div
                    class="mail-navbar-icon"
                    @click="handleAddFriend"
                >
                    <img
                        :src="addIcon"
                        alt=""
                    >
                </div>
                <div
                    class="mail-navbar-icon"
                    @click="handleSearchFriend"
                >
                    <img
                        :src="searchIcon"
                        alt=""
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {useUserStore} from '@/store/index';
import {IUserInfo} from '@/common/typings';
import ChatNavBar from '@/components/chat-nav-bar.vue';
import addIcon from '@/assets/img/add.svg';
import searchIcon from '@/assets/img/search.svg';

const userStore = useUserStore();
const router = useRouter();
onMounted(() => {
    userStore.getMailList();
});
function handleAddFriend() {
    router.push('/searchfriends/1');
}
function handleSearchFriend() {
    router.push('/searchfriends/2');
}
function handleGoUserDetail(userInfo: IUserInfo) {
    router.push(`/chatuserInfo/${userInfo._id}`);
}
</script>

<style lang="scss" scoped>
.mail {
    &-list {
        box-sizing: border-box;
        padding: 0 16px;
        &-info {
            display: flex;
            align-items: center;
            .chat-name {
                margin-left: 10px;
                font-size: 15px;
            }
        }
    }
    &-navbar {
        position: fixed;
        z-index: 88;
        top: 70%;
        right: 20px;
        &-icon {
            display: flex;
            width: 40px;
            height: 40px;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.5);
            img {
                width: 25px;
                height: 25px;
            }
            &:last-child {
                margin-top: 10px;
            }
        }
    }
}
</style>
