import api from '../../api/api.js'
import util from '../../utils/util.js'
const app = getApp();
const ctx = wx.createCanvasContext('myCanvas')
Page({
  data: {
    Width: '',//画布宽度
    Height: '',//画布高度
    pixelRatio: '',//像素比
    text_x: 20, //x轴
    text_y: 260, //y轴
    imageUrl: '',  // 生成的图片路径
    showst: false, //是否完成图片和文字的填入
    sytext: '', //文本
    picw: '',//图片的原始宽
    pich: '',//图片的原始高
    defaultImg:'/image/defaultImg.png'
  },
  onLoad: function () {
    app.globalData.userInfo;
    var Width = wx.getSystemInfoSync().windowWidth;
    var Height = wx.getSystemInfoSync().windowHeight;
    var pixelRatio = wx.getSystemInfoSync().pixelRatio;
    this.data.Width = Width;
    this.data.Height = Height;
    this.data.pixelRatio = pixelRatio;
    this.setData({
      imageUrl:this.data.defaultImg

    })
  },
  chooseImageFun() { //选择图片
    console.log('选择图片');
    var _this = this
    wx.chooseImage({
      count: 1, // 默认9
      // sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      success: function (res) {
        var that = this;
        console.log(res)
        //存全局
        app.globalData.pic = res.tempFilePaths[0];
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function (res2) {

            console.log('res2')
            console.log(res2)
            var pw = _this.data.picw = res2.width;
            var ph = _this.data.pich = res2.height;
            var ww = _this.data.Width;
            var wh = _this.data.Height;
            //计算宽度比 =图片宽/屏幕宽
            var wp = pw / ww;
            console.log(wp)
            console.log(res2.width)
            console.log(res2.height)
            console.log(res)
            console.log(wx.getSystemInfoSync().pixelRatio)
            _this.setData({
              imageUrl: res.tempFilePaths[0]
            })
          }
        })
      }
    })
  },
  InputFuns(e) { //文字
    var sytext=e.detail.value;
    app.globalData.text=sytext;
    console.log(sytext)
    this.setData({
      sytext: e.detail.value,
      content: this.data.sytext

    })
    ctx.setFontSize(16)
    ctx.setFillStyle("#000");
    ctx.fillText(this.data.sytext, this.data.text_x, this.data.picw)
    ctx.draw(true)
    this.setData({
      showst: true
    })
  },
  Okgenerate() { //生成图片方法
    wx.navigateTo({
      url: 'draw'
    })
    console.log('我是不是该跳了')
    var _this = this
    this.setData({
      showst: false
    })
    wx.canvasToTempFilePath({ //生成图片
      x: 0,
      y: 0,
      width: this.data.Width * this.data.pixelRatio,
      height: this.data.Height * this.data.pixelRatio,
      // destWidth: this.data.Width,
      // destHeight: this.data.Height,
      quality: 1,
      canvasId: 'myCanvas',
      success: function (res) {
        wx.navigateTo({
          url: 'page/draw/draw?user_id=111'
        })
        // wx.saveImageToPhotosAlbum({  //保存生成的图片到手机相册里
        //   filePath: res.tempFilePath,
        //   success(res) {
        //     // app.showToasts('保存成功')
        //     _this.setData({
        //       showst: true
        //     })
        //   }
        // })
      }
    })
  }

})