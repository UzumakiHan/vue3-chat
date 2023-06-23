<template>
    <div class="search">
        <ChatNavBar
            :title="title"
            :nav-type="navType"
        />
        <div>
            <div class="search-box">
                <van-field
                    v-model="searchVal"
                    left-icon="search"
                    :placeholder="placeholderText"
                    style="flex: 1"
                />
                <van-button
                    type="primary"
                    size="mini"
                    @click="handleSearchFriends"
                >
                    查找
                </van-button>
            </div>
        </div>
        <ul
            v-if="searchList.length > 0"
            class="search-list"
        >
            <li
                v-for="(item, index) in searchList"
                :key="index"
                class="search-list-item"
                @click="goToUserDetail(item)"
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
            </li>
        </ul>
        <van-empty
            v-else
            description="空空如也"
        />
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {searchVueChatAccount, searchMyFriend} from '@/common/api';
import {showToast} from 'vant';
import {IUserInfo, IAjaxRes} from '@/common/typings';
import {useUserStore} from '@/store/index';
import ChatNavBar from '@/components/chat-nav-bar.vue';
const userStore = useUserStore();
const navType = ref(2);
const route = useRoute();
const router = useRouter();
const searchKey = Number(route.params.searchKey);
const title = searchKey === 1 ? '添加好友' : '搜索好友';
const placeholderText = searchKey === 1 ? '请输入vuechat号添加' : '请输入vuechat号搜索';
const searchVal = ref('');
const searchList = ref<Array<IUserInfo>>([]);

async function handleSearchFriends() {
    searchList.value = [];
    if (searchKey === 1) {
        const userInfo = {
            vuechatAccount: searchVal.value
        };
        const result = (await searchVueChatAccount(userInfo)) as IAjaxRes;

        showToast(result.message);
        if (result.status === 2) {
            const listInfo = result.data as IUserInfo;
            searchList.value.push(listInfo);
        }
    } else {
        const userInfo = {
            vuechatAccount: searchVal.value,
            id: userStore.userId
        };
        const result = (await searchMyFriend(userInfo)) as IAjaxRes;

        if (result.status === 2) {
            const listInfo = result.data as IUserInfo;
            searchList.value.push(listInfo);
        }
    }
}
function goToUserDetail(userInfo: IUserInfo) {
    router.push(`/chatuserInfo/${userInfo._id}`);
}
onMounted(() => {
    userStore.handleGetUserInfo();
});
</script>

<style lang="scss" scoped>
.search {
    &-box {
        display: flex;
        align-items: center;
        padding-right: 10px;
        margin-top: 46px;
        background: #fff;
    }
    &-list {
        margin-top: 10px;
        background: #fff;
        &-item {
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
        }
    }
}
</style>
