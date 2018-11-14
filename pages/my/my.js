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
    this.data.avatarUrl = userInfo.avatarUrl;
    this.data.nickName = userInfo.nickName;

    console.log(this.data);
  }


})