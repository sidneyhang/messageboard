//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    showRole: false
    // motto: 'Hello World',
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  changeRole: function(e) {
    this.setData({
      showRole: !this.data.showRole
    })
  },

  toUserList: function(e) {
    var userInfo = wx.getStorageSync("userInfo");
    var category = e.currentTarget.dataset.category;
    wx.setStorageSync("category", category);
    if (category == 4) {
      if (userInfo.eggCount > 0) {
        wx.navigateTo({
          url: '/pages/userlist/userlist',
        })
      } else {
        wx.showToast({
          title: '需要一颗蛋，请先去充值(提醒：签到可免费领取花和蛋)',
          icon: 'none',
          duration: 3000
        })
      }
    } else {
      if (userInfo.flowerCount > 0) {
        wx.navigateTo({
          url: '/pages/userlist/userlist',
        })
      } else {
        wx.showToast({
          title: '需要一朵花，请先去充值(提醒：签到可免费领取花和蛋)',
          icon: 'none',
          duration: 3000
        })
      }
    }
  },

  onLoad: function(option) {
    console.log(option);
    if (option.shareUser != undefined && option.shareUser != null && option.shareUser != "") {
      var postData = {
        shareUser: option.shareUser
      };
      wx.request({
        url: app.globalData.urlPath + "/friends/add",
        method: "POST",
        data: postData,
        header: {
          "Authorization": app.globalData.access_token
        },
        success: res => {
          console.log(res.data);
        }
      })
    }

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})