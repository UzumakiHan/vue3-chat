<template>
    <div class="change-pwd">
        <ChatNavBar
            title="修改密码"
            :nav-type="2"
            :no-right="true"
        />
        <div class="change-pwd-box">
            <van-steps :active="active">
                <van-step>输入原来的密码</van-step>
                <van-step>输入更改的密码</van-step>
                <van-step>确定密码</van-step>
            </van-steps>
            <div class="inputs-div">
                <van-field
                    v-if="active === 0"
                    v-model="originPwd"
                    placeholder="请输入原来的密码"
                    type="password"
                />
                <van-field
                    v-if="active === 1"
                    v-model="newPwd"
                    placeholder="请输入更改的密码"
                    type="password"
                />
                <van-field
                    v-if="active === 2"
                    v-model="finalPwd"
                    placeholder="请确定密码"
                    type="password"
                />
            </div>
            <div class="step-box">
                <van-button
                    v-if="active !== 0"
                    type="default"
                    @click="handlePrevStep"
                >
                    上一步
                </van-button>
                <van-button
                    v-if="active !== 2"
                    type="primary"
                    style="margin-left: 6px"
                    @click="handleNextStep"
                >
                    下一步
                </van-button>
                <van-button
                    v-if="active === 2"
                    type="primary"
                    style="margin-left: 6px"
                    @click="handleSure"
                >
                    确定
                </van-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, defineAsyncComponent} from 'vue';
import {useRouter} from 'vue-router';
import {showToast} from 'vant';
import {useUserStore} from '@/store/index';
import {changeUserPwd, verifyPwd} from '@/common/api';
import {IAjaxRes} from '@/common/typings';
import storage from '@/common/storage';
const ChatNavBar = defineAsyncComponent(() => import('@/components/chat-nav-bar.vue'));

const userStore = useUserStore();
console.log(userStore.userInfo);
const router = useRouter();
const active = ref(0);
const originPwd = ref('');
const newPwd = ref('');
const finalPwd = ref();
function handlePrevStep() {
    active.value -= 1;
}
async function handleNextStep() {
    if (active.value === 0) {
        const verifyPwdRes = (await verifyPwd({id: userStore.userId, pwd: originPwd.value})) as IAjaxRes;
        if (verifyPwdRes.status === 2) {
            active.value += 1;
        } else {
            showToast('密码不一致');
        }
    } else if (active.value === 1) {
        if (newPwd.value === '') {
            showToast('输入不能为空');
        } else {
            active.value += 1;
        }
    }
}
async function handleSure() {
    if (finalPwd.value === newPwd.value) {
        const changeInfo = {
            id: userStore.userId,
            changePwd: finalPwd.value
        };
        const result = (await changeUserPwd(changeInfo)) as IAjaxRes;
        showToast(result.message);
        if (result.status === 2) {
            storage.removeItem('vue3-chat-id');
            await storage.removeItem('vue3-chat-id').then(() => {
                router.replace('/login');
            });
        }
    } else {
        showToast('密码不一致');
    }
}
</script>

<style lang="scss" scoped>
.change-pwd {
    min-height: 100vh;
    background: #f5f5f5;
    &-box {
        padding-top: 50px;
    }
    .inputs-div {
        margin-top: 20px;
    }
    .step-box {
        display: flex;
        justify-content: flex-end;
        padding: 10px;
    }
}
</style>
