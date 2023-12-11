// pages/collect/collect.js
import {
    navigateBack,
    goTo
} from "../../utils/navigate";
const publicFn = require("../../utils/public");
const app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        compList: [],
        listIndex: null,
        isIPhoneX: app.isIPhoneX,
        collect: [],
        isCover: false,
        isMask: false,
        haveMask: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {

        // let c = wx.getStorageSync("collect");
        // if (c) {
        //   c.collect = true;
        //   this.data.collect.push(c);
        // }
        // if (compList && c) {
        //   compList = compList.filter((v) => {
        //     return v.projectCode != c?.projectCode;
        //   });
        // }

        // this.setData({
        //   compList,
        //   collect: this.data.collect,
        // });
        // publicFn.LoadingOff();
    },
    goCollectPriview({
        detail
    }) {

        this.setData({
            borchureDetail: detail.detail,
            isMask: true
        })
    },
    changeMask() {
        this.child.changeCollect()

        this.setData({
            isMask: false,

        });
    },
        goCollectModal() {
            let timer =setTimeout(() => {
                clearTimeout(timer)
                this.setData({
                    haveMask: true
                })
            },50);

        },
        collectCancel() {
            let timer =setTimeout(() => {
                clearTimeout(timer)
                this.setData({
                    haveMask: false
                })
            }, 50);
        },
        changeCollect() {
            let timer =setTimeout(() => {
                clearTimeout(timer)
                this.setData({
                    haveMask: false
                })
            }, 50);
        },
    delCollect() {
        this.setData({
            isCover: true,
        });
    },
    cancelDel() {
        this.setData({
            isCover: false,
        });
    },
    async submitDel() {
        this.setData({
            isCover: false,
        });
        await wx.removeStorageSync("collect");
        await wx.setStorageSync("flag", true);
        await wx.reLaunch({
            url: "/pages/index/index"
        });
    },
    select(e) {
        let listIndex = e.detail.id;
        if (!listIndex) {
            this.setData({
                listIndex: "",
            });
        } else {
            this.setData({
                listIndex,
            });
        }
    },
    goCollect() {
        publicFn.Loading();
        if (!this.data.listIndex) {
            publicFn.Toast("请选择宣传册", "error");
            return;
        }
        let index = this.data.compList.findIndex(
            (item) => item.id === this.data.listIndex
        );
        wx.setStorageSync("collect", this.data.compList[index]);

        publicFn.Toast("收藏成功！", "success");
        navigateBack("index");
    },
    goCollectSearch() {
        publicFn.Loading();
        goTo("collectSearch");
    },
    goBack() {
        wx.navigateBack()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        this.child = this.selectComponent('#cl')
    },

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
    onReachBottom() {
        console.log(this.child)
        this.child.onReachBottom()
    },
    onPageScroll({
        scrollTop
    }) {
        console.log(scrollTop)
        this.child.onPageScroll(scrollTop)

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
});