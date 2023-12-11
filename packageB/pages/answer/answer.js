// packageB/pages/answer/answer.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
    isIPhoneX: app.isIPhoneX,
    img:'',
    height:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad({param}) {
        let img,height
        if(param ==1){
            img = 'https://arp3.arsnowslide.com/zz/%E9%A1%B9%E7%9B%AE%E5%88%9B%E5%BB%BA%E4%BF%AE%E6%94%B9.png'
        }else if (param ==0){
            img = 'https://arp3.arsnowslide.com/zz/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%8A%9F%E8%83%BD%E6%A8%A1%E5%9D%97%E8%AF%B4%E6%98%8E.png'
        }
        this.setData({img,height})
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