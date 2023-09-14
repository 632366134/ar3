// componments/tabBar/tabBar.js
import {
    goTo,
    redirectTo
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
        modelSrc1: "/images/tabBar/modelbar1.png",
        modelSrc2: "/images/tabBar/modelbar2.png",
        indexSrc1: "/images/tabBar/indexbar1.png",
        indexSrc2: "/images/tabBar/indexbar2.png",
        mSrc1: "/images/tabBar/mbar1.png",
        mSrc2: "/images/tabBar/mbar2.png",
    },

    /**
     * 组件的方法列表
     */
    methods: {
        goModel: throttle(async function () {
            this.handleCamera()
                .then(async (res) => {

                    goTo("arKit", {
                        projectCode: "312330376891027456",
                    });
                    // goTo("web-view",{openid:data});
                })
                .catch((err) => {})
            // await wx.getUserProfile({
            //     desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            //     success: async (res) => {
            //         console.log(res)
            //         let signature = res.signature
            //         const code = await publicFn.wxLogin()
            //         console.log(code, 'logincode')
            //         let obj = {
            //             code: code,
            //             // rawData: code,
            //             // phone: '17625008824',
            //             signature: signature
            //             // encryptedData: res.encryptedData,
            //             // iv: res.iv
            //         }
            //         const data = await API.login(obj);
            //         console.log(data)
            //         // wx.setStorageSync('hasPhone', true)
            //         // this.setData({
            //         //     hasPhone: true
            //         // })
            //         // redirectTo('mine')

            //     }
            // })

        }, null),
        goIndex: throttle(function () {
            if (this.properties.tabIndex == 2) return
            redirectTo("index")
        }, null),

        goMine: throttle(function () {
            if (this.properties.tabIndex == 3) return
            let hasPhone = wx.getStorageSync('hasPhone')
            if (hasPhone) {
                redirectTo("mine")
            } else {
                wx.showToast({
                    title: "请先登录",
                    icon: "error",
                });
                goTo("signIn")
            }

        }, null),
        handleCamera() {
            wx.requirePrivacyAuthorize({
                success: () => {
                    return new Promise((resolve, reject) => {
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
                    });
                },
                fail: () => {}, // 用户拒绝授权
                complete: () => {}
              })
         
        },
        async getOpenid() {
            console.log('gomine')



        },
    },
});