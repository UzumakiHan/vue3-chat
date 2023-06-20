import {post,get} from './ajax';
import {
    ILogin,
    IRegister,
    ISearchVueChatAccount,
    ISearchMyFriend,
    IDelMyFriend,
    IGetDigtalChatMsg,
    IGetMyWechatMoments,
    ILikeWechatMoment,
    IChangeUserPwd,
    IEditChatRoomName,
    IEditChatRoomAd,
    IRemoveChatMember,
    IDeleteChatOwner,
    IGetAllFriendsWechatMoments,
    ISendWechatComment,
    IGetGroupChatList
} from '@/typings'
console.log(process.env.NODE_ENV)
const BASE_URL = process.env.NODE_ENV === 'development' ? '/api' : '';
console.log(BASE_URL)

//获取验证码接口
export const getCaptchaSvg = () => get(BASE_URL+`/user/captcha?time=${new Date()}`);

//注册账号
export const vueChatRegister = (userInfo:IRegister) => post(BASE_URL + '/user/accountRegister',userInfo);

//用户登录
export const vueChatLogin = (userInfo:ILogin) => post(BASE_URL + '/user/accountLogin',userInfo);

//根据vuechat号查询好友

export const searchVueChatAccount = (userInfo:ISearchVueChatAccount) => post(BASE_URL + '/user/searchVueChatAccount',userInfo);

//根据vuechat号查询自己好友

export const searchMyFriend = (userInfo:ISearchMyFriend) => post(BASE_URL + '/user/searchMyFriend',userInfo);
//查找登录用户的信息
export const getUserInfo = (id:string) => post(BASE_URL + '/user/findMyInfo',{id});


//查找通讯录
export const getMailList = (id:string) => post(BASE_URL + '/user/getMailList',{id});

//删除好友
export const delMyFriend = (delInfo:IDelMyFriend) => post(BASE_URL + '/user/delMyFriend',delInfo);

//获取私聊的聊天记录
export const getDigtalChatMsg = (msgInfo:IGetDigtalChatMsg) => post(BASE_URL + '/chatlist/digtalChatList',msgInfo);

//获取首页的聊天列表
export const alldigtalChatList = (id:string) => post(BASE_URL + '/chatlist/alldigtalChatList',{id})


//查找聊天用户的信息
export const getChatUserInfo = (id:string) => post(BASE_URL + '/user/findMyInfo',{id});


//清除私聊聊天记录
export const cleanDigtalChatMessage = (id:string) => post(BASE_URL + '/chatlist/cleanChatMessage',{id});

//发表朋友圈
// export const publicWechatMoment = (wechatMoment) => post(BASE_URL + '/wechatmoment/publicMoment',wechatMoment)

//获取好友们朋友圈
export const getAllFriendsWechatMoments = (info:IGetAllFriendsWechatMoments) => post(BASE_URL + '/wechatmoment/allFriendsWechatMoments',info);
//获取自己的朋友圈
export const getMyWechatMoments = (info:IGetMyWechatMoments) => post(BASE_URL + '/wechatmoment/myWechatMoments',info);
//删除朋友圈
export const delWechatMoment = (id:string) => post(BASE_URL + '/wechatmoment/delWechatMoment',{id})
//点赞朋友圈
export const likeWechatMoment = (wechatMoment:ILikeWechatMoment) => post(BASE_URL + '/wechatmoment/likeWechatMoment',wechatMoment)
//取消点赞
export const unLikeWechatMoment = (wechatMoment:ILikeWechatMoment) => post(BASE_URL + '/wechatmoment/unLikeWechatMoment',wechatMoment)
//更改密码
export const changeUserPwd = (changeInfo:IChangeUserPwd) => post(BASE_URL + '/user/changePwd',changeInfo)
//获取用户的群聊聊天记录
export const getGroupChatList = (info:IGetGroupChatList) => post(BASE_URL + '/chatlist/myGroupChatMsg',info)
// export const getGroupChatList = (chatRoomId) => post(BASE_URL + '/chatlist/myGroupChatMsg',{chatRoomId})
//更改群昵称
export const editChatRoomName = (ChatRoomInfo:IEditChatRoomName) => post(BASE_URL + '/chatroom/editChatRoomName',ChatRoomInfo);
//更改群公告
export const editChatRoomAd = (ChatRoomInfo:IEditChatRoomAd) => post(BASE_URL + '/chatroom/editChatRoomAd',ChatRoomInfo);
//获取单个聊天室信息
export const getChatRoomInfo = (id:string) => post(BASE_URL + '/chatroom/getChatRoomInfo',{id});
//移除群成员
export const removeChatMember = (removeInfo:IRemoveChatMember) => post(BASE_URL + '/chatroom/removeChatMember',removeInfo);
//获取单个聊天室信息
export const cleanChatList = (sendAccountAndchatRoomId:string) => post(BASE_URL + '/chatlist/cleanChatList',{sendAccountAndchatRoomId});
//群主退出群聊

export const deleteChatOwner = (removeInfo:IDeleteChatOwner) => post(BASE_URL + '/chatroom/deleteChatOwner',removeInfo);
//获取首页群聊的记录
export const getAllgrounpChatList = (id:string) => post(BASE_URL + '/chatlist/allgrounpChatList',{id});

//评论朋友圈
export const sendWechatComment = (commentInfo:ISendWechatComment) => post(BASE_URL + '/wechatmoment/sendWechatComment',commentInfo)