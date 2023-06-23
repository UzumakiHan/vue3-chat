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
import {ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import axios from 'axios';
import {showToast, showLoadingToast, closeToast} from 'vant';
import {useUserStore} from '@/store/user';
import {IAjaxRes} from '@/typings';
import {getUserInfo} from '@/common/api';
import ChatNavBar from '@/components/chat-nav-bar.vue';
import accountIcon from '@/assets/image/account.png';
import userIcon from '@/assets/image/user.png';
import sexIcon from '@/assets/image/sex.png';
import phoneIcon from '@/assets/image/phone.png';
import brithdayIcon from '@/assets/image/brithday.png';
import addressIcon from '@/assets/image/address.png';
import signIcon from '@/assets/image/sign.png';

const route = useRoute();
const userStore = useUserStore();
const otherUserInfo = ref();
const {id} = route.params;
const isMySelf = ref(id === userStore.userId);
const iconName = ref('edit');

const userInfo = ref({
    vuechatAccount: '',
    vuechatAvatar: '',
    vuechatName: '',
    sex: '',
    phone: '',
    brithday: '',
    address: '',
    personalSign: ''
});
const isEdit = ref(false);

const base64Avatar = ref('');
function handleEdit() {
    isEdit.value = !isEdit.value;
    iconName.value = isEdit.value ? 'cross' : 'edit';
    if (isEdit.value) {
        const {vuechatAccount, vuechatAvatar, vuechatName, sex, phone, brithday, address, personalSign} = isMySelf.value
            ? userStore.userInfo
            : otherUserInfo.value;
        userInfo.value = {
            vuechatAccount,
            vuechatAvatar,
            vuechatName,
            sex,
            phone,
            brithday,
            address,
            personalSign
        };
    }
}
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
        process.env.NODE_ENV === 'development' ? '/api/user/editVueChatInfo' : '/user/editVueChatInfo';

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
async function handleOtherUserInfo() {
    if (!isMySelf.value) {
        const otherUserInfoRes = (await getUserInfo(id as string)) as IAjaxRes;
        otherUserInfo.value = otherUserInfoRes.data;
        const {vuechatAccount, vuechatAvatar, vuechatName, sex, phone, brithday, address, personalSign} =
            otherUserInfo.value;
        userInfo.value = {
            vuechatAccount,
            vuechatAvatar,
            vuechatName,
            sex,
            phone,
            brithday,
            address,
            personalSign
        };
    } else {
        const {vuechatAccount, vuechatAvatar, vuechatName, sex, phone, brithday, address, personalSign} =
            userStore.userInfo;
        userInfo.value = {
            vuechatAccount,
            vuechatAvatar,
            vuechatName,
            sex,
            phone,
            brithday,
            address,
            personalSign
        };
    }
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
