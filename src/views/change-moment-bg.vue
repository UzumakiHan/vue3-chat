<template>
    <div class="change">
        <ChatNavBar
            title="更改背景"
            :nav-type="2"
            :no-right="true"
        />
        <div class="upload-container">
            <van-uploader
                v-model="fileList"
                :after-read="handleAfterRead"
                :max-count="1"
                :before-delete="handleBeforeDelete"
            />
            <van-button
                type="primary"
                style="width: 150px; margin-top: 30px"
                :disabled="isChange"
                @click="handleChangeMomentBg"
            >
                更改
            </van-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import axios from 'axios';
// import{UploaderFileListItem} from 'vant'
import {useRouter} from 'vue-router';
import {showToast, showLoadingToast, closeToast} from 'vant';
import {useUserStore} from '@/store/index';

import ChatNavBar from '@/components/chat-nav-bar.vue';

const router = useRouter();
const fileList = ref([]);
const base64Bg = ref();
const isChange = ref(true);
const userStore = useUserStore();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleAfterRead = (file: any) => {
    base64Bg.value = file.content;
    isChange.value = false;
};

function handleBeforeDelete() {
    fileList.value = [];
    isChange.value = true;
}
function handleChangeMomentBg() {
    const formData = new FormData();
    formData.append('wechatMomentBg', base64Bg.value);
    formData.append('userid', userStore.userId);

    const headers = {
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'multipart/form-data'
        }
    };
    const changeMomentBgApi =
        import.meta.env.MODE === 'development' ? '/api/user/changeMomentBg' : '/user/changeMomentBg';
    showLoadingToast({
        forbidClick: true,
        duration: 0,
        overlay: true
    });
    axios
        .post(changeMomentBgApi, formData, headers)
        .then(res => {
            closeToast();
            if (res.data.status === 2) {
                showToast(res.data.message);
                router.replace('/wechatmoments');
            } else {
                showToast(res.data.message);
            }
        })
        .catch(err => {
            throw Error(err);
        });
}
</script>

<style lang="scss" scoped>
.change {
    min-height: 100vh;
    background: #f5f5f5;
    .upload-container {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-top: 100px;
    }
    .van-uploader__upload {
        width: 150px;
        height: 150px;
        background-color: #d0dfe6;
    }
    .van-uploader__upload-icon {
        color: #79bedb;
        font-size: 30px;
    }
    .van-uploader__preview-image {
        width: 150px;
        height: 150px;
    }
}
</style>
