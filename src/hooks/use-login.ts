import {ref} from 'vue';
import {FieldType} from 'vant';
import {getCaptchaSvg} from '@/common/api';
import {IAjaxRes} from '@/common/typings';

export default function useLogin() {
    const isShowEye = ref<boolean>(false);
    const inputPasswordType = ref<FieldType>('password');
    const loginOrResText = ref<string>('注册新用户');
    const btnText = ref<string>('登录');
    const isHaveAccount = ref<boolean>(true);
    const svgRef = ref();
    const svgcaptchaText = ref('');
    const handlEyeToggle = () => {
        if (isShowEye.value) {
            isShowEye.value = !isShowEye.value;
            inputPasswordType.value = 'text';
        } else {
            isShowEye.value = true;
            inputPasswordType.value = 'password';
        }
    };
    const handleLRToggle = () => {
        btnText.value = isHaveAccount.value ? '注册' : '登录';
        loginOrResText.value = isHaveAccount.value ? '已有账号，返回登录' : '注册新用户';
        isHaveAccount.value = !isHaveAccount.value;
    };
    const handleGetCaptcha = async () => {
        const res = (await getCaptchaSvg()) as IAjaxRes;
        svgRef.value.innerHTML = res.data?.captchaSvg;
        svgcaptchaText.value = res.data?.captchaText || '';
    };
    return {
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
    };
}
