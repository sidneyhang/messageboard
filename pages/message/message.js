// pages/message/message.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 1,
    messages: {},
    audioMsg: {}
  },

  changeTab: function(e) {
    var that = this;
    var currentTab = e.currentTarget.dataset.idx;
    that.setData({
      currentTab: currentTab
    });

    that.getMessage();
  },

  deleteMsg: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '删除消息',
      content: '确认删除该消息?',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.urlPath + "/message/" + id,
            method: "DELETE",
            header: {
              "Authorization": app.globalData.access_token
            },
            success: res => {
              if (res.data.code === 200) {
                that.getMessage();
                that.countNoReadMsg();
                wx.showToast({
                  title: '删除成功!',
                  icon: "success",
                  duration: 2000
                })
              }
            }
          })
        } else {

        }
      }
    })
  },

  toDetail: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;

    if (this.data.currentTab == 1) {
      var price = e.currentTarget.dataset.price;
      var flowerType = e.currentTarget.dataset.flower_type;
      var flower = flowerType == "FLOWER" ? "花" : "蛋";
      var isRead = e.currentTarget.dataset.isread;
      if (price > 0) {
        if (!isRead) {
          wx.showModal({
            title: '提示',
            content: '需要消耗' + price + flower,
            success(res) {
              if (res.confirm) {
                that.lookMessage(id);
              } else if (res.cancel) {
                return false;
              }
            }
          })
        } else {
          that.lookMessage(id);
        }
      } else {
        that.lookMessage(id);
      }
    } else {
      that.lookMessage(id);
    }


  },

  lookMessage: function(id, confirm) {
    wx.request({
      url: app.globalData.urlPath + "/message/" + id + "/look",
      method: "POST",
      header: {
        "Authorization": app.globalData.access_token
      },
      success: res => {
        if (res.data.code === 200) {
          wx.navigateTo({
            url: '/pages/message/detail/detail?id=' + id,
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
          return false;
        }
      }
    })
  },

  getMessage: function() {
    var that = this;
    var currentTab = that.data.currentTab;
    wx.request({
      url: app.globalData.urlPath + "/messages/" + currentTab,
      header: {
        "Authorization": app.globalData.access_token
      },
      success: res => {
        if (res.data.code === 200) {
          var data = res.data.data;
          if (currentTab == 1) {
            that.setData({
              messages: data
            })
          } else {
            that.setData({
              audioMsg: data
            })
          }
        } else if (res.data.code === 1000) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      }
    })
  },

  countNoReadMsg: function() {
    var that = this;
    var accessToken = wx.getStorageSync("access_token");
    wx.request({
      url: app.globalData.urlPath + "/messages/noread",
      method: "GET",
      header: {
        "Authorization": accessToken
      },
      success: res => {
        if (res.data.code === 200) {
          var currentNoread = wx.getStorageSync("noread");
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var currentTab = that.data.currentTab;

    that.getMessage();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getMessage();
    this.countNoReadMsg();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})