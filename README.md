# vuechat 重构 (未重构前的 https://github.com/UzumakiHan/vuechat)
## 访问地址： http://43.142.90.39:11113/

## 主要实现用户登录注册、聊天、群聊、发布动态、用户信息修改等功能
## 以前的版本主要是用vue2 + vuex + vant2去搭建的，看了2年半写的这些代码,哈哈哈,觉得写得很烂 。利用了一些课余时间去进行了重构,这次打算用vue3 +ts+ pinia + vite + vant4.0 + hooks+异步组件去进行重构，重构后，代码的可读性以及性能有了很大的提升，重构的主要目的是接入之前自己的那套前端工程化流程，以及加入了一些自己封装的npm包，具体流程可以查阅我的这篇博客 。
https://blog.csdn.net/Hhjian524/article/details/131087359?spm=1001.2014.3001.5501

## 工程化：
1. 使用了mfex-project去创建项目
2. 使用了hfex-check对项目目录结构进行检测
3. 使用了rollup构建的npm包，hfex-list以及hfex-ellipsis
3. 使用了eslint-config-hfex、hfex-stylelint-config对代码质量进行检测，hfex-prettier-config格式化代码缩进
4. 使用了hfex-check对git commit信息进行检测
5. 使用了GitHub action自动构建并推到远程服务器

## 示页面截图
### 登录注册
<div style="display:flex;align-items: center;margin-top:20px ">
<img src="https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-login.png?token=GHSAT0AAAAAACDEDGGPB74KWQJ64VWIWTKGZEZMLEA" alt="图片替换文本" width="250" height="444"  />

<img src="https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-register.png?token=GHSAT0AAAAAACDEDGGOSKWY5HTIVI4FAZA2ZEZMMAA" alt="图片替换文本" width="250" height="444"  style="margin-left:20px"/>
</div>



### 四个tab页
<div style="display:flex;align-items: center; margin-top:20px">
<img src="https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-home.png?token=GHSAT0AAAAAACDEDGGOPIYBS4VNG4J3DNNUZEZMMTQ" alt="图片替换文本" width="204" height="422"  />

<img src="https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-maillist.png?token=GHSAT0AAAAAACDEDGGOSUVSAXRGL5W7C6HKZEZMM5Q" alt="图片替换文本" width="204" height="422" style="margin-left:20px"/>
</div>

<div style="display:flex;align-items: center;margin-top:20px ">
<img src="https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-wechat-moment.png?token=GHSAT0AAAAAACDEDGGO67IZRESF55VSSF7SZEZMNLA" alt="图片替换文本" width="204" height="422"  />

<img src="https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-my.png?token=GHSAT0AAAAAACDEDGGOCDDI3N4SRYVIGBI4ZEZMNSA" alt="图片替换文本" width="204" height="422" style="margin-left:20px"/>
</div>



### 聊天页面

<div style="display:flex;align-items: center;margin-top:20px ">
<img src="https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-chat.png?token=GHSAT0AAAAAACDEDGGPM4NENGFK523BEY4CZEZMOSA" alt="图片替换文本" width="204" height="422"  />

<img src="https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-g-chat.png?token=GHSAT0AAAAAACDEDGGPF5N3IKOVT4J45ZOSZEZMO3A" alt="图片替换文本" width="204" height="422" style="margin-left:20px"/>
</div>


### 用户信息与群组信息
<div style="display:flex;align-items: center;margin-top:20px ">
<img src="https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-check-user.png?token=GHSAT0AAAAAACDEDGGPVDSQLAGWICOQDOU2ZEZMQCA" alt="图片替换文本" width="250" height="444"  />

<img src="https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-g-info.png?token=GHSAT0AAAAAACDEDGGP6ZZKK5WDBGDQX7SOZEZMPWA" alt="图片替换文本" width="250" height="444"  style="margin-left:20px"/>
</div>

### 发布朋友圈
<div style="display:flex;align-items: center;margin-top:20px ">
<img src="https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-p-moment.png" alt="图片替换文本" width="250" height="444"  />

<img src="https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-p-location.png" alt="图片替换文本" width="250" height="444"  style="margin-left:20px"/>
</div>

### 修改信息相关
<div style="display:flex;align-items: center;margin-top:20px ">
<img src="https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-c-b.png" alt="图片替换文本" width="250" height="444"  />

<img src="https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-changepwd.png" alt="图片替换文本" width="250" height="444"  style="margin-left:20px"/>
</div>

<div style="display:flex;align-items: center;margin-top:20px ">
<img src="https://raw.githubusercontent.com/UzumakiHan/static-files/master/images/vuechat-edit.png" alt="图片替换文本" width="250" height="444"  />


</div>

