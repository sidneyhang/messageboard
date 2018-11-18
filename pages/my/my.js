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
    eggCount: 0,
    modalShow: false
  },

  onLoad: function() {
    var userInfo = wx.getStorageSync("userInfo");
    var that = this;
    that.getUserInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getUserInfo();
  },

  getUserInfo: function() {
    var that = this;
    wx.request({
      url: app.globalData.urlPath + "/user",
      header: {
        "Authorization": app.globalData.access_token
      },
      success: res => {
        if (res.data.code === 200) {
          var data = res.data.data;
          that.setData({
            avatarUrl: data.avatarUrl,
            nickName: data.nickName,
            flowerCount: data.flowerCount,
            eggCount: data.eggCount
          })
        }
      }
    })
  },

  toPay: function() {
    wx.navigateTo({
      url: '/pages/my/pay/pay',
    })
  },
  signModal: function(e) {
    this.setData({
      modalShow: true
    })
  },
  closeModal: function(e) {
    wx.request({
      url: app.globalData.urlPath + "/signin",
      method: "POST",
      header: {
        "Authorization": app.globalData.access_token
      },
      success: res => {
        if (res.data.code === 200) {
          wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 2000
          });
          this.setData({
            modalShow: false
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
          this.setData({
            modalShow: false
          })
          return false;
        }
      }
    })
  }

})