import exp from "constants";

export  interface ILogin{
    vueChatAccount:string;
    vueChatpassword:string;
    vueChatCaptcha:string;
    svgcaptchaText:string
}
export interface IRegister{
    vueChatAccount:string;
    vueChatpassword:string;
    vueChatCaptcha:string;
    vueChatName:string;
    vuechatAvatar:string;
    svgcaptchaText:string
}
export interface ISearchVueChatAccount{
    vuechatAccount:string
}
export interface ISearchMyFriend{
    vuechatAccount:string;
    id:string
}
export interface IDelMyFriend{
    delId:string;
    myId:string
}

export interface IGetDigtalChatMsg{
    targetAccountId:string;
    sendAccountId:string,
    page:number;
    pageSize:number
}
export interface IGetGroupChatList{
    sendAccountAndchatRoomId:string;
    page:number;
    pageSize:number
}
export interface IGetMyWechatMoments{
    id:string;
    pageSize:number;
    page:number;
}
export interface ILikeWechatMoment{
    wechatMomentId:string;
    vuechatAccount:string

}
export interface IChangeUserPwd{
    id:string;
    changePwd:string
}
export interface IEditChatRoomName{
    id:string;
    chatRoomName:string
}
export interface IEditChatRoomAd{
    id:string;
    chatRoomAd:string
}
export interface IRemoveChatMember{
    chatRoomId:string;
    removeChatId:string
}
export interface IDeleteChatOwner{
    chatRoomId:string;
    removeChatId:string;
    newChatRoomOwner:string
}
export interface ISendWechatComment{
    wechatMomentId:string;
    receiveUser:string;
    sendUser:string;
    wechatComment:string;
    wechatCommentTime:string
    
}
export interface IGetAllFriendsWechatMoments{
    id:string;
    page:number;
    pageSize:number;
}
export interface IWechatMomentComment{
    wechatMomentId:string;
    receiveUser:{
        userAccount:string;
        userId:string;
    };
    sendUser:{
        userAccount:string;
        userId:string;
    };
    wechatComment:string;
    wechatCommentTime:string
}
export  interface IChatList{
    chatImg:string;
    chatMessage:string;
    chatTime:string;
    chatRoomId:string;
    chatRoomName:string;
    chatRoomImg:string;
    chatVoice:{
        chatVoiceUrl:string;
        chatVoiceTime:string;
    };
    sendAccountAndTargetAccountId:string;
    sendAccountAvatar:string;
    sendAccountId:string;
    sendAccountName:string;
    targetAccountAvatar:string;
    targetAccountId:string;
    targetAccountName:string;
    sendAccountAndchatRoomId:string;
    __v:number;
    _id:string;
}
export  interface IUserInfo{
    address:string;
    age:string;
    applyVuechatFriendsList:Array<string>;
    brithday:string;
    chatRooms:Array<string>;
    createTime:string;
    friendsList:Array<string>;
    myApplyVuechatFriendsList:Array<string>;
    personalSign:string;
    phone:string;
    sex:string;
    vuechatAccount:string;
    vuechatName:string;
    vuechatAvatar:string;
    vuechatPassword:string;
    wechatMomentBg:string;
    _v:number;
    _id:string;


}
export  interface IWechatMoment{
    base64ImgList:Array<string>;
    commentList:Array<IWechatMomentComment>;
    latitudeAndlongitude:any;
    likeAccounts:Array<string>;
    location:string;
    momentText:string;
    momentTime:string;
    vueChatId:string;
    userInfo:Array<IUserInfo>;
    _v:number;
    _id:string;
    showComment?:Boolean;
    textlength?:Boolean;
    toggleShowText?:string
    likeAccountNameArr?:Array<string>;
    commentListArr?:Array<string>;
    sendVuechatName?:string;
    recieveVuechatName?:string;
    vuechatAvatar?:string;
    checkMore?:boolean;
    checkMoreText?:boolean
}
export interface IChatRoomDialogList{
    sendAccountId:string;
    sendAccountAvatar:string;
    sendAccountName:string;
    chatMessage:string;
    chatVoice:{
        chatVoiceUrl:string;
        chatVoiceTime:string;
    }
    chatImg:string;
    chatTime:string;
    chatRoomId:string;
    chatRoomImg:string;
    chatRoomMemberId:Array<string>;
    chatRoomName:string;
    sendAccountAndchatRoomId:string;
    _v:number;
    _id:string;
}
export  interface IAjaxRes{
    status:number;
    message:string;
    data?:{
        captchaSvg?:string;
        captchaText?:string;
        _id?:string
        chatDigtalList?:Array<IChatList>;
        list?:Array<IWechatMoment>;
        groupChatList?:Array<IChatRoomDialogList>
    }
}
export interface IFileObject {
    content: string;
}
export interface IEmojiData {
    [key: string]: {
        keywords: string[];
        char: string;
        fitzpatrick_scale: boolean;
        category: string;
    };
}
export interface IChatRoom{
    chatRoomAd:string;
    chatRoomCreateTime:string;
    chatRoomImg:string;
    chatRoomMemberId:Array<string>;
    chatRoomName:string;
    chatRoomOwner:string;
    _v:number;
    _id:string;
}