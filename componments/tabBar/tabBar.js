// componments/tabBar/tabBar.js
import {
    goTo,
    redirectTo,
    switchTab
} from "../../utils/navigate";
// app.js
const {
    API
} = require("../../utils/request.js");
import {
    throttle
} from "../../utils/util";
const publicFn = require("../../utils/public");

var app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        tabIndex: {
            type: Number,
            default: 2
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        isIPhoneX: app.isIPhoneX,
        tabbarIMG: ['/images/tabBar/left.png', '/images/tabBar/right.png', '/images/tabBar/mid.png']
    },

    /**
     * 组件的方法列表
     */
    methods: {
        goSearch: throttle(async function () {
            switchTab("compSearch")

            // this.handleCamera()
            //     .then(async (res) => {

            //         // goTo("compSearch", {
            //         //     projectCode: "312330376891027456",
            //         // });
            //         // goTo("web-view",{openid:data});
            //         switchTab("compSearch")
            //     })
            //     .catch((err) => {})
        }, null),
        goIndex: throttle(function () {
            if (this.properties.tabIndex == 2) return
            switchTab("index")
        }, null),

        goMine: throttle(function () {
            if (this.properties.tabIndex == 3) return
            let hasPhone = wx.getStorageSync('hasPhone')
            if (hasPhone) {
                switchTab("mine")
            } else {
                wx.showToast({
                    title: "请先登录",
                    icon: "error",
                });
                goTo("signIn")
            }

        }, null),
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
        async getOpenid() {
            console.log('gomine')



        },
    },
});