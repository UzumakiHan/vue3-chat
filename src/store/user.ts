import { defineStore } from 'pinia';
import {getUserInfo,getMailList} from '@/common/api'
import storage from '@/common/storage';
import {showToast} from 'vant'
import {IAjaxRes,IUserInfo} from '@/typings'

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        userId: '',
        token: false,
        userInfo:{} as IUserInfo,
        mailList:[] as Array<IUserInfo>,
        adress:''
    }),
    actions:{
        handleSetUserId(userId:string){
            this.userId = userId
        },
        handleSetToken(token:boolean){
            this.token = token
        },
       async handleGetUserInfo(){
        await storage.getItem('vue3-chat-id').then(async val=>{
            this.userId = val as string|| ''
            if(this.userId){
                const userInfoRes = await getUserInfo( this.userId )as IAjaxRes
                if(userInfoRes.status=== 2){
                    this.userInfo = userInfoRes.data as IUserInfo
                }else{
                    showToast(userInfoRes.message);
                }
            }
           
        })
        
        },
         async getMailList(){
            await storage.getItem('vue3-chat-id').then(async val=>{
                this.userId = val as string || ''
                const mailRes=  await getMailList(this.userId) as IAjaxRes;
                if(mailRes.status=== 2){
                    this.mailList = mailRes.data as Array<IUserInfo>
                }else{
                    showToast(mailRes.message);
                }
            })
        }
    }
    

})