// componments/confirm/confirm.js
import {
    goTo
} from "../../utils/navigate";
const publicFn = require("../../utils/public");
const {
    API
} = require("../../utils/request");
var app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    options: {
        styleIsolation: 'shared'
    },
    properties: {
        borchureDetail: {
            type: Object,
            default: {},
        },
        isShow: {
            type: Boolean,
            default: false,
        },

    },
    observers: {
        collect(newval) {
            console.log(newval)
            if (newval && newval.projectCode === this.data.borchureDetail.projectCode) {
                this.setData({
                    flag: true
                })
            } else {
                this.setData({
                    flag: false
                })
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        isIPhoneX: app.isIPhoneX,
        mediaTypeFlag: false,
        collect: {},
        flag: false,
        sliderFlag: false,
        currentValue: 0,
        modelDisable: true,
        ShowRoomDisable: true
    },

    /**
     * 组件的方法列表
     */
    lifetimes: {

    },

    methods: {
        dragStart() {
            wx.vibrateLong({
                success(e) {
                    console.log(e, 's')
                },
                fail(e) {
                    console.log(e, 'f')

                }
            })
        },
        onChange({
            detail
        }) {
            console.log(detail)
            if (detail > 75) {
                this.confirmAr()
                this.timer = setTimeout(() => {
                    clearTimeout(this.timer)
                    this.setData({
                        sliderFlag: false
                    })
                    this.setData({
                        sliderFlag: true
                    })
                }, 300);

            } else {
                this.setData({
                    sliderFlag: false
                })
                this.setData({
                    sliderFlag: true
                })
            }

        },
        async enter() {
            console.log('enter')
            this.setData({
                sliderFlag: true
            })
            const collect = wx.getStorageSync("collect") || {};
            console.log(collect)
            if (collect) {
                this.setData({
                    collect: collect
                })
            }
            let list = wx.getStorageSync("historyList") || [];
            let detail = this.properties.borchureDetail;
            if (detail.userCode === "305179302161764352") {
                this.setData({
                    ShowRoomDisable: false

                });
            }
            let {
                mediaList
            } = await API.selMediaApps({
                projectCode: detail.projectCode,
            });
            if (
                mediaList.some((s) => {
                    return s.mediaType == 5;
                })
            ) {
                console.log("5");
                detail.mediaType = 5;
                this.setData({
                    borchureDetail: detail,
                    modelDisable: false
                });
            }
            detail.date = this.unixStandardDate();
            let isHistory = list.findIndex((v) => v.id == detail.id);
            if (isHistory != -1) {
                list.splice(isHistory, 1);
            }

            list.unshift(detail);
            list.length = list.length >= 5 ? 5 : list.length;
            wx.setStorageSync("historyList", list);
        },
        unixStandardDate(
            dates = Date.now(),
            separatorStr = "/",
            unixType = "date"
        ) {
            //把时间戳转化成Date对象
            let date = new Date(dates);
            //获取年月日
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            month = month < 10 ? "0" + month : month;
            let day = date.getDate();
            day = day < 10 ? "0" + day : day;
            //返回的年月日
            let resultDate = year + separatorStr + month + separatorStr + day;
            //获取时间
            let hours = date.getHours();
            hours = hours < 10 ? "0" + hours : hours;
            let minutes = date.getMinutes();
            minutes = minutes < 10 ? "0" + minutes : minutes;
            let seconds = date.getSeconds();
            seconds = seconds < 10 ? "0" + seconds : seconds;
            let resultTime = hours + ":" + minutes + ":" + seconds;
            //判断是转换日期还是转换时间
            if (unixType === "date") {
                return resultDate;
            } else if (unixType === "time") {
                return resultDate + " " + resultTime;
            }
        },
        // changeCollect() {
        //     this.setData({
        //         collect: wx.getStorageSync('changeCollect') || {}
        //     })
        // },
        goBack() {
            this.setData({
                modelDisable: true,
                ShowRoomDisable: true
            })
            this.triggerEvent("changeMask");
        },
        changeCollect() {
            console.log("changeCollect")
            const collect = wx.getStorageSync('collect') || {}
            this.setData({
                collect
            })
        },
        move() {
            console.log("1");
        },
        confirmAr() {

            this.handleCamera()
                .then((res) => {
                    let param = {projectCode: this.properties.borchureDetail.projectCode}
                    wx.navigateTo({
                        url: `/packageA/pages/canvasAr/canvasAr?param=${JSON.stringify(param)}`,
                        events: {
                            // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                            acceptDataFromOpenedPage: (data) => {
                                this.setData({
                                    isShow: false
                                })
                            }
                        },
                        success: function (res) {
                            // 通过eventChannel向被打开页面传送数据
                            res.eventChannel.emit('acceptDataFromOpenerPage', {
                                data: 'test'
                            })
                        }
                    })
                    // },
                    //   });
                })
                .catch((err) => {
                    publicFn.LoadingOff();
                });
        },
        arKitBtn() {
            //   publicFn.Loading();
            // let url = `https://arp3.arsnowslide.com/${this.properties.borchureDetail.bookCoverObsPath}${this.properties.borchureDetail.bookCoverObsName}`;
            if (this.data.modelDisable) return
            this.handleCamera()
                .then((res) => {
                    //   wx.setStorageSync("imgUrl", url);
                    //   console.log(this.properties.borchureDetail.projectCode);
                    //   wx.setStorageSync(
                    //     "projectCode",
                    //     this.properties.borchureDetail.projectCode
                    //   );
                    // goTo("arKit", {
                    //     projectCode: this.properties.borchureDetail.projectCode,
                    // });
                    let param = {projectCode: this.properties.borchureDetail.projectCode}
                    wx.navigateTo({
                        url: `/packageB/pages/arKit/arKit?param=${JSON.stringify(param)}`,
                        events: {
                            // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                            acceptDataFromOpenedPage: (data) => {
                        console.log('acceptDataFromOpenedPage')

                                this.setData({
                                    isShow: false
                                })
                            }
                        },
                        success: function (res) {
                            // 通过eventChannel向被打开页面传送数据
                            res.eventChannel.emit('acceptDataFromOpenerPage', {
                                data: 'test'
                            })
                        }
                    // },
                      });
                })
                .catch((err) => {
                    publicFn.LoadingOff();
                });
        },
        ShowRoomBtn() {
            if (this.data.ShowRoomDisable) return
            let param = {
                userCode: this.data.borchureDetail.userCode,
                userName: this.data.borchureDetail.companyName
            }
            wx.navigateTo({
                url: `/pages/selectRole/selectRole?param=${JSON.stringify(param)}`,
                events: {
                    // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                    acceptDataFromOpenedPage: (data) => {
                        console.log('acceptDataFromOpenedPage')
                        this.setData({
                            isShow: false
                        })
                    }
                },
                success: function (res) {
                    // 通过eventChannel向被打开页面传送数据
                    res.eventChannel.emit('acceptDataFromOpenerPage', {
                        data: 'test'
                    })
                }
            })
            // this.setData({
            //     isShow: true
            // });
            // },
            //   });
            // })
            // .catch((err) => {
            //     publicFn.LoadingOff();
            // });
        },
        handleCamera() {
            return new Promise((resolve, reject) => {

                wx.requirePrivacyAuthorize({
                    success: (s) => {
                        console.log(s, 'success')
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
                                                            fail: (err) => {}
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
                    fail: (s) => {
                        console.log(s, 'fail')

                    }, // 用户拒绝授权
                    complete: () => {}
                })
            });

        },
    },
});