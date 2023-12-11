// pages/selectRole/selectRole.js
import {
    goTo,
    switchTab
} from "../../utils/navigate";
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIPhoneX: app.isIPhoneX,
        manImg:'/images/selectRole/man.png',
        womanImg:'/images/selectRole/woman.png',
        gender:3

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const {
            userCode,
            userName
        } = JSON.parse(options.param)
        this.userCode = userCode
        this.userName = userName
        this.gender = 3
        // this.setData({url:`https://www.arsnowslide.net/?userCode=${userCode}&userName=${userName}&gender=0`})

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    goBack() {
        wx.navigateBack()
    },
    goHome() {

        switchTab('index')
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.emit('acceptDataFromOpenedPage', {
            flag: true
        });

    },
    goShowRoomBtn() {
    
        if (this.gender === 3) {
            wx.showToast({
              title: '请选择角色',
              icon:'error'
            })
            return
        }
        goTo("web-view", {
            userCode: this.userCode,
            userName: this.userName,
            gender: this.gender
        });

    },
    getMan() {
        this.gender = 0
        this.setData({gender:this.gender,manImg:'/images/selectRole/man2.png',womanImg:'/images/selectRole/woman.png'})
        console.log(this.data.gender)

    },
    getWoman() {
        this.gender = 1
        this.setData({gender:this.gender,womanImg:'/images/selectRole/woman2.png',manImg:'/images/selectRole/man.png'})
        console.log(this.data.gender)

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