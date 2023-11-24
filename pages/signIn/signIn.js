// pages/signIn/signIn.js
const {
    API
} = require("../../utils/request.js");
import {
    goTo,
    navigateBack,
    redirectTo,switchTab
} from "../../utils/navigate";
const publicFn = require("../../utils/public");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIPhoneX: app.isIPhoneX,
        userPhone: '',
        code: '',
        hidden: false,
        btnValue: '',
        btnDisabled: false,
        hasPhone: wx.getStorageSync('hasPhone'),
        detail: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    goBack(){
        wx.navigateBack()
    },
    async getPhoneNumber(e) {

        if (!e.detail.code) return
        //   const res2 = await API.getPhone({code:e.detail.code})
        // publicFn.Loading()
        console.log(e)
        const data= await API.getPhone(`code=${e.detail.code}`);
        console.log(data, 'data')
        wx.showToast({
            title: "绑定成功",
            icon: "success",
        });
        this.setData({
            userPhone: data.purePhoneNumber,
        })


    },
    async sendMsg() {
        publicFn.Loading()
        const data = await API.sendMsg(`phone=${this.data.userPhone}`);
        // const data = await API.sendMsg({phone:this.data.userPhone});


        console.log(data)
    },
    phoneBlur({
        detail
    }) {
        console.log(detail)
        this.setData({
            detail: detail,
            userPhone: detail.value
        })
    },
    async goMine() {
        await wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: async (res) => {
                console.log(res)
                let signature = res.signature
                const code = await publicFn.wxLogin()
                console.log(code,'logincode')
                let obj = {
                    code: code,
                    // rawData: code,
                    // phone: '17625008824',
                    signature:signature
                    // encryptedData: res.encryptedData,
                    // iv: res.iv
                }
                const data = await API.login(obj);
                console.log(data)
                wx.setStorageSync('hasPhone', true)
                this.setData({
                    hasPhone: true
                })
                switchTab('mine')
            }
        })


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