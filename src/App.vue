<template>
    <div>
        <router-view v-slot:default="{Component}">
            <keep-alive>
                <component
                    :is="Component"
                    v-if="$route.meta.keepAlive"
                    :key="$route.name"
                />
            </keep-alive>
            <component
                :is="Component"
                v-if="!$route.meta.keepAlive"
                :key="$route.name"
            />
        </router-view>
        <Tabbar
            v-show="route.meta.showTabBar"
            v-model="active"
            route
        >
            <TabbarItem
                icon="home-o"
                to="/"
                replace
            >
                首页
            </TabbarItem>
            <TabbarItem
                icon="friends-o"
                to="/maillist"
                replace
            >
                通讯录
            </TabbarItem>
            <TabbarItem
                icon="browsing-history-o"
                to="/wechatmoments"
                replace
            >
                朋友圈
            </TabbarItem>
            <TabbarItem
                icon="user-o"
                to="/my"
                replace
            >
                我的
            </TabbarItem>
        </Tabbar>
    </div>
</template>

<script setup lang="ts">
import {useRoute} from 'vue-router';
import {onMounted, ref} from 'vue';
import socketIo from '@/common/socketio';
import {useUserStore} from '@/store/index';

import {Tabbar, TabbarItem, showNotify} from 'vant';
const route = useRoute();
const userStore = useUserStore();

const active = ref(0);
onMounted(() => {
    userStore.handleGetUserInfo();
    socketIo.on('receiveChatMessage', msg => {
        if (userStore.userId && msg && msg.targetAccountId === userStore.userId) {
            showNotify({type: 'success', message: `${msg.sendAccountName}发来消息`});
        }
    });
    socketIo.on('receiveOffLineChatMessage', msg => {
        if (userStore.userId && msg && msg.targetAccountId === userStore.userId) {
            showNotify({type: 'success', message: `${msg.sendAccountName}发来消息`});
        }
    });
    socketIo.on('receiveGrounpChatMessage', msg => {
        if (userStore.userId && msg) {
            const isMyChatRoom = userStore.userInfo.chatRooms.findIndex(chatRoomId => chatRoomId === msg.chatRoomId);
            if (isMyChatRoom !== -1 && msg.sendAccountId !== userStore.userId) {
                showNotify({type: 'success', message: `${msg.chatRoomName}发来消息`});
            }
        }
    });
});
</script>
