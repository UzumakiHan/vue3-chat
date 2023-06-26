import {useRoute, useRouter} from 'vue-router';
import {ref} from 'vue';
import {showToast, showDialog} from 'vant';
import {useUserStore} from '@/store/index';
import {IUserInfo, IAjaxRes, IDelMyFriend, IGetMyWechatMoments, IWechatMoment} from '@/common/typings';
import {cleanDigtalChatMessage, getUserInfo, delMyFriend, getMyWechatMoments} from '@/common/api';

export default function useChatInfo() {
    const userStore = useUserStore();

    const route = useRoute();
    const router = useRouter();

    const userId = route.params.id as string;
    const userInfo = ref();
    const judgeKey = ref(false);
    const imgShowList = ref<Array<string>>([]);

    // 判断当前用户是否为 好友
    function handleJudgeMyFriends() {
        const friendsList: Array<string> = userStore.userInfo.friendsList;
        if (friendsList.length > 0) {
            friendsList.forEach(item => {
                if (item === userId) {
                    judgeKey.value = true;
                }
            });
        }
    }
    const handleGetuserInfo = async () => {
        const result = (await getUserInfo(userId)) as IAjaxRes;
        if (result.status === 2) {
            const userRes = result.data as IUserInfo;
            userInfo.value = userRes;
            handleJudgeMyFriends();
        }
    };
    const handleCleanMessage = () => {
        showDialog({
            showCancelButton: true,
            title: '删除聊天记录',
            message: `将联系人“${userInfo.value.vuechatName}”的聊天记录删除`
        }).then(async () => {
            const delId = userStore.userId + userId;

            const result = (await cleanDigtalChatMessage(delId)) as IAjaxRes;
            showToast(result.message);
        });
    };
    function handleDelFriend() {
        const delInfo: IDelMyFriend = {
            delId: userId,
            myId: userStore.userId
        };
        showDialog({
            showCancelButton: true,
            title: '删除联系人',
            message: `将联系人“${userInfo.value.vuechatName}”删除，将同时删除与该联系人的聊天记录`
        }).then(async () => {
            const result = (await delMyFriend(delInfo)) as IAjaxRes;
            showToast(result.message);
            if (result.status === 2) {
                router.push('/maillist');
            }
        });
    }
    // 获取朋友圈照片
    async function handleGetImgShowList() {
        const getInfo: IGetMyWechatMoments = {
            id: userId,
            pageSize: 3,
            page: 1
        };
        const result = (await getMyWechatMoments(getInfo)) as IAjaxRes;
        const userWechatmoment = result.data?.list;
        if (!userWechatmoment) {
            return;
        }
        const wechatMomentList = userWechatmoment.reverse();
        const imglist: Array<string> = [];
        wechatMomentList.forEach((item: IWechatMoment) => {
            item.base64ImgList.forEach((base64Img: string) => {
                imglist.push(base64Img);
            });
        });

        imgShowList.value = imglist.slice(0, 3);
    }
    function hanleCheckuserInfo(currentUser: IUserInfo) {
        router.push(`/personalinfo/${currentUser._id}`);
    }
    function goWechatMoment(currentUser: IUserInfo) {
        router.push(`/wechatmoments?userId=${currentUser._id}`);
    }
    return {
        userInfo,
        judgeKey,
        userId,
        imgShowList,
        handleGetuserInfo,
        handleCleanMessage,
        handleJudgeMyFriends,
        handleDelFriend,
        handleGetImgShowList,
        hanleCheckuserInfo,
        goWechatMoment
    };
}
