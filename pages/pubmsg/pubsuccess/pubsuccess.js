// pages/pubsuccess/pubsuccess.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * <button class="show-btn" data-id="{{item.id}}" data-isread="{{item.read}}" data-price="{{item.needFlower}}" data-flower_type="{{item.flowerType}}" bindtap="toDetail">去查看</button>
   * <button class="show-btn" data-id="{{item.id}}" data-isread="{{item.read}}" data-price="{{item.needFlower}}" data-flower_type="{{item.flowerType}}" bindtap="toDetail">去查看</button>
   * <button class="show-btn" data-id="{{item.id}}" data-isread="{{item.read}}" data-price="{{item.needFlower}}" data-flower_type="{{item.flowerType}}" bindtap="toDetail">去查看</button>
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    qrcode: "";
  },

  share: function() {
    var that = this;

    wx.request({
      url: app.globalData.urlPath + "/qrcode",
      header: {
        "Authorization": app.globalData.access_token
      },
      success: res => {
        if (res.data.code === 200) {
          that.setData({
            qrcode: res.data.data.qrcode
          })


          var imgSrc = res.data.data.qrcode;
          wx.downloadFile({
            url: imgSrc,
            success: function(res) {
              //图片保存到本地
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function(data) {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 2000
                  })
                },
                fail: function(err) {
                  if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                    console.log("当初用户拒绝，再次发起授权")
                    wx.openSetting({
                      success(settingdata) {
                        console.log(settingdata)
                        if (settingdata.authSetting['scope.writePhotosAlbum']) {
                          console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                        } else {
                          console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                        }
                      }
                    })
                  }
                },
                complete(res) {
                }
              })
            }
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var userInfo = wx.getStorageSync("userInfo");
    return {
      title: '分享给好友',
      desc: '',
      path: '/pages/index/index?shareUser=' + userInfo.id,
      imageUrl: '/assets/images/share.png'
    }
  }
})