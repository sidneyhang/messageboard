// pages/my/my.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",
    nickName: ""
  },

  onLoad: function() {
    var userInfo = wx.getStorageSync("userInfo");
    var that = this;
    that.setData({
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName
    })
    console.log(this.data);
  },

  toPay: function() {
    wx.navigateTo({
      url: '/pages/my/pay/pay',
    })
  }


})