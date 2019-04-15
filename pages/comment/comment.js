import api from '../../api/api.js'
import util from '../../utils/util.js'
const app = getApp();
Page({
  data: {
    islogin: false,
    havecomment: false,
    manage:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    sid: '',
    nickName: '',
    avatarUrl: '',
    encryptedData:'',
    iv:'',

  },
  onLoad: function (options) {
    let islogin = false;
    var that = this;
    this.data.sid = options.sid;
    var manage = false;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          console.log('你已经登陆，请开始你的一顿骚操作:');
          islogin = that.data.islogin = true;
          
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              if (!app.globalData.uid){
                console.log('去登陆啦');
                that.onlogin(res);
              }
              // console.log(res)
              that.data.nickName = res.userInfo.nickName;
              that.data.avatarUrl = res.userInfo.avatarUrl;
              that.data.encryptedData = res.encryptedData;
              that.data.iv = res.iv;
              
            }
          })
        } else {
          console.log('我需要登录');
          islogin = that.data.islogin = false;
        }
        let uid = app.globalData.uid;
        if(uid==2){
          manage=true;
        }
        that.setData({
          islogin: islogin,
          manage: manage,
          havecomment: that.data.havecomment,

        })
      }
    })

  },
  onlogin: function (e){
    // console.log(e.encryptedData)
    var that=this;
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log('在登陆中 ……');
          // console.log(res);
          //发起网络请求
          api.onLogin({
            query: {
              code: res.code,
              encryptedData: e.encryptedData,
              iv:e.iv,
              nickName: e.userInfo.nickName,
              avatarUrl: e.userInfo.avatarUrl,

            },
            success: (res2) => {
              console.log('登录成功！')
              if (res2.data.code == 1) {
                wx.setStorageSync('uid', res2.data.data.id);
                app.globalData.uid = res2.data.data.id;
                that.setData({
                  islogin: true,
                })
              }
              }
          })
     
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
  //登录通知


  bindGetUserInfo: function (e) {
    console.log(e)
    this.data.islogin = true;
    this.data.nickName = e.detail.userInfo.nickName;
    this.data.avatarUrl = e.detail.userInfo.avatarUrl;
    this.data.encryptedData = e.detail.encryptedData;
    this.data.iv = e.detail.iv;
    this.onlogin(e.detail);

  },
  //审核
  manage:function(e){
    wx.navigateTo({ url: '../manage/manage'});
  },

  formSubmit: function (e) {
    console.log('你输入的内容是：', e.detail.value);

    var fid = e.detail.formId;
    console.log(fid);
    let content = e.detail.value.content;
    if (content == "" || content == null || content == undefined || content.replace(/(^s*)|(s*$)/g, "").length == 0) {
      return false;
    } else {
      console.log('用户信息获取');
      let nickName = this.data.nickName;
      let avatarUrl = this.data.avatarUrl;
      if (!(nickName && avatarUrl)){
        return false;

      }
      console.log('开始请求');
      let uid = app.globalData.uid;
      api.sComment({
        query: {
          sid: this.data.sid,
          content: content,
          nickName: nickName,
          avatarUrl: avatarUrl,
          uid:uid,
          fid:fid,
        },
        success: (res) => {
          
          if (res.data.code == 1) {
            console.log('留言成功');
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000,
            })
            this.setData({
              id: res.data.data,
              content: content,
              nickName: nickName,
              avatarUrl: avatarUrl,
              havecomment: true,
              value: '',
            })

          } else {
            this.setData({
              havecomment: false,
            })
          }

        }
      })
    }
  },
  //删除留言
  delComment: function (e) {
    let that = this;
    let id = e.currentTarget.id;
    // console.log(id)
    api.delComment({
      query: {
        id: id
      },
      success: (res) => {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000,
        })
        that.setData({
          havecomment: false,
        })
      }
    })

  },

})