import {ref} from 'vue';
import {useRoute} from 'vue-router';
import {useUserStore} from '@/store/index';
import {getUserInfo} from '@/common/api';
import {IAjaxRes} from '@/common/typings';

export default function usePersonal() {
    const userStore = useUserStore();

    const route = useRoute();

    const {id} = route.params;
    const isMySelf = ref(id === userStore.userId);
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
    const otherUserInfo = ref();

    const iconName = ref('edit');

    const isEdit = ref(false);
    const handleOtherUserInfo = async () => {
        let userInfoData = {
            vuechatAccount: '',
            vuechatAvatar: '',
            vuechatName: '',
            sex: '',
            phone: '',
            brithday: '',
            address: '',
            personalSign: ''
        };
        if (!isMySelf.value) {
            const otherUserInfoRes = (await getUserInfo(id as string)) as IAjaxRes;
            otherUserInfo.value = otherUserInfoRes.data;
            userInfoData = otherUserInfo.value;
        } else {
            userInfoData = userStore.userInfo;
        }
        const {vuechatAccount, vuechatAvatar, vuechatName, sex, phone, brithday, address, personalSign} = userInfoData;
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
    };
    const handleEdit = () => {
        isEdit.value = !isEdit.value;
        iconName.value = isEdit.value ? 'cross' : 'edit';
        if (isEdit.value) {
            const {vuechatAccount, vuechatAvatar, vuechatName, sex, phone, brithday, address, personalSign} =
                isMySelf.value ? userStore.userInfo : otherUserInfo.value;
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
    };
    return {
        isMySelf,
        userInfo,
        isEdit,
        iconName,
        handleOtherUserInfo,
        handleEdit
    };
}
