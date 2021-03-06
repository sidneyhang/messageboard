// pages/login/login.js
var app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function(option) {
    var that = this;
    console.log(option);

  },
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      //插入登录的用户的相关信息到数据库
      wx.request({
        url: getApp().globalData.urlPath + '/register',
        method: "POST",
        data: {
          code: getApp().globalData.code,
          nickName: e.detail.userInfo.nickName,
          avatarUrl: e.detail.userInfo.avatarUrl,
          openid: ''
        },
        success: function(res) {
          console.log(res);
          var data = res.data;
          if (data.code === 200) {
            getApp().globalData.openid = data.data.openid;
          }
          that.queryUsreInfo();
          console.log("插入小程序登录用户信息成功！");
        }
      });

      wx.switchTab({
        url: '/pages/index/index'
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  //获取用户信息接口
  queryUsreInfo: function() {
    console.log(getApp().globalData);
    wx.request({
      url: getApp().globalData.urlPath + '/login/userinfo',
      method: "POST",
      data: {
        openId: getApp().globalData.openid
      },
      success: function(res) {
        console.log(res.data);
        var data = res.data;
        if (data.code === 200) {
          getApp().globalData.access_token = data.data.access_token;
          wx.setStorageSync("userInfo", data.data.userInfo);
          wx.setStorageSync("access_token", data.data.access_token);
        }
        console.log(getApp().globalData);
      }
    });
  },

})