//app.js
App({
  onLaunch: function(option) {

    var that = this;

    wx.login({
      success: function(res_login) {
        if (res_login.code) {
          that.globalData.code = res_login.code;
          wx.getUserInfo({
            success: function(res) {
              var data = {
                code: res_login.code,
                encryptedData: res.encryptedData,
                iv: res.iv,
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
                gender: res.userInfo.gender
              };

              wx.request({
                url: that.globalData.urlPath + "/login",
                method: "POST",
                data: data,
                success: res => {
                  var data = res.data;
                  if (data.code === 200) {
                    getApp().globalData.access_token = data.data.access_token;
                    getApp().globalData.openid = data.data.openid;
                    wx.setStorageSync("userInfo", data.data.userInfo);
                    wx.setStorageSync("access_token", data.data.access_token);
                  }
                }
              })
            },
            error: res => {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
          })
        } else {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
         
        } else {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      }
    })
  },
  globalData: {
    openid: 0,
    urlPath: 'https://wxapi.floweggr.com/expresslove/api/v1'
    // urlPath: 'http://192.168.1.134:9000/expresslove/api/v1'
  }
})