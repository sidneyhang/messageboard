// pages/pubmsg/pubmsg.js
var defaultPrice = 0;
var app = getApp();
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();

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
    historyMsg: {},
    recorderStatus: 0,
    recordStatusText: "点击录制",
    num: 0,
    audio: {},
    pathname: "",
    category: "",
    unit: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setStorageSync("needPrice", defaultPrice);
    var that = this;

    var category = wx.getStorageSync("category");
    var categoryId = category;
    var unit = "";
    if (category != "4") {
      category = "花";
      unit = "朵";
    } else {
      category = "蛋";
      unit = "颗";
    }

    that.setData({
      category: category,
      unit: unit
    })

    wx.request({
      url: app.globalData.urlPath + "/messages/history/" + categoryId,
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

  deleteRecord: function() {
    this.setData({
      pathname: "",
      num: 0,
      recorderStatus: 0,
      recordStatusText: "点击录制"
    })
  },

  startRecorder: function(e) {
    const options = {
      duration: 60000,
      sampleRate: 22050,
      numberOfChannels: 1,
      encodeBitRate: 128000,
      format: 'mp3',
      frameSize: 50
    }
    var that = this;
    this.setData({
      recorderStatus: 1,
      recordStatusText: "录制中"
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

    recorderManager.onError(function() {
      console.log("录制错误");
      that.setData({
        pathname: "",
        num: 0,
        recorderStatus: 0,
        recordStatusText: "点击录制"
      })

      wx.showToast({
        title: '录音失败，请重新录制',
        icon: 'none',
        duration: 3000
      })
    });
  },

  playAudio: function(e) {
    var that = this;

    innerAudioContext.autoplay = true;
    innerAudioContext.src = that.data.pathname;

    innerAudioContext.play();
  },

  stopRecorder: function(e) {
    var that = this;
    clearInterval(that.data.setInter);
    recorderManager.stop();

    recorderManager.onStop((res) => {
      console.log("stoped");
      var audioData = {
        duration: res.duration,
        fileSize: res.fileSize
      };
      that.setData({
        audio: audioData,
        recordStatusText: "录制完成",
        recorderStatus: 2
      });

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

    if (type == 1 && (content == null || content.trim() == "")) {
      wx.showToast({
        title: '需要填写留言内容',
        icon: 'none',
        duration: 2000
      });
      return false;
    }

    if (type == 2 && (audio.pathname == null || audio.pathname == "")) {
      wx.showToast({
        title: '需要先录音',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    var postData = {
      type: parseInt(type),
      category: parseInt(category),
      receiver: parseInt(receiver),
      price: parseFloat(price),
      content: content,
      audioUrl: JSON.stringify(audio)
    };

    wx.showModal({
      title: '确认留言',
      content: '赠送给对方1' + (category == 4 ? '颗蛋' : '朵花'),
      success(res) {
        if (res.confirm) {
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
                  url: '/pages/pubmsg/pubsuccess/pubsuccess',
                })
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            error: res => {

            }
          });
        } else if (res.cancel) {

        }
      }
    })
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
    var unit = this.data.unit;
    var flowerCount = price + unit;
    if (price == "0") {
      flowerCount = "免费";
    } else if (price == "-1") {
      price = this.data.cusPrice;
      flowerCount = price + unit;
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