// pages/searchList/searchList.js
const {
    API
} = require("../../utils/request.js");
import {
    navigateBack
} from "../../utils/navigate";
const publicFn = require("../../utils/public");
const app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        projectDetail: {},
        isMask: false,
        borchureDetail: {},
        isIPhoneX: app.isIPhoneX,
        inputValue: "",
        flag: false,
        topflag:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad({
        param
    }) {
        let list = JSON.parse(param).list;
        let inputValue = JSON.parse(param).inputValue;
        this.setHistory(inputValue)
        this.setData({
            list,
            inputValue
        });
        this.pageNum = 1
        this.pageSize = 8
    },

    setHistory(inputValue) {
        let SearchHistoryList = wx.getStorageSync('SearchHistoryList') || []
        const index = SearchHistoryList.indexOf(inputValue)
        index === -1 ? SearchHistoryList.unshift(inputValue) : SearchHistoryList.unshift(SearchHistoryList.splice(index, 1)[0])
        wx.setStorageSync('SearchHistoryList', SearchHistoryList.slice(0, 8))
    },
    select({
        detail
    }) {
        this.setData({
            isMask: true,
            borchureDetail: detail,
        });
    },
    goBack() {
        wx.navigateBack()
    },
    goTop() {
        wx.pageScrollTo({
            scrollTop: 0
        })
    },
    bindKeyInput(e) {
        console.log(e.detail);
        this.setData({
            inputValue: e.detail.detail,
        });
    },
    async goSearch() {
        publicFn.Loading();
        console.log(this.data.inputValue);
        let inputValue = this.data.inputValue;
        if (!inputValue) {
            publicFn.Toast("请输入正确", "error");
            return;
        }
        this.pageNum = 1
        this.pageSize = 8
        const list = await this.filterProjectName(inputValue);
        console.log(list)
        if (list.length > 0) {
            this.setData({
                list,flag:false
                
            })
        }

    },
    async filterProjectName(inputValue, flag = false) {
        this.setHistory(inputValue)
        let oldList = this.data.list;
        let pageNum = this.pageNum,
            pageSize = this.pageSize;
        let data1 = `pageNum=${pageNum}&pageSize=${pageSize}&projectName=${inputValue}`;
        let data2 = `pageNum=${pageNum}&pageSize=${pageSize}&CompanyName=${inputValue}`;
        let list1 = await API.selProjectsOnNameByPage(data1);
        let list2 = await API.selProjectsOnCompanyNameByPage(data2);
        let list = [...list1, ...list2];
        let string = list.map(i => JSON.stringify(i))
        list = Array.from(new Set(string))
        list = list.map(d => JSON.parse(d))
        list = list.filter((v) => {
            return v.projectCode != "312330376891027456";
        });
        if (list.length !== 0) {
            let {
                projectCode
            } = wx.getStorageSync("collect");

            for (let i = 0; i < list.length; i++) {
                let {
                    mediaList
                } = await API.selMediaApps({
                    projectCode: list[i].projectCode,
                });
                if (list[i].projectCode == projectCode) {
                    list[i].collect = true;
                }
                if (mediaList.some((s) => s.mediaType == 5)) {
                    list[i].mediaType = 5;
                }
            }
            // pageNum++;
            console.log(oldList.slice(-3))
            if (
                flag &&
                oldList.slice(-3)[0].id ===
                list.slice(-3)[0].id && oldList.slice(-3)[1].id ===
                list.slice(-3)[1].id && oldList.slice(-3)[2].id ===
                list.slice(-3)[2].id
            ) {
                wx.showToast({
                    title: "没有更多结果",
                    icon: "error",
                });
                this.setData({
                    flag: true
                });
            } else {
                wx.hideLoading()
                return list
            }
        } else {
            this.setData({
                flag: true
            });

            wx.showToast({
                title: "没有更多结果",
                icon: "error",
            });
        }
    },
    changeMask() {
        this.setData({
            isMask: false,
        });
    },
    changeList(e) {
        console.log(e);
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        publicFn.LoadingOff();
    },

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
    onPageScroll({
        scrollTop
    }) {
        console.log(scrollTop)
        if (scrollTop > 900) {
            this.setData({
                topflag: true
            })
        } else {
            this.setData({
                topflag: false
            })
        }
    },
    async onReachBottom() {
        if (this.data.flag) return;
        this.pageNum++

        let list = await this.filterProjectName(this.data.inputValue, true);
        console.log(list);

        if (list) {
            console.log(this.data.list, list, "listlistlist");
            list = [...this.data.list, ...list];
            this.setData({
                list
            });
        }
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