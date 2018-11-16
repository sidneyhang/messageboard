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

        }
      }
    })
  },

  toDetail: function(e) {
    var id = e.currentTarget.dataset.id;

    if (this.data.currentTab === 1) {
      var price = e.currentTarget.dataset.price;
      var flowerType = e.currentTarget.dataset.flower_type;
      var flower = flowerType == "FLOWER" ? "花" : "蛋";

      wx.showModal({
        title: '提示',
        content: '需要消耗' + price + flower,
        success(res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.urlPath + "/message/" + id + "/look",
              method: "POST",
              header: {
                "Authorization": app.globalData.access_token
              },
              success: res => {
                console.log(res);
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

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/message/detail/detail?id=' + id,
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
          that.setData({
            messages: data
          })
        }
      }
    })

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