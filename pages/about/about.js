import api from '../../api/api.js'
import util from '../../utils/util.js'
var content = '';
Page({
  data: {
    content: [],
  },
  onLoad: function () {
    this.getAboutinfo(2);
  },
  //获取about信息
  getAboutinfo: function (thistype) {
    api.getAbout({
      query: {
        type: thistype,
      },
      success: (res) => {
        if (res.data.code == 1) {
          content = res.data.data[0];
          this.setData({ content })
        }
      }
    })
  },
  //分享
  onShareAppMessage: function (res) {
    return {
      title: '雨微如酥，豆小情深',
      desc: '有你，世界才更有趣！',
      path: '/pages/about/about',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})
