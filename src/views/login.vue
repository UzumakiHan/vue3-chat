<template>
    <div class="login">
        <ChatNavBar :title="btnText" />
        <div class="login-content">
            <Row
                type="flex"
                justify="center"
                style="margin-bottom: 20px"
            >
                <Col>
                    <Image
                        width="100"
                        height="100"
                        :src="wechatBg"
                    />
                </Col>
            </Row>
            <CellGroup>
                <Field
                    v-if="!isHaveAccount"
                    v-model="vueChatName"
                    left-icon="user-o"
                    required
                    clearable
                    label="用户名"
                    placeholder="请输入用户名"
                />
                <Field
                    v-model="vueChatAccount"
                    left-icon="user-o"
                    required
                    clearable
                    label="账号"
                    placeholder="请输入vuechat号"
                />
                <Row>
                    <Col span="21">
                        <Field
                            v-model="password"
                            left-icon="credit-pay"
                            :type="inputPasswordType"
                            label="密码"
                            placeholder="请输入密码"
                            required
                        />
                    </Col>
                    <Col
                        v-if="isShowEye"
                        span="3"
                        style="margin-top: 12px"
                        @click="handlEyeToggle"
                    >
                        <Icon
                            name="closed-eye"
                            size="18"
                        />
                    </Col>
                    <Col
                        v-else
                        span="2"
                        style="margin-top: 12px"
                        @click="handlEyeToggle"
                    >
                        <Icon
                            name="eye-o"
                            size="18"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span="18">
                        <Field
                            v-model="captcha"
                            :left-icon="codeImg"
                            type="text"
                            label="验证码"
                            placeholder="请输入验证码"
                            required
                        />
                    </Col>
                    <Col span="6">
                        <!-- <Image width="80px" height="40px" :src="svgcaptcha" @click.prevent="getCaptcha()" /> -->
                        <div
                            ref="svgRef"
                            class="svg-box"
                            @click="handleGetCaptcha"
                        />
                    </Col>
                </Row>
            </CellGroup>

            <Row style="margin-top: 20px">
                <Button
                    type="primary"
                    size="large"
                    @click="handleLoginOrRes"
                >
                    {{ btnText }}
                </Button>
            </Row>
            <Row
                style="padding: 6px 10px; margin-top: 10px"
                type="flex"
                justify="space-between"
            >
                <Col class="forget">
                    忘记密码
                </Col>
                <Col
                    class="register"
                    @click="loginOrRes"
                >
                    {{ loginOrResText }}
                </Col>
            </Row>
        </div>
    </div>
</template>

<script setup lang="ts">
import {Row, Col, CellGroup, Button, Field, Image, Icon, showToast} from 'vant';
import {ref, onMounted, defineAsyncComponent} from 'vue';
import {useRouter} from 'vue-router';

import codeImg from '@/assets/img/code.png';
import wechatBg from '@/assets/img/wechatbg.png';
import defaultAvatar from '@/assets/img/avatar.jpg';
import storage from '@/common/storage';
import {useUserStore} from '@/store/index';
import {IAjaxRes} from '@/common/typings';

import {vueChatLogin, vueChatRegister} from '@/common/api';
import useLogin from '@/hooks/use-login';
const ChatNavBar = defineAsyncComponent(() => import('@/components/chat-nav-bar.vue'));

const {
    isShowEye,
    inputPasswordType,
    btnText,
    loginOrResText,
    isHaveAccount,
    svgRef,
    svgcaptchaText,
    handlEyeToggle,
    handleLRToggle,
    handleGetCaptcha
} = useLogin();
const router = useRouter();
const userStore = useUserStore();
const vueChatName = ref<string>('');
const vueChatAccount = ref<string>('');
const password = ref<string>('');
const captcha = ref<string>('');
// 注册或返回登录
const loginOrRes = () => {
    handleGetCaptcha();
    vueChatAccount.value = password.value = captcha.value = vueChatName.value = '';
    handleLRToggle();
};
async function handleLogin() {
    // 登录
    if (vueChatAccount.value === '' || password.value === '' || captcha.value === '') {
        showToast('请输入完整的信息');
    } else {
        const userInfo = {
            vueChatAccount: vueChatAccount.value,
            vueChatpassword: password.value,
            vueChatCaptcha: captcha.value,
            svgcaptchaText: svgcaptchaText.value
        };
        const loginRes = (await vueChatLogin(userInfo)) as IAjaxRes;
        if (loginRes.status === 0) {
            // 验证码不正确

            handleGetCaptcha();
        } else if (loginRes.status === 2) {
            // '登录成功
            vueChatAccount.value = password.value = captcha.value = '';
            storage.setItem('vue3-chat-token', 'true');
            storage.setItem('vue3-chat-id', loginRes.data?._id);
            userStore.userId = loginRes.data?._id as string;
            userStore.token = true;
            router.push('/');
        }
        showToast(loginRes.message);
    }
}
async function handleRegister() {
    if (vueChatAccount.value === '' || password.value === '' || captcha.value === '' || vueChatName.value === '') {
        showToast('请输入完整的信息');
        return;
    }
    // 注册
    // 用户名正则，6到16位（字母，数字，下划线，减号）
    const nameFilter = /^[a-zA-Z0-9_-]{6,16}$/;
    // 密码正则，8到16位（字母，数字）
    const pwdFilter = new RegExp(
        '^(?=.{8,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$',
        'g'
    );
    if (!nameFilter.test(vueChatAccount.value)) {
        showToast('请输入vuechat账号为6到16位（字母，数字，下划线，减号）');
    } else if (!pwdFilter.test(password.value)) {
        showToast('请输入密码为8位以上并且字母、数字、特殊字符三项中有两项');
    } else {
        const userInfo = {
            vueChatAccount: vueChatAccount.value,
            vueChatpassword: password.value,
            vueChatCaptcha: captcha.value,
            vueChatName: vueChatName.value,
            vuechatAvatar: defaultAvatar,
            svgcaptchaText: svgcaptchaText.value
        };
        const registerRes = (await vueChatRegister(userInfo)) as IAjaxRes;
        if (registerRes.status === 0) {
            handleGetCaptcha();
        } else if (registerRes.status === 2) {
            loginOrRes();
        }
        showToast(registerRes.message);
    }
}
// 登录
const handleLoginOrRes = async () => {
    if (isHaveAccount.value) {
        handleLogin();
    } else {
        handleRegister();
    }
};

onMounted(() => {
    handleGetCaptcha();
});
</script>

<style lang="scss" scoped>
.login {
    &-content {
        margin-top: 80px;
        .forget {
            color: rgb(255, 68, 0);
            font-size: 16px;
            text-align: center;
            &:hover {
                cursor: pointer;
                text-decoration: none;
            }
        }
        .register {
            color: #007bff;
            font-size: 16px;
            text-align: center;
            &:hover {
                cursor: pointer;
                text-decoration: none;
            }
        }
    }
}
</style>
