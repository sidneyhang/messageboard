// pages/my/pay/pay.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPack: 1,
    flowers: {},
    eggs: {}
  },

  changePackage: function(e) {
    var id = e.currentTarget.dataset.packid;
    this.setData({
      currentPack: id
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