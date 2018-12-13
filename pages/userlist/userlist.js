// pages/userlist/userlist.js

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friends: {},
    keyword: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.getUserList();
  },

  keywordInput: function(e) {
    this.setData({
      keyword: e.detail.value
    })
  },

  toPubMsg: function(e) {
    var that = this;
    wx.setStorageSync("targetUser", e.currentTarget.dataset.userid);
    wx.navigateTo({
      url: '/pages/pubmsg/pubmsg',
    })
  },

  attention: function(e) {
    var that = this;
    var targetUser = e.currentTarget.dataset.userid;
    wx.request({
      url: app.globalData.urlPath + "/attention/" + parseInt(targetUser),
      method: "POST",
      header: {
        "Authorization": app.globalData.access_token
      },
      success: res => {
        if (res.data.code === 200) {
          that.getUserList();
          wx.showToast({
            title: '已关注',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  cancelAttention: function(e) {
    var that = this;
    var targetUser = e.currentTarget.dataset.userid;

    wx.request({
      url: app.globalData.urlPath + "/attention/" + parseInt(targetUser),
      method: "DELETE",
      header: {
        "Authorization": app.globalData.access_token
      },
      success: res => {
        if (res.data.code === 200) {
          that.getUserList();
          wx.showToast({
            title: '取消关注',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },

  getUserList: function() {
    var that = this;
    var keyword = this.data.keyword;
    
    wx.request({
      url: app.globalData.urlPath + "/friends?keyword=" + keyword,
      header: {
        "Authorization": app.globalData.access_token
      },
      success: res => {
        if (res.data.code === 200) {
          that.setData({
            friends: res.data.data
          });
        } else if (res.data.code === 1000) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      }
    })
  }


})