<template>
    <div class="wechat-moment-contain">
        <div class="wechat-moment-contain-list">
            <hfex-list
                v-if="wechatMomentLists.length > 0"
                v-model="flowLoading"
                :finished="flowFinished"
                :error="flowError"
                pullup-tips-bg="transparent"
                @load="onLoad"
            >
                <ul class="wechat-moment-contain-list-ul">
                    <li
                        v-for="(moment, momentIndex) in wechatMomentLists"
                        :key="momentIndex"
                        class="wechat-moment-contain-list-ul-li"
                    >
                        <img
                            class="wechat-moment-contain-list-ul-li-avatar"
                            :src="moment.userInfo[0].vuechatAvatar"
                            @click="handleCheckUser(moment.userInfo[0])"
                        >
                        <div class="wechat-moment-contain-list-ul-li-content">
                            <div class="wechat-moment-contain-list-ul-li-content-name">
                                {{ moment.userInfo[0].vuechatName }}
                            </div>
                            <div class="wechat-moment-contain-list-ul-li-content-text">
                                <TextParagraph
                                    :text="moment.momentText"
                                    :max-lines="3"
                                >
                                    <template v-slot:default="{clickToggle, expanded}">
                                        <span
                                            class="expand-text"
                                            @click="clickToggle"
                                        >{{ expanded ? '收起' : '阅读全文' }}</span>
                                    </template>
                                </TextParagraph>
                            </div>

                            <div class="wechat-moment-contain-list-ul-li-content-imglist">
                                <van-image
                                    v-for="(imgs, index) in moment.base64ImgList"
                                    :key="index"
                                    class="wechat-moment-contain-list-ul-li-content-imglist-img"
                                    width="80"
                                    height="80"
                                    fit="cover"
                                    :src="imgs"
                                    @click="handlePreviewImg(imgs)"
                                />
                            </div>
                            <div class="wechat-moment-contain-list-ul-li-content-bottom">
                                <div class="wechat-moment-contain-list-ul-li-content-bottom-left">
                                    <span>发布于：{{ dayJs(moment.momentTime).fromNow() }}</span>
                                    <van-icon
                                        v-if="props.userId === moment.userInfo[0]._id"
                                        name="delete"
                                        size="18"
                                        @click="handleDelete(moment._id, momentIndex)"
                                    />
                                </div>
                                <div class="wechat-moment-contain-list-ul-li-content-bottom-right">
                                    <!-- eslint-disable -->
                                    <van-popover
                                        v-model:show="showPopoverFlag[momentIndex]"
                                        placement="left"
                                        theme="dark"
                                        trigger="click"
                                    >
                                        <van-config-provider :theme-vars="girdTheme">
                                            <van-grid
                                                square
                                                clickable
                                                :border="false"
                                                column-num="2"
                                                style="width: 100px"
                                                icon-size="18"
                                            >
                                                <van-grid-item
                                                    v-for="(actionitem, actionindex) in actions"
                                                    :key="actionindex"
                                                    :icon="actionitem.icon"
                                                    @click.stop="hanldeActionSelect(actionitem, moment, momentIndex)"
                                                />
                                            </van-grid>
                                        </van-config-provider>

                                        <template v-slot:reference>
                                            <van-icon
                                                name="more"
                                                size="24"
                                                @click="handlePopoverBox(moment)"
                                            />
                                        </template>
                                    </van-popover>
                                    <!-- eslint-disable -->
                                </div>
                            </div>
                            <div
                                v-if="moment.location"
                                class="wechat-moment-contain-list-ul-li-content-location"
                            >
                                <van-icon name="location" />
                                <span>{{ moment.location }}</span>
                            </div>
                            <template v-if="moment.likeAccounts.length > 0 || moment.commentList.length > 0">
                                <div class="r" />
                                <div
                                    v-if="moment.likeAccounts.length > 0"
                                    class="cmt-wrap"
                                >
                                    <div class="like">
                                        <van-icon name="like-o" />
                                        <span
                                            v-for="(likeName, likeIndex) in moment.likeAccounts"
                                            :key="likeIndex"
                                            style="margin-left: 4px; font-size: 14px"
                                            >{{ likeName }}<span>，</span></span
                                        >
                                    </div>
                                </div>
                                <div
                                    v-if="moment.commentList.length > 0"
                                    class="wechat-moment-contain-list-ul-li-content-comment"
                                >
                                    <div
                                        :class="{checkmore: moment.checkMore}"
                                        class="wechat-moment-contain-list-ul-li-content-comment-list"
                                    >
                                        <p
                                            v-for="(commemt, commentIndex) in moment.commentList"
                                            :key="commentIndex"
                                            @click.stop="handleReplyComment(commemt, momentIndex)"
                                        >
                                            <span class="user">{{ commemt.sendUser.userAccount }}</span>
                                            <template v-if="commemt.receiveUser.userId !== commemt.sendUser.userId">
                                                <span>回复</span>
                                                <span class="user">{{ commemt.receiveUser.userAccount }}</span>
                                            </template>
                                            :
                                            <span>{{ commemt.wechatComment }}</span>
                                        </p>
                                    </div>
                                    <div
                                        v-show="moment.checkMore || moment.commentList.length > 6"
                                        class="wechat-moment-contain-list-ul-li-content-comment-check"
                                        @click="handleCheckMoreComment(momentIndex)"
                                    >
                                        {{ moment.checkMore ? '查看更多' : '收起评论' }}
                                    </div>
                                </div>
                            </template>

                            <div
                                v-if="commentShow === momentIndex"
                                ref="commentRef"
                                class="wechat-moment-contain-list-ul-li-content-commentinp"
                            >
                                <input
                                    v-model="wechatComment"
                                    type="text"
                                    placeholder="请请输入评论"
                                    @keyup.enter="handleSendComment(moment)"
                                />
                                <button @click="handleSendComment(moment)">发送</button>
                            </div>
                        </div>
                    </li>
                </ul>
            </hfex-list>

            <van-empty
                v-else
                description="暂无动态"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import {showImagePreview, showDialog, showToast} from 'vant';
