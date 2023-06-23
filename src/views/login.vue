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
                        @click="handleOpeneye"
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
                        @click="handleOpeneye"
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
                            @click="getCaptcha"
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
import {Row, Col, CellGroup, Button, Field, Image, Icon, showToast, FieldType} from 'vant';
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import ChatNavBar from '@/components/chat-nav-bar.vue';
import codeImg from '@/assets/img/code.png';
import wechatBg from '@/assets/img/wechatbg.png';
import defaultAvatar from '@/assets/img/avatar.jpg';
import storage from '@/common/storage';
import {useUserStore} from '@/store/index';
import {IAjaxRes} from '@/common/typings';

import {vueChatLogin, vueChatRegister, getCaptchaSvg} from '@/common/api';
const router = useRouter();
const userStore = useUserStore();
const vueChatName = ref<string>('');
const vueChatAccount = ref<string>('');
const password = ref<string>('');
const captcha = ref<string>('');
const svgRef = ref();
const svgcaptchaText = ref('');
const isShowEye = ref<boolean>(false);
const isHaveAccount = ref<boolean>(true);
const loginOrResText = ref<string>('注册新用户');
const btnText = ref<string>('登录');

const inputPasswordType = ref<FieldType>('password');
const handleOpeneye = () => {
    if (isShowEye.value) {
        isShowEye.value = !isShowEye.value;
        inputPasswordType.value = 'text';
    } else {
        isShowEye.value = true;
        inputPasswordType.value = 'password';
    }
};
// 获取验证码
const getCaptcha = async () => {
    const res = (await getCaptchaSvg()) as IAjaxRes;
    svgRef.value.innerHTML = res.data?.captchaSvg;
    svgcaptchaText.value = res.data?.captchaText || '';
};
// 注册或返回登录
const loginOrRes = () => {
    getCaptcha();
    vueChatAccount.value = password.value = captcha.value = vueChatName.value = '';
    btnText.value = isHaveAccount.value ? '注册' : '登录';
    loginOrResText.value = isHaveAccount.value ? '已有账号，返回登录' : '注册新用户';
    isHaveAccount.value = !isHaveAccount.value;
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

            getCaptcha();
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
            getCaptcha();
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
    getCaptcha();
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
