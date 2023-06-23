<template>
    <div class="publish">
        <ChatNavBar
            title="发表朋友圈"
            :nav-type="2"
            :has-right="true"
            icon-name="guide-o"
            @handle-click-right="handlePlubish"
        />
        <div style="padding-top: 50px">
            <div class="edit-box">
                <van-field
                    ref="textareaRef"
                    v-model="momentText"
                    rows="6"
                    autosize
                    type="textarea"
                    placeholder="这一刻的想法....."
                />
                <div class="face-box">
                    <van-icon
                        name="smile-o"
                        style="margin-right: 5px"
                        size="24"
                        @click.stop="faceShow = !faceShow"
                    />
                    <FaceComp
                        v-show="faceShow"
                        ref="faceBoxRef"
                        @handle-get-current-face="handleGetCurrentFace"
                    />
                </div>
                <div class="upload-box">
                    <van-uploader
                        v-model="imgList"
                        multiple
                        :max-count="2"
                    />
                </div>
            </div>
            <div
                class="local-box"
                @click="handleGoMap"
            >
                <div class="local-box-left">
                    <van-icon
                        name="location-o"
                        size="18"
                    />
                    <span class="custom-title">{{ userStore.adress || '所在位置' }}</span>
                </div>
                <div class="local-box-right">
                    <van-icon
                        name="arrow"
                        size="18"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onActivated} from 'vue';
import {useRouter} from 'vue-router';
import {onClickOutside} from '@vueuse/core';

import axios from 'axios';
import {showLoadingToast, closeToast, showToast} from 'vant';
import {useUserStore} from '@/store/user';
import {IFileObject} from '@/typings';

import ChatNavBar from '@/components/chat-nav-bar.vue';
import FaceComp from '@/components/face-comp.vue';

const userStore = useUserStore();
const router = useRouter();
const momentText = ref('');
const imgList = ref<Array<IFileObject>>([]);
const base64ImgList = ref<Array<string>>([]);
const location = ref('');
const latitudeAndlongitude = ref('');

const faceShow = ref(false);

const faceBoxRef = ref<HTMLElement>();

onClickOutside(faceBoxRef, () => {
    faceShow.value = false;
});
function handleGetCurrentFace(faceContent: string) {
    momentText.value += faceContent;
}

function handleGoMap() {
    router.push('/maplocation');
}

function handlePlubish() {
    const formData = new FormData();
    imgList.value.forEach((item, index) => {
        base64ImgList.value.push(item.content);
        formData.append(`base64ImgList${index}`, item.content);
    });
    formData.append('vueChatId', userStore.userId);
    formData.append('momentText', momentText.value);
    formData.append('momentTime', new Date().toISOString());
    formData.append('base64ImgListLength', String(base64ImgList.value.length));
    formData.append('location', userStore.adress);
    formData.append('latitudeAndlongitude', JSON.stringify(latitudeAndlongitude.value));
    formData.append('userInfo', JSON.stringify(userStore.userInfo));
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
    const publicMomentApi =
        process.env.NODE_ENV === 'development' ? '/api/wechatmoment/publicMoment' : '/wechatmoment/publicMoment';
    axios
        .post(publicMomentApi, formData, headers)
        .then(res => {
            closeToast();
            momentText.value = location.value = userStore.adress = '';
            imgList.value = [];
            if (res.data.status === 2) {
                router.replace('/wechatmoments');
            } else {
                showToast(res.data.message);
            }
        })
        .catch(err => {
            throw Error(err);
        });
}
onMounted(() => {
    userStore.handleGetUserInfo();
});
onActivated(() => {
    if (userStore.adress === '') {
        imgList.value = [];
        base64ImgList.value = [];
    }
});
</script>

<style lang="scss" scoped>
.publish {
    min-height: 100vh;
    background: #f5f5f5;
    .edit-box {
        position: relative;
        padding: 6px 0;
        background: #fff;
        .upload-box {
            padding: 0 16px;
            margin-top: 8px;
        }
    }
    .local-box {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        padding: 15px;
        margin-top: 10px;
        background: #fff;
        &-left {
            display: flex;
            display: -webkit-box;
            overflow: hidden;
            flex: 1;
            align-items: center;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
        }
        &-right {
            margin-left: 10px;
        }
    }
    .van-cell__title {
        display: flex;
        align-items: center;
    }
    .face-box {
        padding: 0 16px;
        margin-top: 8px;
    }
    .bm-view {
        width: 100%;
        height: 300px;
    }
}
</style>
