import api from '../../api/api.js'
import util from '../../utils/util.js'
const app = getApp();
const ctx = wx.createCanvasContext('myCanvas')
Page({
  data: {
    Width:'',//画布宽度
    Height: '',//画布高度
    pixelRatio:'',//像素比
    text_x: 20, //x轴
    text_y: 260, //y轴
    imageUrl: '',  // 生成的图片路径
    showst: false, //是否完成图片和文字的填入
    sytext: '', //文本
    picw:'',//图片的原始宽
    pich: ''//图片的原始高
  },
  onLoad:function(){
    var pic = app.globalData.pic;
    var text = app.globalData.text;
    console.log(pic);
    console.log(text);

    //获取图片信息并绘制
     this.drawpic(pic);
    this.drawword(text);
  
    var Width = wx.getSystemInfoSync().windowWidth;
    var Height = wx.getSystemInfoSync().windowHeight;
    var pixelRatio= wx.getSystemInfoSync().pixelRatio;
    this.data.Width = Width;
    this.data.Height = Height;
    this.data.pixelRatio = pixelRatio;
  },
  drawpic:function(pic) { //选择图片
       var _this=this;
        wx.getImageInfo({
          src: pic,
          success: function (res2) {
            console.log('进来了');
            var pw=_this.data.picw = res2.width;
            var ph=_this.data.pich = res2.height;
            var ww = _this.data.Width;
            var wh = _this.data.Height;
            //计算宽度比 =图片宽/屏幕宽
            var wp=pw/ww;
            // console.log(wp)

            // console.log(res2.width)
            // console.log(res2.height)
            // console.log(res2)
    
        console.log(wx.getSystemInfoSync().pixelRatio)
        // _this.setData({
        //   // imageUrl: res.tempFilePaths[0]
        // })
        // console.log('w:' + res2.width)
        // console.log('w1:' + _this.data.picw)
        // console.log('w2:' + _this.data.Width)
        ctx.save()
        ctx.setFillStyle('#fff')
        ctx.fillRect(0, 0, _this.data.Width, _this.data.Height);
        ctx.drawImage(res2.path, 0, 0, pw, pw, 20, 20, _this.data.Width - 40, _this.data.Width)
        // ctx.draw()
        // ctx.draw(true)
        ctx.restore()
          }
        })   
        var text = app.globalData.text;
        // this.drawword(text);
  },
  drawword:function(text) { //文字
    // this.setData({
    //   sytext: e.detail.value,
    //   content: text
    ctx.restore()
    // })
    console.log('写字')
    console.log(text)
    ctx.setFontSize(16)
    ctx.setFillStyle("#F00");
    ctx.fillText(text, 20,400)
    ctx.draw(true)
    // this.setData({
    //   showst: true
    // })
  },
  Okgenerate() { //生成图片方法
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
        wx.saveImageToPhotosAlbum({  //保存生成的图片到手机相册里
          filePath: res.tempFilePath,
          success(res) {
            // app.showToasts('保存成功')
            _this.setData({
              showst: true
            })
          }
        })
      }
    })
  }

})