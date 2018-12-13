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
    modalShow: false,
    isIOS: true
  },

  onLoad: function() {
    var userInfo = wx.getStorageSync("userInfo");
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        if (res.platform != "ios") {
          that.setData({
            isIOS: false
          })
        }
      }
    })
    that.getUserInfo();
  },

  getUserInfo: function() {
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
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
          userInfo.avatarUrl = data.avatarUrl;
          userInfo.nickName = data.nickName;
          userInfo.flowerCount = data.flowerCount;
          userInfo.eggCount = data.eggCount;
          wx.setStorageSync("userInfo", userInfo);
        } else if (res.data.code === 1000) {
          wx.navigateTo({
            url: '/pages/login/login',
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
    var that = this;
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
          });
          that.getUserInfo();
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
  },

  onShow: function () {
    this.getUserInfo();
    this.countNoReadMsg();
  },

  countNoReadMsg: function () {
    var accessToken = wx.getStorageSync("access_token");
    wx.request({
      url: app.globalData.urlPath + "/messages/noread",
      method: "GET",
      header: {
        "Authorization": accessToken
      },
      success: res => {
        if (res.data.code === 200) {
          var noread = res.data.data.noread;
          if (noread != 0) {
            wx.setTabBarBadge({
              index: 1,
              text: noread.toString()
            })
          } else {
            wx.hideTabBarRedDot({
              index: 1,
            })
          }
        }
      }
    })
  }

})