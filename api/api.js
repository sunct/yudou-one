const host = 'https://api.sunsanmiao.cn';
const my_key = '5ldghvxbd';

const wxRequest = (params, url) => {
  // wx.showLoading({
  //   title: '加载中',
  //   icon: 'loading',
  //   duration: 1000
  // }),
    wx.request({
      url: url,
      method: params.method || 'POST',
      data: params.data || {},
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        params.success && params.success(res)
        // wx.hideLoading()
      },
      fail: (res) => {
        params.fail && params.fail(res)
      },
      complete: (res) => {
        params.complete && params.complete(res)
      }
    })
}

// Index
//获取首页信息
const getSinfo = (params) => wxRequest(params, host + '/api/sindex?key=' + my_key + '&time=' + params.query.time);
//获取关于信息
const getAbout = (params) => wxRequest(params, host + '/api/about?key=' + my_key + '&type=' + params.query.type);
//留言评价
const sComment = (params) => wxRequest(params, host + '/api/scomment?key=' + my_key + '&sid=' + params.query.sid + '&content=' + params.query.content + '&nickName=' + params.query.nickName + '&avatarUrl=' + params.query.avatarUrl + '&uid=' + params.query.uid + '&fid=' + params.query.fid);
//获取留言评价
const getComment = (params) => wxRequest(params, host + '/api/getcomment?key=' + my_key + '&sid=' + params.query.sid);
//获取未审核的留言评价（用户自己查看自己的）
const getNotCheckComment = (params) => wxRequest(params, host + '/api/getnotcheckcomment?key=' + my_key + '&sid=' + params.query.sid + '&uid=' + params.query.uid);
//删除评价
const delComment = (params) => wxRequest(params, host + '/api/delcomment?key=' + my_key + '&id=' + params.query.id);
//登录
const onLogin = (params) => wxRequest(params, host + '/api/onLogin?key=' + my_key + '&code=' + params.query.code + '&encryptedData=' + params.query.encryptedData + '&iv=' + params.query.iv + '&nickName=' + params.query.nickName + '&avatarUrl=' + params.query.avatarUrl);
//获取未审核的所有留言评价
const getNotCheckCommentAll = (params) => wxRequest(params, host + '/api/gernotcheckcommentall?key=' + my_key + '&uid=' + params.query.uid + '&ltype=' + params.query.ltype);
//审核用户的评价并发送通知
const checkComment = (params) => wxRequest(params, host + '/api/checkcomment?key=' + my_key + '&id=' + params.query.id + '&uid=' + params.query.uid);
//回复留言
const replyComment = (params) => wxRequest(params, host + '/api/replycomment?key=' + my_key + '&cid=' + params.query.cid + '&uid=' + params.query.uid + '&replycontent=' + params.query.replycontent + '&replyfid=' + params.query.replyfid);


module.exports = {
  getSinfo,
  getAbout,
  sComment,
  getComment,
  getNotCheckComment,
  delComment,
  onLogin,
  getNotCheckCommentAll,
  checkComment,
  replyComment,
}
