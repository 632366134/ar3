// packageA/pages/allImageList/allImageList.js
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
        obsList: [],
        selecting: false,
        as: false,
        length: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad({
        param
    }) {
        this.selectList = []
        param = decodeURIComponent(param)
        param = JSON.parse(param)
        console.log(param)
        this.setData({
            obsList: param.obsList
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
    selectObs({
        currentTarget
    }) {
        console.log(currentTarget)
        let {
            index
        } = currentTarget.dataset
        let obsList = this.data.obsList
        if (!obsList[index].select) {
            this.selectList.push(index)
            this.selectList.sort((a, b) => a - b)
            obsList[index].select = true
            this.setData({
                selecting: true,
                obsList: obsList,
                length: this.selectList.length
            })
        } else {
            let index2 = this.selectList.findIndex(v => v === index)
            this.selectList.splice(index2, 1)
            this.selectList.sort((a, b) => a - b)
            obsList[index].select = false
            if (this.selectList.length === 0) {
                this.setData({
                    selecting: true,
                    obsList: obsList,
                    length: this.selectList.length

                })
            } else {
                this.setData({
                    selecting: true,
                    obsList: obsList,
                    length: this.selectList.length

                })
            }

        }

    },
    cancelSelect() {
        let obsList = this.data.obsList
        obsList.forEach(v => {
            v.select = false
        })
        this.selectList = []

        this.setData({
            as: false,
            selecting: false,
            obsList,
            length: 0

        })
    },
    allSelect() {
        let obsList = this.data.obsList
        obsList.forEach(v => {
            v.select = true
        })
        this.selectList = [...new Array(obsList.length).keys()]
        this.setData({
            as: true,
            obsList,
            length: this.selectList.length

        })

    },
    NoSelect() {
        let obsList = this.data.obsList
        obsList.forEach(v => {
            v.select = false
        })
        this.selectList = []
        this.setData({
            as: false,
            obsList,
            length: this.selectList.length

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
                                                    wx.hideLoading()
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
                    wx.hideLoading()
                }, // 用户拒绝授权
                complete: () => {}
            })
        });

    },
    goSave() {
        let obsList = this.data.obsList

        console.log(this.selectList)
        wx.showLoading({
            title: '保存中...',
        })
        this.handleCamera()
            .then((res) => {
                this.selectList.forEach((v, i) => {
                    wx.downloadFile({
                        url: `https:${obsList[v].mediaUrl}`,
                        success:(res)=> {
                            console.log(res)
                            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                            if (res.statusCode === 200) {
                                console.log(this.selectList)
                                wx.saveImageToPhotosAlbum({
                                    filePath: res.tempFilePath,
                                    success:(res)=> {
                                        if (i === this.selectList.length - 1){
                                            wx.showToast({
                                                title: '保存成功!',
                                            })
                                        }
                                            
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
                        fail(e) {
                            wx.showToast({
                                title: e,
                            })
                            console.log(e, 'ee')
                        }
                    })
                })

            }).then(() => {
                // wx.hideLoading()
            })
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