import HfexList from 'hfex-list';
import dayJs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import {IUserInfo, IWechatMoment, IAjaxRes, IWechatMomentComment} from '@/typings';
import {
    getAllFriendsWechatMoments,
    delWechatMoment,
    likeWechatMoment,
    unLikeWechatMoment,
    sendWechatComment,
    getMyWechatMoments
} from '@/common/api';

import {useUserStore} from '@/store/user';
import TextParagraph from '@/components/text-paragraph.vue';

dayJs.locale('zh-cn'); // +
dayJs.extend(relativeTime);
interface TAction {
    icon: string;
    actionkey: number;
}
const props = defineProps({
    userInfo: {
        type: Object as () => IUserInfo,
        default: () => {
            return {};
        }
    },
    userId: {
        type: String,
        default: ''
    }
});

const girdTheme = {
    ['grid-item-content-background']: '#4a4a4a'
};
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const commentShow = ref(-1);
const wechatComment = ref('');
const page = ref(1);
const pageSize = 10;
const receiveUserInfo = ref({
    userId: '',
    userAccount: ''
});
const flowLoading = ref(false);
const flowFinished = ref(false);
const flowError = ref(false);
const showPopoverFlag = ref<Array<boolean>>([]);
const actions = ref<Array<TAction>>([]);
function handlePopoverBox(wechatMoments: IWechatMoment) {
    const likeAccounts = wechatMoments.likeAccounts;
    // 判断用户有没有点赞
    const isLike = likeAccounts.findIndex(account => account === props.userInfo.vuechatAccount);
    const likeIcon = isLike !== -1 ? 'like' : 'like-o';
    actions.value = [
        {
            icon: likeIcon,
            actionkey: 1
        },
        {
            icon: 'chat',
            actionkey: 2
        }
    ];
}
const wechatMomentLists = ref<Array<IWechatMoment>>([]);

