// componments/collectList.js
const {
    API
} = require("../../utils/request");

var app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多 slot 支持
    },
    externalClasses: ["url"],
    properties: {
        list: {
            type: Array,
            value: []
        },
        flag: {
            type: Boolean,
            value: false,
        },
        inputValue: {
            type: String
        }
    },
    observers: {
        // collect(newval) {
        //     console.log(newval)
        //     if (newval && newval.projectCode === this.data.borchureDetail.projectCode) {
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
    data: {
        isIPhoneX: app.isIPhoneX,
        modelList: [],
        collect: {},
        isMask: false,
        borchureDetail: {}
    },
    lifetimes: {
        async ready() {
            const collect = wx.getStorageSync("collect");
            if (collect) {
                this.setData({
                    collect
                })
            }

        },
    },
    /**
     * 组件的初始数据
     */


    methods: {
        tap() {},
        changeMask() {
            const collect = wx.getStorageSync('collect') || {}
          
            this.setData({
                isMask: false,
                collect

            });
        },
        goCollectPriview({
            currentTarget
        }) {
            console.log(currentTarget)
            this.setData({
                borchureDetail: currentTarget.dataset.item,
                isMask: true
            })
        },
        changeCollect() {
            console.log('uzch collect')
            const collect = wx.getStorageSync('collect') || {}
            this.setData({
                collect
            })
        },
        // select_box(e) {
        //     if (this.data.flag) return;
        //     let data = e.currentTarget.dataset.item;
        //     //   let id = data.id;
        //     //   if (this.data.listIndex == id) {
        //     //     id = "";
        //     //     data = {};
        //     //   }
        //     //   this.setData({
        //     //     listIndex: id,
        //     //   });
        //     this.triggerEvent("myevent", data);
        // },
    },
});