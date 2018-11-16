// pages/ranklist/ranklist.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 1,
    currentTime: 'TODAY',
    rankList: {}
  },

  changeTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.idx
    });

    that.queryRankList();
  },

  changeTime: function(e) {
    var that = this;
    that.setData({
      currentTime: e.currentTarget.dataset.idx
    });

    that.queryRankList();
  },

  queryRankList: function() {
    var that = this;
    var postData = {
      period: that.data.currentTime
    };

    wx.request({
      url: app.globalData.urlPath + "/ranklist/" + that.data.currentTab,
      header: {
        "Authorization": app.globalData.access_token,
      },
      data: postData,
      success: res => {
        console.log(res.data);
        if (res.data.code === 200) {
          that.setData({
            rankList: res.data.data
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.queryRankList();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  }

})