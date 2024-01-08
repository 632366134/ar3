// packageA/pages/imageList/imageList.js
// pages/searchList/searchList.js
const {
    API
} = require("../../../utils/request.js");
import {
    navigateBack,
    switchTab
} from "../../../utils/navigate";
const publicFn = require("../../../utils/public");
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIPhoneX: app.isIPhoneX,
        obsList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad({
        param
    }) {
        this.index = 0
        param = decodeURIComponent(param)
        param = JSON.parse(param)
        console.log(param)
        this.setData({
            obsList: param.obsList
        })
    },
    currentChange({
        detail
    }) {
        this.index = detail.current
    },
    goAllImageList(){
        let param ={
            obsList:this.data.obsList
        }
        wx.navigateTo({
            url: `/packageA/pages/allImageList/allImageList?param=${JSON.stringify(param)}`,
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: (data) => {
                    const eventChannel = this.getOpenerEventChannel()
                    eventChannel.emit('acceptDataFromOpenedPage', {
                        flag: true
                    });
                }
            },
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    data: 'test'
                })
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
    goBack() {
        wx.navigateBack()
    },
    goHome() {
        switchTab('index')

        const eventChannel = this.getOpenerEventChannel()
        console.log(eventChannel, 'eventChannel')
        eventChannel.emit('acceptDataFromOpenedPage', {
            flag: true
        });

    },
    handleCamera() {
        return new Promise((resolve, reject) => {

            wx.requirePrivacyAuthorize({
                success: (s) => {
                    console.log(s, 'success')
                    wx.getSetting({
                        success: (scope) => {
                            if (scope.authSetting["scope.writePhotosAlbum"]) {
                                resolve();
                            } else {
                                wx.authorize({
                                    scope: "scope.writePhotosAlbum",
                                    success: () => {
                                        resolve();
                                    },
                                    fail: (err) => {
                                        if (err.errno === 104) return
                                        wx.showModal({
                                            title: "", // 提示的标题,
                                            content: "检测到您已拒绝相册授权，请先授权！", // 提示的内容,
                                            showCancel: true, // 是否显示取消按钮,
                                            cancelText: "取消", // 取消按钮的文字，默认为取消，最多 4 个字符,
                                            cancelColor: "#000000", // 取消按钮的文字颜色,
                                            confirmText: "去授权", // 确定按钮的文字，默认为取消，最多 4 个字符,
                                            confirmColor: "#3CC51F", // 确定按钮的文字颜色,
                                            success: (res) => {
                                                if (res.confirm) {
                                                    wx.openSetting({

                                                        success: (res) => {

                                                            if (res.authSetting["scope.writePhotosAlbum"]) {
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
    goSave() {
        console.log(`https:${this.data.obsList[this.index].mediaUrl}`)
        wx.showLoading({
            title: '保存中...',
        })
        this.handleCamera()
            .then((res) => {
                wx.downloadFile({
                    url: `https:${this.data.obsList[this.index].mediaUrl}`, 
                    success(res) {
                        console.log(res)
                        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                        if (res.statusCode === 200) {
                            wx.saveImageToPhotosAlbum({
                                filePath: res.tempFilePath,
                                success(res) {
                                    wx.showToast({
                                        title: '保存成功!',
                                    })
                                    console.log(res)
                                },
                                fail(err) {
                                    wx.showToast({
                                        title: err,
                                    })
                                },
                                complete() {}
                            })
                        }
                    },
                    fail(e){
                        console.log(e,'ee')
                    }
                })
            }).then(()=>[
                wx.hideLoading()
            ])
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