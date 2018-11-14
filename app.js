//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var that = this;

    wx.login({
      success: function(res_login) {
        console.log(res_login);
        if (res_login.code) {
          that.globalData.code = res_login.code;
          wx.getUserInfo({
            success: function(res) {
              console.log(res);
              var data = {
                code: res_login.code,
                encryptedData: res.encryptedData,
                iv: res.iv,
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName
              };
              console.log(data);

              wx.request({
                url: that.globalData.urlPath + "/login",
                method: "POST",
                data: data,
                success: res => {
                  var data = res.data;
                  console.log(data);
                  if (data.code === 200) {
                    getApp().globalData.access_token = data.data.access_token;
                    wx.setStorageSync("userInfo", data.data.userInfo);
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
        console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // wx.getUserInfo({
          //   success: res => {
          //     console.log(res);
          //     // 可以将 res 发送给后台解码出 unionId
          //     this.globalData.userInfo = res.userInfo

          //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          //     // 所以此处加入 callback 以防止这种情况
          //     if (this.userInfoReadyCallback) {
          //       this.userInfoReadyCallback(res)
          //     }
          //   },
          //   error: res => {
          //     console.log(res);
          //   }
          // })
        } else {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      }
    })

    // // 登录
    // wx.login({
    //   success: res => {
    //     console.log(res);
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     wx.request({
    //       url: that.globalData.wx_url_1 + res.code + that.globalData.wx_url_2,
    //       success: res => {
    //         console.log(res);
    //         that.globalData.openid = res.data.openid;
    //       },
    //       error: res => {
    //         console.log(res);
    //       }
    //     })
    //   }
    // });


  },
  globalData: {
    openid: 0,
    wx_url_1: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxa30da721db587413&secret=68bcec49a3919e51521c9c02a1fcdba2&js_code=',
    wx_url_2: '&grant_type=authorization_code',
    urlPath: 'http://localhost:9000/expresslove/api/v1'
  }
})