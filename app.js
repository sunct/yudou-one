App({
  globalData: {
    pic:'',
    text:'',
    uid:'',

  },
  onLaunch: function () {
    console.log("%c欢迎使用【雨豆】小程序","color:#22CB64");
  },
  onShow: function () {
    console.log("%c", "background:url(https://img.sunsanmiao.cn/yudou/yudou-64X64.png) no-repeat;padding:32px;line-height:80px");
  },

})