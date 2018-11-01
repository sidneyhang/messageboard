// pages/my/my.js
var voice = "";
const recorderManager = wx.getRecorderManager();

const options = {
  duration: 10000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'aac',
  frameSize: 50
};

recorderManager.onStart(() => {
  console.log("recoder start");
});

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  play: function() {
    console.log(voice);
    //播放声音文件  

    wx.playVoice({
      filePath: voice
    })
  },

  start: function() {
    console.log("start");
    //开始录音  
    recorderManager.start(options);
  },

  stop: function() {
    //结束录音  
    wx.stopRecord();
  },


})