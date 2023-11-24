// index.js
const {
    API
} = require("../../utils/request.js");
import {
    goTo,
    switchTab
} from "../../utils/navigate";
const publicFn = require("../../utils/public");
import {
    throttle
} from "../../utils/util";
const NEAR = 0.001;
const FAR = 1000;
const app = getApp();
let eventChannel, compList1 = [],
    compList2 = [],
    compList3 = [],
    compList4 = [],
    list1 = [],
    userCodeList = []
Page({
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
    data: {
        theme: "light",
        isIPhoneX: app.isIPhoneX,
        list: [],
        compList: [],
        compList1: [],
        compList2: [],
        compList3: [],
        compList4: [],
        moreCompList: [],
        collectUrl: "/images/index/addCollect.png",
        isCollect: false,
        collect: [],
        isMask: false,
        borchureDetail: {},
        isShowScan: true,
        active: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onUnload() {
        console.log("页面detached");
        if (wx.offThemeChange) {
            wx.offThemeChange();
        }
    },
    onChange(event) {

    },
    async onReady() {

        publicFn.LoadingOff();
        console.log("页面准备完全");


        this.setData({
            theme: wx.getSystemInfoSync().theme || "light",
        });

        if (wx.onThemeChange) {
            wx.onThemeChange(({
                theme
            }) => {
                this.setData({
                    theme
                });
            });
        }

        let list = await API.selProjects();
        wx.setStorageSync("list", list);
        //     let c = list.filter(v => v.projectCode == '369654870789541888')
        //     let collect = c[0]
        //   await wx.setStorageSync("collect",collect);
        // if (collect) {
        //   let {
        //     projectCode
        //   } = collect;
        //   collect = list.find((v) => {
        //     v.projectCode === projectCode;
        //   });
        //   if (list) {
        //     wx.setStorageSync("collect", collect);
        //   }
        // }
        publicFn.LoadingOff();
        list = list.filter((element) => {
            return (
                element.projectCode != "312330376891027456"
            );
        });
        list.forEach(e => {
            if (e.memberType === 4) {
                list1.push(e)
                return
            }
            switch (e.classify) {
                case 1:
                    if (this.filterResult(e.userCode)) {
                        compList1.push(e)
                        userCodeList.push(e.userCode)
                    }
                    break;
                case 2:
                    if (this.filterResult(e.userCode)) {
                        compList2.push(e)
                        userCodeList.push(e.userCode)
                    }
                    break;
                case 3:
                    if (this.filterResult(e.userCode)) {
                        compList3.push(e)
                        userCodeList.push(e.userCode)
                    }

                    break;
                case 4:
                    if (this.filterResult(e.userCode)) {
                        compList4.push(e)
                        userCodeList.push(e.userCode)
                    }
                    break;
                default:
                    break;
            }

        })
        list = list1.slice(0, 6);
        console.log(list, compList1, compList2, compList3, compList4)
        wx.setStorageSync("compList1", compList1);
        wx.setStorageSync("compList2", compList2);
        wx.setStorageSync("compList3", compList3);
        wx.setStorageSync("compList4", compList4);

        this.setData({
            list,
            compList1,
            compList2,
            compList3: compList3.slice(0, 6),
            compList4,
            moreCompList: compList1.slice(0, 3)
            //   collect,
            //   collectUrl: collect ?
            //     "https://arp3.arsnowslide.com/" +
            //     collect.bookCoverObsPath +
            //     collect.bookCoverObsName : "/images/index/add.png",
            //   isCollect: collect ? true : false,

        });
    },
    handleCamera() {
        return new Promise((resolve, reject) => {

            wx.requirePrivacyAuthorize({
                success: () => {
                    wx.getSetting({
                        success: (scope) => {
                            if (scope.authSetting["scope.camera"]) {
                                resolve();
                            } else {
                                wx.authorize({
                                    scope: "scope.camera",
                                    success: () => {
                                        resolve();
                                    },
                                    fail: (err) => {
                                        if (err.errno === 104) return

                                        wx.showModal({
                                            title: "", // 提示的标题,
                                            content: "检测到您已拒绝摄像头授权，请先授权！", // 提示的内容,
                                            showCancel: true, // 是否显示取消按钮,
                                            cancelText: "取消", // 取消按钮的文字，默认为取消，最多 4 个字符,
                                            cancelColor: "#000000", // 取消按钮的文字颜色,
                                            confirmText: "去授权", // 确定按钮的文字，默认为取消，最多 4 个字符,
                                            confirmColor: "#3CC51F", // 确定按钮的文字颜色,
                                            success: (res) => {
                                                if (res.confirm) {
                                                    wx.openSetting({
                                                        success: (res) => {

                                                            if (res.authSetting["scope.camera"]) {
                                                                return resolve();
                                                            }

                                                            reject(res);
                                                        },
                                                    });
                                                } else if (res.cancel) {
                                                    reject(res);
                                                }
                                            },
                                        });
                                    },
                                });
                            }
                        },
                        fail: (err) => {
                            reject(err);
                        },
                    });
                },
                fail: () => {}, // 用户拒绝授权
                complete: () => {}
            })
        });

    },
    goModel: throttle(async function () {
        this.handleCamera()
            .then(async (res) => {

                goTo("arKit", {
                    projectCode: "312330376891027456",
                });
                // goTo("web-view",{openid:data});
            })
            .catch((err) => {})
    }, null),
    filterResult(v) {
        return userCodeList.indexOf(v) === -1
    },
    async onShow() {
        publicFn.LoadingOff();

        let collect = wx.getStorageSync("collect") ;

        this.setData({
            collect,
            collectUrl: collect ?
                "https://arp3.arsnowslide.com/" +
                collect.bookCoverObsPath +
                collect.bookCoverObsName : "/images/index/addCollect.png",
            isCollect: collect ? true : false,
        });
        let flag = await wx.getStorageSync("flag");
        if (flag) {
            console.log("收藏已清空");
            await wx.showToast({
                title: "收藏已清空",
            });

            await wx.removeStorageSync("flag");
        }
    },
    goCompList() {
        goTo("compList")
        // switchTab("compSearch")
    },
    goHistroy() {
        publicFn.Loading();
        goTo("history");
    },
    gopriview({
        currentTarget
    }) {
        console.log(currentTarget, "currentTarget");
        this.setData({
            isMask: true,
            borchureDetail: currentTarget.dataset.item,
        });
    },
    changeMask() {
        let collect = wx.getStorageSync("collect");

        this.setData({
            collect,
            collectUrl: collect ?
                "https://arp3.arsnowslide.com/" +
                collect.bookCoverObsPath +
                collect.bookCoverObsName : "/images/index/addCollect.png",
            isCollect: collect ? true : false,
            isMask: false

        });

    },

    goService() {
        publicFn.Loading();
        goTo("mycomp");
    },
    goColllect() {
        publicFn.Loading();
        goTo("collect");
    },
    goSearch() {
        publicFn.Loading();
        goTo("compSearch");
    },
});