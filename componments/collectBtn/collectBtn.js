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
    observers: {
    },
    /**
     * 组件的初始数据
     */
    lifetimes: {
        attached() {

        }
    },
    data: {
        message: '',
        show: false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        collectCancel() {},
        collectConfirm() {
            if (this.data.flag) {
                wx.removeStorageSync('collect')
                // this.setData({
                //     collect: {}
                // })
            } else {
                console.log(this.data.detail)
                wx.setStorageSync('collect', this.data.detail)
                // this.setData({
                //     collect: this.data.detail
                // })
            }
            this.triggerEvent('goCollect')

        },
        goCollect({
            target
        }) {
            if (!this.data.flag) {
                this.setData({
                    message: "是否收藏该AR项目？",
                    show: true

                })
            } else {
                this.setData({
                    message: "是否取消收藏该AR项目？",
                    show: true

                })
            }
        },

    }
})