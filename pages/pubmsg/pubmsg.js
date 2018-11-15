// pages/pubmsg/pubmsg.js
var defaultPrice = 0;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 1,
    cusPrice: "",
    flowerCount: "免费",
    modalShow: false,
    selPrice: defaultPrice,
    content: "",
    historyMsg: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setStorageSync("needPrice", defaultPrice);

    var that = this;

    wx.request({
      url: app.globalData.urlPath + "/message/history",
      header: {
        "Authorization": app.globalData.access_token
      },
      success: res => {
        if (res.data.code === 200) {
          var data = res.data.data;
          that.setData({
            historyMsg: data
          });
          console.log(data);
        }
      }
    })
  },

  publishMsg: function() {
    var type = this.data.currentTab;
    var category = wx.getStorageSync("category");
    var receiver = wx.getStorageSync("targetUser");
    var price = wx.getStorageSync("needPrice");
    var content = this.data.content;

    var postData = {
      type: parseInt(type),
      category: parseInt(category),
      receiver: parseInt(receiver),
      price: parseFloat(price),
      content: content,
    };

    wx.request({
      url: app.globalData.urlPath + "/message",
      method: "POST",
      header: {
        "Authorization": app.globalData.access_token
      },
      data: postData,
      success: res => {
        if (res.data.code === 200) {
          wx.navigateTo({
            url: '/pages/pubsuccess/pubsuccess',
          })
        }
      },
      error: res => {

      }
    });


  },

  contentInput: function(e) {
    this.setData({
      content: e.detail.value
    })
  },

  priceInput: function(e) {
    this.setData({
      cusPrice: e.detail.value
    });
  },

  changeTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

  priceModal: function(e) {
    this.setData({
      modalShow: true
    })
  },

  closeModal: function(e) {
    this.setData({
      modalShow: false
    })
  },

  selectPrice: function(e) {
    var that = this;
    var price = e.currentTarget.dataset.price;
    if (price != "-1") {
      that.setData({
        cusPrice: ""
      })
    }

    wx.setStorageSync("needPrice", price);
    that.setData({
      selPrice: price
    })
  },

  confirmPrice: function(e) {
    var price = wx.getStorageSync("needPrice");
    var flowerCount = price + "朵";
    if (price == "0") {
      flowerCount = "免费";
    } else if (price == "-1") {
      price = this.data.cusPrice;
      flowerCount = price + "朵";
    }
    this.setData({
      flowerCount: flowerCount,
      modalShow: false
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