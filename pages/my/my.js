// pages/my/my.js

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",
    nickName: "",
    flowerCount: 0,
    eggCount: 0
  },

  onLoad: function() {

    console.log(app.globalData);
    var userInfo = wx.getStorageSync("userInfo");
    var that = this;
    that.setData({
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName,
      flowerCount: userInfo.flowerCount,
      eggCount: userInfo.eggCount
    })
    console.log(this.data);
  },

  toPay: function() {
    wx.navigateTo({
      url: '/pages/my/pay/pay',
    })
  }


})