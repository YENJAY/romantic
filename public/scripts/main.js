"use strict";!function(e){var o="http://localhost:9000",t="http://localhost:3000",i=e.location.host,n=e.location.port,r=e.location.hostname,a=e.location.protocol;"http://"+i!==o&&(o=a+"//"+i,t=n&&"80"!==n?a+"//"+r+":3000":a+"//"+i),e.R=e.R||{};var u=e.R;u.router={},u.getUserInfo=function(e){var o=t+"/api/users/"+e;return $.ajax({method:"get",url:o})},u.createUser=function(e){var o=t+"/api/users";return $.ajax({method:"post",url:o,data:{phone:e.phone,name:e.name,photo:e.photoUrl}})},u.likeOrUnlike=function(e,o,i){var n=t+"/api/users/"+e+"/";return n+=i?"like":"unlike",$.ajax({method:"post",url:n,data:{likeUid:o}}).then(function(e){console.log(e)})},u.uploadPhoto=function(e){var o=t+"/api/users/uploadPhoto";return $.ajax({method:"post",url:o,data:e,processData:!1,contentType:!1})},u.getLocalStorageUserInfo=function(){return JSON.parse(e.localStorage.getItem("userInfo"))},u.updateLocalStorageUserInfo=function(o){var t=u.getLocalStorageUserInfo();t&&(o.phone=o.phone||t.phone),e.localStorage.setItem("userInfo",JSON.stringify(o))},u.isFirstOpen=function(){var o=e.localStorage.getItem("isFirstOpen");return o?!1:(e.localStorage.setItem("isFirstOpen","false"),!0)},u.getWeixinToken=function(){var o=t+"/api/weixin";return $.ajax({method:"get",url:o,data:{url:e.location.href.split("#")[0]}})},u.weixinShareTitle="快来向我表白吧，喜欢我的人在哪里？这一次咱们别再错过了。",u.weixinShareImgUrl="http://ac-kckdyoqh.clouddn.com/d36dea6175d8f34b2ca5.png",u.weixinConfig=function(){u.getWeixinToken().then(function(o){e.wx.config({debug:!1,appId:o.appId,timestamp:o.timestamp,nonceStr:o.nonceStr,signature:o.signature,jsApiList:["onMenuShareAppMessage","onMenuShareTimeline"]}),e.wx.ready(function(){e.wx.onMenuShareAppMessage({title:u.weixinShareTitle,desc:"如果你喜欢 Ta，可以悄悄地告诉 Ta。假如你们一直互相喜欢对方，彼此都会收到一条短信。",link:e.location.href,imgUrl:u.weixinShareImgUrl,type:"link",dataUrl:"",success:function(){ga("send","pageview","/share-app-message")},cancel:function(){ga("send","pageview","/share-app-message-cancel")}}),wx.onMenuShareTimeline({title:u.weixinShareTitle,link:e.location.href,imgUrl:u.weixinShareImgUrl,success:function(){ga("send","pageview","/share-timeline")},cancel:function(){ga("send","pageview","/share-timeline-cancel")}})})})}}(window),$(function(){var e=window;e.C=e.C||{},C.CreateComponent=Vue.extend({template:"#create-tpl",data:function(){var e=this;ga("send","pageview","/create");var o=R.getLocalStorageUserInfo(),t={name:"",phone:"",photoUrl:""},i=!0,n=this.$route.query.uid,r=this.$route.query.isLike;return n&&(i=!1,R.getUserInfo(n).then(function(o){e.otherInfo=o,e.otherInfo.photoUrl=o.photo,e.userInfo.uid&&"undefined"!=typeof r&&R.likeOrUnlike(e.userInfo.uid,e.otherInfo.uid,Number(e.isLike))})),{userInfo:o||t,otherInfo:{name:"",phone:"",photoUrl:""},isLike:r,ui:{uploading:!1,isSelf:i,showConfirm:!1},tipWord:""}},methods:{uploadPhoto:function(){var e=this,o=$("#upload-file-form"),t=o.find("input[type=file]"),i=t[0].files,n=new window.FormData(o[0]);i.length?(this.ui.uploading=!0,R.uploadPhoto(n).then(function(o){e.userInfo.photoUrl=o.fileUrl})):(this.tipWord="你还没有选择「照片」",this.hideTooltip())},checkInfo:function(){return this.userInfo.photoUrl?this.userInfo.name?this.userInfo.phone?11!==this.userInfo.phone.length?(this.tipWord="「手机号码」位数不对",this.hideTooltip(),!1):/[^\d]/.test(this.userInfo.phone)?(this.tipWord="「手机号码」格式不正确",this.hideTooltip(),!1):!0:(this.tipWord="你还没有填写你的「手机号码」",this.hideTooltip(),!1):(this.tipWord="你还没有填写你的「姓名」",this.hideTooltip(),!1):(this.tipWord="你还没有「上传照片」",this.hideTooltip(),!1)},create:function(){var e=this;this.tipWord="提交中...",R.createUser(this.userInfo).then(function(o){e.userInfo.uid=o.uid,R.updateLocalStorageUserInfo(e.userInfo),"undefined"!=typeof e.isLike&&e.otherInfo&&e.otherInfo.uid&&R.likeOrUnlike(e.userInfo.uid,e.otherInfo.uid,Number(e.isLike)),R.router.go({path:"/like",query:{uid:o.uid}})})},hideTooltip:function(){var e=this;setTimeout(function(){e.tipWord=""},3e3)},showConfirm:function(){return this.checkInfo()?void(this.ui.showConfirm=!0):void ga("send","pageview","/checkInfo-error")},closeConfirm:function(){this.ui.showConfirm=!1,ga("send","pageview","/reset-info")},confirm:function(){this.create()}}}),Vue.component("create-component",C.CreateComponent)}),$(function(){var e=window;e.C=e.C||{},C.LikeComponent=Vue.extend({template:"#like-tpl",data:function(){var e=this;ga("send","pageview","/like");var o=this.$route.query.uid,t=!0,i=R.getLocalStorageUserInfo()||{};return i.uid!==o&&(t=!1),o?R.getUserInfo(o).then(function(o){e.userInfo=o,e.userInfo.photoUrl=o.photo,t&&R.updateLocalStorageUserInfo(e.userInfo),R.weixinShareTitle="快来向我表白吧，",o.likedCount||o.unlikedCount||(R.weixinShareTitle+="喜欢我的人在哪里？这一次咱们别再错过了！"),o.likedCount&&!o.unlikedCount&&(R.weixinShareTitle+="已有 "+o.likedCount+" 个人喜欢我，怎么没有你？"),o.unlikedCount&&!o.likedCount&&(R.weixinShareTitle+="我只收到了，"+o.unlikedCount+" 张好人卡，你快表白！"),o.likedCount&&o.unlikedCount&&(R.weixinShareTitle+="已有 "+o.likedCount+" 个人喜欢我，但是也收到了 "+o.unlikedCount+" 张好人卡。"),R.weixinShareImgUrl=o.photo,R.weixinConfig()},function(){R.router.go("/create")}):R.router.go("/create"),{userInfo:{},ui:{isSelf:t,showShare:!1,isLike:!1,showConfirm:!1}}},methods:{like:function(){var e=this;ga("send","pageview","/like-btn"),this.ui.isLike=!0,setTimeout(function(){e.confirm()},800)},unlike:function(){ga("send","pageview","/unlike-btn"),this.goToCreate()},back:function(){R.router.go("/create")},share:function(){this.ui.showShare=!0},unshare:function(){this.ui.showShare=!1},confirm:function(){this.goToCreate(!0)},closeConfirm:function(){this.ui.isLike=!1,this.ui.showConfirm=!1},goToCreate:function(e){R.router.go({path:"/create",query:{uid:this.userInfo.uid,isLike:e?1:0}})}}}),Vue.component("like-component",C.LikeComponent)}),$(function(){var e=window;e.C=e.C||{},e.R=e.R||{};var o=e.C,t=e.R,i=Vue.extend({});t.router=new VueRouter({hashbang:!1}),t.router.map({"/like":{component:o.LikeComponent},"/create":{component:o.CreateComponent}}),t.router.redirect({"*":"/create"}),t.router.start(i,"#romantic-app"),t.weixinConfig()});