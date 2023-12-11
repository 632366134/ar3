// componments/collectBtn/collectBtn.js
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        flag: {
            type: Boolean,
            default: false
        },
        detail: {
            type: Object,
            default: {}
        }
    },
    observers: {},
    /**
     * 组件的初始数据
     */
    lifetimes: {
        attached() {

        }
    },
    data: {
        message: '',
        show: false,
        confirmBtnText:''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        collectCancel() {
            this.triggerEvent('collectCancel', {}, {
                bubbles: true,
                composed: true,
                capturePhase: true
            })
        },
        collectConfirm() {
            if (this.data.flag) {
                wx.removeStorageSync('collect')
                // this.setData({
                //     collect: {}
                // })
            } else {
                wx.vibrateLong({
                    success(e) {
                        console.log(e, 's')
                    },
                    fail(e) {
                        console.log(e, 'f')
    
                    }
                })
                wx.showToast({
                  title: '收藏成功',
                })
                wx.setStorageSync('collect', this.data.detail)
                // this.setData({
                //     collect: this.data.detail
                // })
            }
            this.triggerEvent('changeCollect', {}, {
                bubbles: true,
                composed: true,
                capturePhase: true
            })

        },
        goCollect({
            target
        }) {
            this.triggerEvent('goCollectModal', {}, {
                bubbles: true,
                composed: true,
                capturePhase: true
            })
            if (!this.data.flag) {
                this.setData({
                    message: "是否收藏该AR项目？",
                    show: true,
                    confirmBtnText:"收藏"

                })
            } else {
                this.setData({
                    message: "是否移除已收藏AR项目",
                    show: true,
                    confirmBtnText:"移除"


                })
            }
        },

    }
})