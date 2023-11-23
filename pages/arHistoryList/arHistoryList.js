// pages/arHIstoryList/arHIstoryList.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIPhoneX: app.isIPhoneX,
        historyList: [],
        flag: false,
        collect: {},
        show: false,
        message: '',
        show2: false,
        message2: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const historyList = wx.getStorageSync('historyList') || []
        const collect = wx.getStorageSync('collect') || {}

        console.log(historyList, 'historyList'),
            this.setData({
                historyList,
                collect
            })
    },
    goBack() {
        wx.navigateBack()
    },
    collectCancel() {},
    collectConfirm() {
        if (this.detail.projectCode === this.data.collect.projectCode) {
            wx.removeStorageSync('collect')
            this.setData({
                collect: {}
            })
        } else {
            wx.setStorageSync('collect', this.detail)
            this.setData({
                collect: this.detail
            })
        }
    },
    goCollect({
        target
    }) {
        console.log(target)
        this.detail = target.dataset.item
        if (this.detail.projectCode !== this.data.collect.projectCode) {
            this.setData({
                message: "是否收藏该AR项目？",
                show: true

            })
        } else {
            this.setData({
                message: "是否取消收藏该AR项目？",
                show: true

            })
        }
    },
    collectCancel2() {},
    collectConfirm2() {
        const list = this.data.historyList
        list.splice(this.index, 1)
        this.setData({
            historyList:list,
        })
        wx.setStorageSync('historyList', list)
    },
    deleteHistory({
        currentTarget
    }) {
        console.log(currentTarget)
        this.index = currentTarget.dataset.index
        this.setData({
            message2: "是否删除该历史记录？",
            show2: true

        })
    },
  
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    goTop() {
        wx.pageScrollTo({
            scrollTop: 0
        })
    },
    onPageScroll({
        scrollTop
    }) {
        console.log(scrollTop)
        if (scrollTop > 900) {
            this.setData({
                flag: true
            })
        } else {
            this.setData({
                flag: false
            })
        }
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
    onShareAppMessage() {

    }
})