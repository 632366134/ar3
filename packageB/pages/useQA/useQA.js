const { goTo } = require("../../../utils/navigate");
const app = getApp();

// packageB/pages/useQA/useQA.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        q: "1. AR宣传册小程序功能模块使用说明",
        a:
          "识别图片以及点击屏幕即可渲染模型，请在wifi环境或者网速正常情况下使用",
      }, {
        q: "2. 修改AR宣传册小程序项目内容",
        a:
          "识别图片以及点击屏幕即可渲染模型，请在wifi环境或者网速正常情况下使用",
      }
    ],
    activeNames:'',
    isIPhoneX: app.isIPhoneX,

  },

  goAnswer({target}){
      console.log('goAnswer')
      goTo('answer',target.dataset.index)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},
  goBack(){
      wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: true,
      menu: ["shareAppMessage", "shareTimeline"],

    });
  },

  //用户点击右上角分享朋友圈
  onShareTimeline: function () {
    return {
      title: '',
      query: {
        key: ''
      },
      imageUrl: ''
    }
  },
});
