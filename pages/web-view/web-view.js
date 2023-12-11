// pages/web-view/web-view.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url:""

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
       const {userCode,userName,gender} = JSON.parse(options.param)
       this.setData({url:`https://www.arsnowslide.net/?userCode=${userCode}&userName=${userName}&gender=${gender}`})
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

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
})