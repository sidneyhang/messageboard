// pages/message/detail/detail.js

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: {},
    duration: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var that = this;
    wx.request({
      url: app.globalData.urlPath + "/message/" + id,
      header: {
        "Authorization": app.globalData.access_token
      },
      success: res => {
        if (res.data.code === 200) {
          var data = res.data.data;
          that.setData({
            msg: data
          })

          if (data.msgType == 2) {
            that.setData({
              duration: data.duration
            })
          }
        }
      }
    })
  },

  playAudio: function(e) {
    var that = this;

    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.autoplay = true;
    innerAudioContext.src = that.data.msg.audioUrl;
    innerAudioContext.obeyMuteSwitch = false;

    innerAudioContext.play();

    that.data.setInter = setInterval(function  () {
      var numVal = that.data.duration - 1;
      if (numVal < 0) {
        return false;
      }
      that.setData({
        duration: numVal
      });
    }, 1000);

    innerAudioContext.onEnded((res) => {
      clearInterval(that.data.setInter);
      that.setData({
        duration: that.data.msg.duration
      });
    });
  }

})