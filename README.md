# vuechat 重构 (未重构前的 https://github.com/UzumakiHan/vuechat)

## 主要实现用户登录注册、聊天、群聊、发布动态、用户信息修改等功能
## 以前的版本主要是用vue2 + vuex + vant2去搭建的，看了2年半写的这些代码,哈哈哈,觉得写得很烂 。利用了一些课余时间去进行了重构,这次打算用vue3 + pinia + vite + vant4.0 + hooks+异步组件去进行重构，重构后，代码的可读性以及性能有了很大的提升，重构的主要目的是接入之前自己的那套前端工程化流程，以及加入了一些自己封装的npm包，具体流程可以查阅我的这篇博客 。
https://blog.csdn.net/Hhjian524/article/details/131087359?spm=1001.2014.3001.5501

## 示页面截图
### 登录注册


![截图示例](https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-login.png?token=GHSAT0AAAAAACDEDGGPB74KWQJ64VWIWTKGZEZMLEA)

![截图示例](https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-register.png?token=GHSAT0AAAAAACDEDGGOSKWY5HTIVI4FAZA2ZEZMMAA)


### 四个tab页
![截图示例](https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-home.png?token=GHSAT0AAAAAACDEDGGOPIYBS4VNG4J3DNNUZEZMMTQ)

![截图示例](https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-maillist.png?token=GHSAT0AAAAAACDEDGGOSUVSAXRGL5W7C6HKZEZMM5Q)

![截图示例](https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-wechat-moment.png?token=GHSAT0AAAAAACDEDGGO67IZRESF55VSSF7SZEZMNLA)

![截图示例](https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-my.png?token=GHSAT0AAAAAACDEDGGOCDDI3N4SRYVIGBI4ZEZMNSA)


### 聊天页面


![截图示例](https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-chat.png?token=GHSAT0AAAAAACDEDGGPM4NENGFK523BEY4CZEZMOSA)

![截图示例](https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-g-chat.png?token=GHSAT0AAAAAACDEDGGPF5N3IKOVT4J45ZOSZEZMO3A)

### 用户与群组信息


![截图示例](https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-check-user.png?token=GHSAT0AAAAAACDEDGGPVDSQLAGWICOQDOU2ZEZMQCA)

![截图示例](https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-g-info.png?token=GHSAT0AAAAAACDEDGGP6ZZKK5WDBGDQX7SOZEZMPWA)

