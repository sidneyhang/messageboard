// pages/userlist/userlist.js

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friends: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.request({
      url: app.globalData.urlPath + "/friends",
      header: {
        "Authorization" : app.globalData.access_token
      },
      success: res => {
        if (res.data.code === 200) {
          that.setData({
            friends: res.data.data
          });
        }
      }
    })

  },

  toPubMsg: function(e) {
    var that = this;
    wx.setStorageSync("targetUser", e.currentTarget.dataset.userid);
    wx.navigateTo({
      url: '/pages/pubmsg/pubmsg',
    })
  }

 
})