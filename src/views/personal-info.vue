<template>
    <div
        v-if="userInfo"
        class="personal"
    >
        <ChatNavBar
            v-if="isMySelf"
            :title="userInfo.vuechatName"
            :nav-type="2"
            :icon-name="iconName"
            :has-right="true"
            :is-save="isEdit"
            @handle-click-right="handleEdit"
            @handle-save="handleSave"
        />
        <ChatNavBar
            v-else
            :title="userInfo.vuechatName"
            :nav-type="2"
        />
        <div class="personal-box">
            <van-row
                type="flex"
                justify="center"
                style="margin-top: 10px; margin-bottom: 10px"
            >
                <van-col>
                    <van-image
                        round
                        width="100px"
                        height="100px"
                        :src="userInfo.vuechatAvatar"
                    />
                </van-col>
            </van-row>
            <van-row
                v-if="isEdit"
                type="flex"
                justify="center"
                style="margin-bottom: 10px"
            >
                <van-uploader
                    :after-read="handleAfterRead"
                    :max-count="1"
                >
                    <van-button
                        icon="photo-o"
                        type="primary"
                        size="mini"
                    >
                        更改头像
                    </van-button>
                </van-uploader>
            </van-row>
            <van-cell-group>
                <van-field
                    v-model="userInfo.vuechatAccount"
                    label="用户账号"
                    :left-icon="accountIcon"
                    disabled
                />
                <van-field
                    v-model="userInfo.vuechatName"
                    label="用户名"
                    :left-icon="userIcon"
                    :disabled="!isEdit"
                />
                <van-field
                    v-model="userInfo.sex"
                    label="性别"
                    :left-icon="sexIcon"
                    :disabled="!isEdit"
                />
                <van-field
                    v-model="userInfo.phone"
                    label="手机号码"
                    :left-icon="phoneIcon"
                    :disabled="!isEdit"
                />
                <van-field
                    v-model="userInfo.brithday"
                    label="生日"
                    :left-icon="brithdayIcon"
                    :disabled="!isEdit"
                />
                <van-field
                    v-model="userInfo.address"
                    label="地址"
                    :left-icon="addressIcon"
                    :disabled="!isEdit"
                />
                <van-field
                    v-model="userInfo.personalSign"
                    rows="1"
                    autosize
                    label="个人签名"
                    type="textarea"
                    :left-icon="signIcon"
                    :disabled="!isEdit"
                />
            </van-cell-group>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted, defineAsyncComponent} from 'vue';

import axios from 'axios';
import {showToast, showLoadingToast, closeToast} from 'vant';
import {useUserStore} from '@/store/index';
import usePersonal from '@/hooks/use-personal';

import accountIcon from '@/assets/img/account.png';
import userIcon from '@/assets/img/user.png';
import sexIcon from '@/assets/img/sex.png';
import phoneIcon from '@/assets/img/phone.png';
import brithdayIcon from '@/assets/img/brithday.png';
import addressIcon from '@/assets/img/address.png';
import signIcon from '@/assets/img/sign.png';
const ChatNavBar = defineAsyncComponent(() => import('@/components/chat-nav-bar.vue'));

const {isMySelf, userInfo, isEdit, iconName, handleOtherUserInfo, handleEdit} = usePersonal();

const userStore = useUserStore();

const base64Avatar = ref('');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleAfterRead(file: any) {
    base64Avatar.value = file.content;
    userInfo.value.vuechatAvatar = file.content;
}
function handleSave() {
    const formData = new FormData();
    if (base64Avatar.value) {
        formData.append('vuechatAvatar', base64Avatar.value);
    } else {
        formData.append('vuechatAvatar', userInfo.value.vuechatAvatar);
    }
    formData.append('vuechatName', userInfo.value.vuechatName);
    formData.append('sex', userInfo.value.sex);
    formData.append('phone', userInfo.value.phone);
    formData.append('brithday', userInfo.value.brithday);
    formData.append('address', userInfo.value.address);
    formData.append('personalSign', userInfo.value.personalSign);
    formData.append('userid', userStore.userId);
    const headers = {
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'multipart/form-data'
        }
    };
    showLoadingToast({
        forbidClick: true,
        duration: 0,
        overlay: true
    });
    const editVueChatInfoApi =
        import.meta.env.MODE === 'development' ? '/api/user/editVueChatInfo' : '/user/editVueChatInfo';

    axios
        .post(editVueChatInfoApi, formData, headers)
        .then(res => {
            closeToast();
            if (res.data.status === 2) {
                showToast(res.data.message);
                userStore.handleGetUserInfo();
                isEdit.value = false;
                iconName.value = isEdit.value ? 'cross' : 'edit';
            } else {
                showToast(res.data.message);
            }
        })
        .catch(err => {
            throw Error(err);
        });
}

onMounted(() => {
    handleOtherUserInfo();
});
</script>

<style lang="scss" scoped>
.personal {
    &-box {
        padding-top: 50px;
    }
}
</style>
