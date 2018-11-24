// pages/my/pay/pay.js
var app = getApp();
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPack: 1,
    flowers: {},
    eggs: {},
    cusPrice: '',
    consumerId: 1,
    consumer: [{
        name: 1,
        value: '花',
        checked: true
      },
      {
        name: 2,
        value: '蛋'
      }
    ]

  },
  radioChange: function(e) {
    console.log(e.detail.value);
  },

  priceInput: function(e) {
    this.setData({
      cusPrice: e.detail.value
    });
  },

  recharge: function(e) {
    var that = this;

    var cusPrice = that.data.cusPrice;
    var consumerId = that.data.consumerId;

    if (cusPrice == "") {
      wx.showToast({
        title: '请输入充值金额',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var postData = {
      packId: 0,
      price: parseInt(cusPrice),
      consumer: parseInt(consumerId)
    };

    this.pay(postData);
  },

  changePackage: util.throttle(function(e) {
    var id = e.currentTarget.dataset.packid;
    this.setData({
      currentPack: id
    })

    var postData = {
      packId: id
    };
    this.pay(postData);
  }),

  pay: function(postData) {
    wx.request({
      url: app.globalData.urlPath + "/prepay",
      method: "POST",
      data: postData,
      header: {
        "Authorization": app.globalData.access_token
      },
      success: res => {
        if (res.data.code === 200) {
          var data = res.data.data;
          console.log(data);
          wx.requestPayment({
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package_,
            'signType': data.signType,
            'paySign': data.paySign,
            success: function (res) {
              console.info(res);
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 3000
              });
              wx.navigateBack({
                delta: -1
              })
            },
            fail: function (res) {
              console.info(res);
              if (res.errMsg == "requestPayment:fail cancel") {
                wx.showToast({
                  title: '取消支付',
                  icon: 'none',
                  duration: 2000
                })
              } else {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.request({
      url: app.globalData.urlPath + "/member-packages",
      header: {
        "Authorization": app.globalData.access_token
      },
      success: res => {
        console.log(res.data);
        if (res.data.code === 200) {
          that.setData({
            flowers: res.data.data.flowers,
            eggs: res.data.data.eggs
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