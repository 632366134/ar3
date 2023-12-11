const app = getApp();
// packageA/pages/copmList/copmList.js
import {
    goTo,
    switchTab
} from "../../../utils/navigate";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIPhoneX: app.isIPhoneX,
        compList1: [],
        compList2: [],
        compList3: [],
        compList4: [],
        activeIndex: 0,
        flag: false

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const compList1 = this.compList1 = wx.getStorageSync("compList1")
        const compList2 = this.compList2 = wx.getStorageSync("compList2")
        const compList3 = this.compList3 = wx.getStorageSync("compList3")
        const compList4 = this.compList4 = wx.getStorageSync("compList4")
        this.index = 2
        this.setData({
            compList1: compList1.slice(0, this.index * 7),
            compList2: compList2.slice(0, this.index * 7),
            compList3: compList3.slice(0, this.index * 7),
            compList4: compList4.slice(0, this.index * 7)
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
    onChange({
        detail
    }) {
        wx.pageScrollTo({
            scrollTop: 0
        })
        this.setData({
            activeIndex: detail.index,
            flag: false
        })
        this.index = 2

    },
    goTop() {
        wx.pageScrollTo({
            scrollTop: 0
        })
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
    onPageScroll({
        scrollTop
    }) {
        console.log(scrollTop)
        if (scrollTop > 50) {
            this.setData({
                flag: true
            })
        } else {
            this.setData({
                flag: false
            })
        }
    },
    goBack() {
        wx.navigateBack()
    },
    goSearch() {
        goTo('morecompSearch')
    },
    onReachBottom() {
        console.log('onReachBottom', this.data.activeIndex)
        let step = 7
        this.index++
        switch (this.data.activeIndex) {
            case 0:
                this.setData({
                    compList1: this.compList1.slice(0, this.index * step),
                })
                break;
            case 1:
                this.setData({

                    compList2: this.compList2.slice(0, this.index * step),

                })

                break;
            case 2:
                this.setData({

                    compList3: this.compList3.slice(0, this.index * step),

                })

                break;
            case 3:
                this.setData({
                    compList4: this.compList4.slice(0, this.index * step),


                })

                break;
            default:
                break;
        }

    },
    changeMask() {

        this.setData({
            isMask: false,

        });
    },
    goPriview(
        {currentTarget}
    ) {
        console.log(currentTarget)
        this.setData({
            borchureDetail: currentTarget.dataset.detail,
            isMask: true
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})