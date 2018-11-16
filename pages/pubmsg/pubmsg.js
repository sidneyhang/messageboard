// pages/pubmsg/pubmsg.js
var defaultPrice = 0;
var app = getApp();
const recorderManager = wx.getRecorderManager();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 2,
    cusPrice: "",
    flowerCount: "免费",
    modalShow: false,
    selPrice: defaultPrice,
    content: "",
    historyMsg: {},
    recorderStatus: 0,
    num: 0,
    audio: {},
    pathname: ""
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
        }
      }
    })
  },

  startRecorder: function(e) {
    const options = {
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'aac',
      frameSize: 50
    }
    var that = this;
    this.setData({
      recorderStatus: 1
    });
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });

    that.data.setInter = setInterval(function () {              
      var  numVal = that.data.num + 1;              
      that.setData({
        num: numVal
      });              
    }, 1000);
  },

  stopRecorder: function(e) {
    var that = this;
    clearInterval(that.data.setInter);
    recorderManager.stop();

    recorderManager.onStop((res) => {
      console.log("stoped");
      that.setData({
        audio: res
      })

      wx.uploadFile({
        url: app.globalData.urlPath + "/file/upload", //演示域名、自行配置
        filePath: res.tempFilePath,
        name: 'file',
        header: {
          "Authorization": app.globalData.access_token,
          "Content-Type": "multipart/form-data"
        },
        formData: {
          userId: app.globalData.openid //附加信息为用户ID
        },
        success: function(res) {
          var response = JSON.parse(res.data);
          if (response.code === 200) {
            var data = response.data;
            console.log(data.pathname);
            that.setData({
              pathname: data.pathname
            });
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function(res) {
          wx.showToast({
            title: '上传失败',
            icon: 'error',
            duration: 2000
          })
        },
        complete: function(res) {

        }
      })
    });
  },

  publishMsg: function() {
    var type = this.data.currentTab;
    var category = wx.getStorageSync("category");
    var receiver = wx.getStorageSync("targetUser");
    var price = wx.getStorageSync("needPrice");
    var content = this.data.content;
    var audio = this.data.audio;
    audio.pathname = this.data.pathname;

    var postData = {
      type: parseInt(type),
      category: parseInt(category),
      receiver: parseInt(receiver),
      price: parseFloat(price),
      content: content,
      audioUrl: JSON.stringify(audio)
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
    wx.setStorageSync("needPrice", price);
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