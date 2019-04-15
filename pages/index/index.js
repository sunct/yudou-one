import api from '../../api/api.js'
import util from '../../utils/util.js'
const app = getApp();
var dateUtils = require("../../utils/dateUtils.js")
var time_str = '';
var year = '';
var month = '';
var day = '';
var imageWidth = '';
var uid = '';
var delid = '';
Page({
  data: {
    vols: [],
    current: 1,
    arr: [],
    cur_year: [],
    cur_month: [],
    now_year: [],
    now_month: [],
    select_month: [],
    weeks_ch: [],
    cur_day: [],
    now_day: [],
    click_day: [],
    sInfo: [],
    showModalStatus: false,
    comment: [],
    nocheckcomment: [],

  },
  onLoad: function (options) {
    // console.log(options);
    //获取uid
    if (!app.globalData.uid) {
      try {
        var uid = wx.getStorageSync('uid');
        if (uid) {
          app.globalData.uid = uid;
        }
      } catch (e) {
        // Do something when catch error
      }
    }

      // let uid = app.globalData.uid;
      // console.log(uid)
      //获取日历数据
      var all_calendar_data = dateUtils.all_calendar_data();
      var scrollViewHeight = all_calendar_data.scrollViewHeight;
      var gridwidth = all_calendar_data.gridwidth;
      var now_year = this.data.now_year = all_calendar_data.cur_year;
      var now_month = this.data.now_month = all_calendar_data.cur_month;
      var weeks_ch = this.data.weeks_ch = all_calendar_data.weeks_ch;
      var now_day = this.data.now_day = all_calendar_data.cur_day;
      var days = all_calendar_data.days;
      var prev_month_days = all_calendar_data.showPrevDays;
      var next_month_days = all_calendar_data.showNextDays;
      //获取今天的句子信息
      //日期拼接
      if (!(options && options.time_str)) {
        var cur_year = this.data.cur_year = all_calendar_data.cur_year;
        var cur_month = this.data.cur_month = all_calendar_data.cur_month;
        var cur_day = this.data.cur_day = all_calendar_data.cur_day;
        time_str = cur_year + '-' + dateUtils.handleNum(cur_month) + '-' + dateUtils.handleNum(cur_day);

      } else {
        var strs = new Array(); //定义一数组 
        time_str = options.time_str;
        strs = time_str.split("-"); //字符分割 
        var cur_year = parseInt(strs[0]);
        var cur_month = parseInt(strs[1]);
        var cur_day = parseInt(strs[2]);
        this.changeStyle(cur_year, cur_month, cur_day, 1);
      }
      this.getTodaySinfo(time_str, 0);

      this.setData({
        calendardata: {
          scrollViewHeight: scrollViewHeight,
          gridwidth: gridwidth,
          cur_year,
          cur_month,
          now_year,
          now_month,
          weeks_ch,
          cur_day,
          now_day,
          days,
          prev_month_days,
          next_month_days,
        },

      });

    },

  //获取所查看今天的数据,time :时间;dir:方向 -1 左0 中 1 右 2 不触发
  getTodaySinfo: function (time, dir) {
    var that=this;
    var sInfo = this.data.sInfo;
    var is_exist=false;
    api.getSinfo({
      query: {
        time: time,
      },
      success: (res) => {
        if (res.data.code == 1) {
          let newSInfo = res.data.data;
          console.log(newSInfo)
          //获取评论
          this.getNotCheckComment(newSInfo[0]['id']);
          this.getComment(newSInfo[0]['id']);
          //左拉
          if (dir == -1 && newSInfo != false) {
            is_exist= that.is_exist(sInfo, newSInfo);
            if (!is_exist){
              sInfo.unshift(newSInfo[0]);
            }
           
          }
          //右划
          if (dir == 1 && newSInfo != false) {
            is_exist = that.is_exist(sInfo, newSInfo);
            if (!is_exist) {
              sInfo.push(newSInfo[0]);
            }
           
          }
          if (dir == 0 && newSInfo != false) {
            sInfo.push(newSInfo[0]);
          }
          if (dir == 2 && newSInfo != false) {
            sInfo = [];
            sInfo[0] = newSInfo[0];
          }
          this.data.sInfo = sInfo;
          console.log(sInfo)
          this.setData({ sInfo })
        }
      }
    })

  },
  //是否存在该图文
  is_exist: function (sInfo, newSInfo){
    var sInfo_length = sInfo.length;
    for (var i = 0; i < sInfo_length; i++) {
      if (newSInfo[0]['id'] == sInfo[i]['id']) {
        return true;
      }
    }
    return false; 

  },
  //获取自己（登录的情况下）未审核的留言
  getNotCheckComment: function ($sid) {
    let uid = app.globalData.uid;
    api.getNotCheckComment({
      query: {
        sid: $sid,
        uid: uid,
      },
      success: (res) => {
        if (res.data.code == 1) {
          // console.log(res.data);
          this.data.nocheckcomment = res.data.data;
          this.setData({ nocheckcomment: res.data.data, uid: uid, delid: '' })
        }

      }
    })
  },
  //获取留言
  getComment: function ($sid) {
    let uid = app.globalData.uid;
    api.getComment({
      query: {
        sid: $sid,
      },
      success: (res) => {
        // console.log(res);
        if (res.data.code == 1) {
          // console.log(res.data);
          this.data.comment = res.data.data;
          this.setData({ comment: res.data.data, uid: uid, delid: '' })
        }
      }
    })

  },
  //拖动加载图文
  handleChange: function (e) {
    //获取相关划动的信息
    let current = e.detail.current;
    let volsLength = this.data.sInfo.length;
    //获取当前时间
    var cur_year = this.data.cur_year;
    var cur_month = this.data.cur_month;
    var cur_day = this.data.cur_day;
    //记录当前 current
    var now_current = this.data.current;
    // console.log('cur_year:' + cur_year);
    // console.log('cur_month:' + cur_month);
    // console.log('cur_day:' + cur_day);
    // console.log('current:'+current);
    // console.log('volsLength:' + volsLength);
    //两种特殊情况,初始时左右全无数据
    if (current === 0) {
      //时间处理,-1天
      var time_arr = dateUtils.handleTime(cur_year, cur_month, cur_day, '-1');
      var time_str = time_arr.time_str;
      year = this.data.cur_year = time_arr.year;
      month = this.data.cur_month = time_arr.month;
      day = this.data.cur_day = time_arr.day;

      //如果小于2018-05-01
      //如果超过今天则不显示
      if ((year < 2018) || (year <= 2018 && month < 5) || (year <= 2018 && month <= 5 && day < 1)) {

        year = 2018;
        month = 5;
        day = 1;
        //记录当前 current
        this.data.current = 1;

      } else {
        // console.log('herr')
        // console.log(time_str)
        this.getTodaySinfo(time_str, -1);
      }
      this.setData({
        current: current + 1
      })

    } else if (current === volsLength + 1) {
      //时间处理,+1天
      var time_arr = dateUtils.handleTime(cur_year, cur_month, cur_day, '+1');
      // console.log(time_arr);
      var time_str = time_arr.time_str;
      year = this.data.cur_year = time_arr.year;
      month = this.data.cur_month = time_arr.month;
      day = this.data.cur_day = time_arr.day;
      var now_year = this.data.now_year;
      var now_month = this.data.now_month;
      var now_day = this.data.now_day;
      // console.log(day);
      // console.log(now_day);
      //如果超过今天则不显示
      if (year >= now_year && month >= now_month && day > now_day) {
        console.log('超过最大值');
        year = this.data.cur_year = now_year;
        month = this.data.cur_month = now_month;
        day = this.data.cur_day = now_day;

        //记录当前 current
        this.data.current = current - 1;
        this.setData({
          current: current - 1,
        })

      } else {
        //记录当前 current
        this.data.current = current;
        this.getTodaySinfo(time_str, 1);
        this.setData({
          current: current
        })
      }

    } else {
      //如果在当前列表中，来回拖动后存储的列表
      //如果是向左划，日期 -1
      
      if (now_current > current) {
        //时间处理,-1天
        var time_arr = dateUtils.handleTime(cur_year, cur_month, cur_day, '-1');
        var time_str = time_arr.time_str;
        year = this.data.cur_year = time_arr.year;
        month = this.data.cur_month = time_arr.month;
        day = this.data.cur_day = time_arr.day;
        this.data.current = current;
        //如果是向右划 日期 +1
      } else if (now_current < current) {
        var time_arr = dateUtils.handleTime(cur_year, cur_month, cur_day, '+1');
        var time_str = time_arr.time_str;
        year = this.data.cur_year = time_arr.year;
        month = this.data.cur_month = time_arr.month;
        // console.log('+1:' + time_arr.day);
        day = this.data.cur_day = time_arr.day;

        this.data.current = current;
      }
      //滑动获取相关评论
      //先获取id
      let sid = this.data.sInfo[current - 1]['id'];
      this.getComment(sid);
      this.getNotCheckComment(sid);
    }


    //总if else 结束
    //改变下方日历
    this.changeStyle(year, month, day);
  },

  //显示对话框
  showModal: function () {
    // console.log('show');
    var showStatus = this.data.showModalStatus;
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(500).step();
    this.data.showModalStatus = !showStatus;
    //  console.log(this.data.showModalStatus)
    if (showStatus == false) {
      showStatus = true;
      this.setData({
        animationData: animation.export(),
        showModalStatus: showStatus
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    } else {
      showStatus = false;
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus: showStatus
        })
      }.bind(this), 200)
    }
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(500).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  //点击日历月份切换
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const now_year = this.data.now_year;
    var cur_month = this.data.cur_month;
    const now_month = this.data.now_month;
    const weeks_ch = this.data.weeks_ch;
    const now_day = this.data.now_day;
    const select_month = this.data.select_month;

    if (select_month != 0) {
      cur_month = select_month;
    }

    var handledata = dateUtils.handleCalendar(handle, cur_year, cur_month);
    var scrollViewHeight = handledata.scrollViewHeight;
    var gridwidth = handledata.gridwidth;
    var newYear = this.data.cur_year = handledata.newYear;
    var newMonth = this.data.cur_month = this.data.select_month = handledata.newMonth;
    // this.data.select_month = newMonth;
    var days = this.data.days = handledata.days;
    var prev_month_days = handledata.showPrevDays;
    var next_month_days = handledata.showNextDays;

    this.setData({
      calendardata: {
        scrollViewHeight: scrollViewHeight,
        gridwidth: gridwidth,
        cur_year: newYear,
        cur_month: newMonth,
        now_year: now_year,
        now_month: now_month,
        weeks_ch,
        now_day,
        days,
        prev_month_days,
        next_month_days,
      }
    })
  },

  //点击选择日期切换操作
  selectDate(e) {
    const year = e.currentTarget.dataset.year;
    const month = e.currentTarget.dataset.month;
    const day = e.currentTarget.dataset.day;
    this.changeStyle(year, month, day, 1)
  },
  //点击或切换改变日历样式
  changeStyle: function (year, month, day, ifchangeinfo) {
    //点击日期操作
    var styleStatus = false;
    const now_year = this.data.now_year;
    const now_month = this.data.now_month;
    const now_day = this.data.now_day;
    const cur_month = this.data.cur_month;
    this.data.select_month = cur_month;
    //如果是今天（包括今天）以前则显示绿色，否则显示橙色
    //显示样式
    if (((year <= now_year) && (month < now_month)) || ((year <= now_year) && (month == now_month) && (day <= now_day))) {
      styleStatus = true;

      if (ifchangeinfo == 1) {
        var time_str = year + '-' + dateUtils.handleNum(month) + '-' + dateUtils.handleNum(day);
        this.getTodaySinfo(time_str, 2);
        this.data.cur_year = year;
        this.data.cur_month = month;
        this.data.cur_day = day;
        this.setData({
          current: 1
        })
      }
      //联动图文处理

    } else {
      styleStatus = false;
    }
    this.setData({
      click_day: {
        year: year,
        month: month,
        day: day,
        styleStatus
      }
    })

  },
  //删除自己的留言
  delComment: function (e) {
    let that = this;
    let comment = that.data.comment;
    let nocheckcomment = that.data.nocheckcomment;
    let id = e.currentTarget.id;
    let ctype = e.currentTarget.dataset.ctype;
    //获取列表中要删除项的下标 
    var index = e.target.dataset.index;
    api.delComment({
      query: {
        id: id
      },
      success: (res) => {
        if (res.data.code == 1) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
          })
          if (ctype == 1) {
            //移除列表中下标为index的项 
            comment.splice(index, 1);
          } else if (ctype == 0) {
            //移除列表中下标为index的项 
            nocheckcomment.splice(index, 1);
          }
        }
        that.setData({
          comment: comment,
          nocheckcomment: nocheckcomment,
          delid: id,
        })
      }
    })

  },
  //放大图片
  //图片点击事件
  seePic: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgArr = [];
    var imgList = event.currentTarget.dataset.list;//获取data-list
    imgArr.push(imgList);
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgArr // 需要预览的图片http链接列表
    })

  },
  //返回今天
  goToday: function () {
    this.hideModal();
    const now_year = this.data.now_year;
    const now_month = this.data.now_month;
    const now_day = this.data.now_day;

    this.changeStyle(now_year, now_month, now_day, 1);

  },
  //关于
  aboutMe: function () {
    this.hideModal();
    wx.navigateTo({ url: '../about/about' })
  },
  //写留言
  comment: function (e) {
    let sid = e.currentTarget.id;
    wx.navigateTo({ url: '../comment/comment?sid=' + sid });
  },
  //分享
  onShareAppMessage: function (res) {
    //获取当前页面的时间参数
    var year = this.data.cur_year;
    var month = this.data.cur_month;
    var day = this.data.cur_day;
    var time_str = year + '-' + dateUtils.handleNum(month) + '-' + dateUtils.handleNum(day);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: '雨微如酥，豆小情深',
      desc: '有你，世界才更有趣！',
      path: '/pages/index/index?time_str=' + time_str,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})
