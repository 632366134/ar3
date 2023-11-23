// packageA/components/compBox/index.js
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        compItem: {
            type: Object,
            default: {}
        },
        collect: {
            type: Object,
            default: {}
        }
    },
    observers: {
        collect(newval) {

            if (newval && newval.projectCode === this.data.compItem.projectCode) {
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
    lifetimes: {
        // ready() {
        //     const collect = wx.getStorageSync('collect') || {}
        //     if (collect.projectCode === this.data.compItem.projectCode) {
        //         this.setData({
        //             flag: true
        //         })
        //     } else {
        //         this.setData({
        //             flag: false
        //         })
        //     }
        // }
    },
    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        goCollect() {
            this.triggerEvent('changecollectProjectCode')
        },
        changeCollect() {

        }
    }
})