async function handleGetAllWechatMomentList() {
    flowLoading.value = true;
    const info = {
        id: userStore.userId,
        page: page.value,
        pageSize
    };
    let result;
    if (route.name === 'WechatMoment') {
        result = (await getAllFriendsWechatMoments(info)) as IAjaxRes; // 获取所有好友的朋友圈
    } else {
        result = (await getMyWechatMoments(info)) as IAjaxRes; // 获取所有好友的朋友圈
    }

    flowLoading.value = false;
    if (result.status === 2) {
        const allFriendsWechatMoments = result.data?.list as Array<IWechatMoment>;
        if (allFriendsWechatMoments.length === 0) {
            flowFinished.value = true;
            return;
        }
        if (allFriendsWechatMoments.length > 0) {
            allFriendsWechatMoments.forEach((wechatMoment: IWechatMoment) => {
                wechatMoment.checkMore = wechatMoment.commentList.length > 6;
            });
            wechatMomentLists.value = wechatMomentLists.value.concat(allFriendsWechatMoments);
            flowFinished.value = false;
            page.value += 1;
        }
    } else {
        flowError.value = true;
    }
}
// 预览图片
function handlePreviewImg(img: string) {
    const imglist = [];
    imglist.push(img);
    showImagePreview(imglist);
}
async function handleDelete(momentId: string, momentIndex: number) {
    showDialog({
        showCancelButton: true,
        title: '确定删除吗？'
    })
        .then(async () => {
            const result = (await delWechatMoment(momentId)) as IAjaxRes;
            showToast(result.message);
            if (result.status === 2) {
                wechatMomentLists.value.splice(momentIndex, 1);
            }
        })
        .catch(() => {
            console.log('cancle');
        });
}
async function hanldeActionSelect(action: TAction, wechatMoment: IWechatMoment, momentIndex: number) {
    if (action.actionkey === 1) {
        const wechatMomentInfo = {
            wechatMomentId: wechatMoment._id,
            vuechatAccount: props.userInfo.vuechatAccount
        };
        const idx = wechatMoment.likeAccounts.findIndex(id => id === props.userInfo.vuechatAccount); // -1为没有点赞

        if (idx === -1) {
            const result = (await likeWechatMoment(wechatMomentInfo)) as IAjaxRes; // 点赞

            if (result.status === 2) {
                showToast(result.message);
                wechatMomentLists.value[momentIndex].likeAccounts.push(props.userInfo.vuechatAccount);
            }
        } else {
            const result = (await unLikeWechatMoment(wechatMomentInfo)) as IAjaxRes; // 取消点赞
            if (result.status === 2) {
                showToast(result.message);
                wechatMomentLists.value[momentIndex].likeAccounts.splice(idx, 1);
            }
        }

        showPopoverFlag.value[momentIndex] = false;
    } else {
        commentShow.value = momentIndex;
        showPopoverFlag.value = [];
    }
}
async function handleReplyComment(comment: IWechatMomentComment, momentIndex: number) {
    if (comment.sendUser.userId === userStore.userId) {
        showToast('请勿自身回复评论');
    } else {
        receiveUserInfo.value = comment.sendUser;
        commentShow.value = momentIndex;
    }
}
async function handleSendComment(wechatMoment: IWechatMoment) {
    if (wechatComment.value === '') {
        showToast('评论不能为空');
    } else {
        receiveUserInfo.value =
            receiveUserInfo.value.userId === ''
                ? {
                    userId: wechatMoment?.userInfo[0]._id,
                    userAccount: wechatMoment?.userInfo[0].vuechatAccount
                }
                : receiveUserInfo.value;

        const receiveUser = JSON.stringify(receiveUserInfo.value);
        const sendUser = JSON.stringify({
            userId: props.userId,
            userAccount: userStore.userInfo.vuechatAccount
        });
        const commentInfo = {
            wechatMomentId: wechatMoment._id,
            receiveUser,
            sendUser,
            wechatComment: wechatComment.value,
            wechatCommentTime: dayJs(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };
        const result = (await sendWechatComment(commentInfo)) as IAjaxRes;
        showToast(result.message);
        if (result.status === 2) {
            const commentInfos: IWechatMomentComment = {
                wechatMomentId: wechatMoment._id,
                receiveUser: JSON.parse(receiveUser),
                sendUser: JSON.parse(sendUser),
                wechatComment: wechatComment.value,
                wechatCommentTime: dayJs(new Date()).format('YYYY-MM-DD HH:mm:ss')
            };
            commentShow.value = -1;
            wechatComment.value = '';
            wechatMoment.commentList.push(commentInfos);
        }
    }
}
function handleCheckMoreComment(momentIndex: number) {
    wechatMomentLists.value[momentIndex].checkMore = !wechatMomentLists.value[momentIndex].checkMore;
}
function onLoad() {
    handleGetAllWechatMomentList();
}
function handleCheckUser(userInfo: IUserInfo) {
    router.push(`/chatuserInfo/${userInfo._id}`);
}
onMounted(() => {
    handleGetAllWechatMomentList();
});
</script>

<style lang="scss" scoped>
@import '@/scss/wechat-friend';
.wechat-moment-contain {
    margin-top: 46px;
    margin-bottom: 50px;
    background: #fff;
    &-list {
        padding: 0 20px;
        margin-top: 80px;
        &-ul {
            &-li {
                display: flex;
                padding-bottom: 15px;
                border-bottom: 1px solid #eee;
                margin-bottom: 15px;
                &-avatar {
                    width: 40px;
                    height: 40px;
                }
                &-content {
                    flex: 1;
                    margin-left: 10px;
                    &-name {
                        color: #576b95;
                        font-size: 16px;
                    }
                    &-text {
                        margin-top: 4px;
                        color: #252525;
                        font-size: 15px;
                        line-height: 26px;

                        word-break: break-all;
                        .expand-text {
                            color: #576b95;
                        }
                    }
                    &-checkMore {
                        margin-top: 6px;
                        color: #576b95;
                        font-size: 15px;
                    }
                    &-imglist {
                        margin-top: 6px;
                        &-img {
                            margin-right: 6px;
                            &:last-child {
                                margin-right: 0;
                            }
                        }
                    }
                    &-bottom {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-top: 8px;
                        font-size: 14px;
                        &-left {
                            display: flex;
                            align-items: center;
                            color: #b1b1b1;
                            span {
                                margin-right: 6px;
                            }
                        }
                    }
                    &-commentinp {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-top: 10px;
                        input {
                            width: 100%;
                            height: 30px;
                            flex: 1;
                            padding-left: 10px;
                            border: none;
                            border-radius: 10px;
                            background-color: #f5f5f5;
                            outline: none;
                        }
                        button {
                            display: flex;
                            width: 50px;
                            height: 30px;
                            align-items: center;
                            justify-content: center;
                            border: none;
                            border-radius: 10px;
                            margin-left: 10px;
                            background: #1989fa;
                            color: #fff;
                            font-size: 13px;
                            outline: none;
                        }
                    }
                    &-location {
                        margin-top: 8px;
                        color: #b1b1b1;
                        font-size: 13px;
                    }
                    &-comment {
                        padding: 0 15px 10px;
                        background: #eee;
                        font-size: 16px;
                        &-list {
                            // min-height: 160px;
                            p {
                                padding-top: 10px;
                                .user {
                                    color: #576b95;
                                }
                            }
                            &.checkmore {
                                height: 200px;
                                overflow-y: hidden;
                            }
                        }
                        &-check {
                            margin-top: 10px;
                            color: #576b95;
                            font-size: 16px;
                            text-align: center;
                        }
                    }
                }
            }
        }
    }
}
</style>
