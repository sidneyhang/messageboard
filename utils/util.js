const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null

  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }

}

function countNoReadMsg() {
  var accessToken = wx.getStorageSync("access_token");
  wx.request({
    url: getApp().globalData.urlPath + "/messages/noread",
    method: "GET",
    header: {
      "Authorization": accessToken
    },
    success: res => {
      console.log(res);
      if (res.data.code === 200) {
        var noread = res.data.data.noread;
        var currentNoread = noread;
        if (currentNoread != 0) {
          wx.setStorageSync("noread", noread);
          wx.setTabBarBadge({
            index: 1,
            text: noread.toString()
          })
        }
      }
    }
  })
}


module.exports = {
  formatTime: formatTime,
  throttle: throttle,
  countNoReadMsg: countNoReadMsg
}
