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
        console.log(res);
        if (res.data.code === 200) {
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