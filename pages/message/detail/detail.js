// pages/message/detail/detail.js
const innerAudioContext = wx.createInnerAudioContext();

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: {},
    duration: 0,
    setInter: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
    });


    innerAudioContext.onEnded((res) => {
      console.log("end");
      that.setData({
        duration: that.data.msg.duration
      });
      clearInterval(that.data.setInter);
    });

    innerAudioContext.onStop((res) => {
      console.log("stop");
      that.setData({
        duration: that.data.msg.duration
      });
      clearInterval(that.data.setInter);
    })
  },

  playAudio: function(e) {
    var that = this;
    if (innerAudioContext.paused) {
      innerAudioContext.autoplay = true;
      innerAudioContext.src = that.data.msg.audioUrl;
      innerAudioContext.obeyMuteSwitch = false;
      innerAudioContext.play();

      that.data.setInter = setInterval(function () {
        var numVal = that.data.duration - 1;
        if (numVal < 0) {
          return false;
        }
        that.setData({
          duration: numVal
        });
      }, 1000);
    } else {
      innerAudioContext.stop();
    }

  }

})