import api from '../../api/api.js'
import util from '../../utils/util.js'
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    uid: '0',
    nocheckcommentall: [],
    editIndex: 0,
    delBtnWidth: 150, //删除按钮宽度单位（rpx）
    display: 'display-none', //回复留言窗口
    cid: '', //留言id

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取uid
    var that = this;
    if (!app.globalData.uid) {
      try {
        var uid = wx.getStorageSync('uid');
        if (uid) {
          that.data.uid = app.globalData.uid = uid;
        } else {
          wx.navigateTo({
            url: '../index/index'
          });
        }
      } catch (e) {
        // Do something when catch error

      }
    } else {
      that.data.uid = app.globalData.uid;
    }
    //获取未审核的留言
    this.getNotCheckCommentAll();
    // console.log(that.data.uid);
    // var list = that.data.nocheckcommentall;
    this.setData({
      display: that.data.display,
    });
  },
  //切换tab
  swiperTab: function (e) {
    var that = this;
    that.data.currentTab = e.detail.current;
    that.getNotCheckCommentAll();
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    console.log(e);
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.data.currentTab = e.target.dataset.current;
      that.getNotCheckCommentAll();
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //获取未审核的留言
  getNotCheckCommentAll: function() {
    let uid = this.data.uid;
    var ltype=this.data.currentTab;
    console.log(ltype);
    api.getNotCheckCommentAll({
      query: {
        uid: uid,
        ltype: ltype,
      },
      success: (res) => {
        console.log(res)
        if (res.data.code == 1) {
          // console.log(res.data);
          this.data.nocheckcomment = res.data.data;
          this.setData({
            nocheckcommentall: res.data.data,
            uid: uid,
            delid: ''
          })
        }

      }
    })
  },
  //手指刚放到屏幕触发
  touchS: function(e) {
    // console.log("touchS" + e);
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
    }
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM: function(e) {
    // console.log("touchM:");
    // console.log(e);
    var that = this
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = that.data.startX - moveX;
      //delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      var list = that.data.nocheckcommentall;
      //将拼接好的样式设置到当前item中
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        nocheckcommentall: list
      });
    }
  },
  touchE: function(e) {
    // console.log("touchE" + e);
    var that = this
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = that.data.nocheckcommentall;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      that.setData({
        nocheckcommentall: list
      });
    }
  },
  //下拉刷新
  onPullDownRefresh: function() {
    var that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function() {
      // complete
      that.getNotCheckCommentAll();
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  //关闭弹窗X
  closebox: function(e) {
    // console.log(this.data.display)
    this.setData({
      display: 'display-none',
    })

  },
  //点击回复留言
  replycomment: function(e) {
    var that = this;
    var cid = e.target.dataset.id;
    var display = that.data.display;
    that.setData({
      cid: cid,
      display: 'display-block',
    })

  },
  //提交回复
  bindFormSubmitComment: function(e) {
    console.log(e)
    var that = this;
    var uid = this.data.uid;
    var cid = e.detail.value.cid;
    var replyfid = e.detail.formId;
    var replycontent = e.detail.value.replycontent;
    if (!replycontent) {
      wx.showToast({
        title: '请输入回复内容',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    api.replyComment({
      query: {
        cid: cid,
        uid: uid,
        replyfid: replyfid,
        replycontent: replycontent,
      },
      success: (res) => {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000,
        })
        if (res.data.code == 1) {
          that.setData({
            display: 'display-none',
          })
        } else {

        }
      }
    })

  },
  //审核通过
  checkcomment: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否要通过审核？',
      success: function(res) {
        if (res.confirm) {
          let id = e.currentTarget.dataset.id;
          //获取列表中要删除项的下标 
          var index = e.target.dataset.index;
          var nocheckcommentall = that.data.nocheckcommentall;
          let uid = that.data.uid;
          api.checkComment({
            query: {
              id: id,
              uid: uid,
            },
            success: (res) => {
              console.log(res)
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000,
              })
              
              if (res.data.code == 1) {
                //移除列表中下标为index的项 
                console.log("index" + index)
                nocheckcommentall.splice(index, 1);
                that.setData({
                  //更新列表的状态 
                  nocheckcommentall: nocheckcommentall,
                })
              } else {
                console.log(111)
                console.log(nocheckcommentall);
                that.setData({
                  havecomment: false,
                })
              }

            }
          })

        } else {

        }
      }
    })
  },

})