// pages/my/my.js
const util = require('../../utils/util.js');
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
        console.log(res);
        if (res.platform != "ios") {
          that.setData({
            isIOS: false
          })
        }
      }
    })
    that.getUserInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getUserInfo();
    util.countNoReadMsg();
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
  }

})