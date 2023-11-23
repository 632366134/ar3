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
    data: {
        isIPhoneX: app.isIPhoneX,
        modelList: [],
        collectProjectCode: ''
    },
    lifetimes: {
        async ready() {
            const {
                projectCode
            } = wx.getStorageSync("collect");
            if (projectCode) {
                this.setData({
                    collectProjectCode: projectCode
                })
            }

        },
    },
    /**
     * 组件的初始数据
     */


    methods: {
        collectCancel() {},
        collectConfirm() {
            console.log(this.detail, this.data.collectProjectCode)
            if (this.detail.projectCode === this.data.collectProjectCode) {
                wx.removeStorageSync('collect')
                this.setData({
                    collectProjectCode: ''
                })
            } else {
                wx.setStorageSync('collect', this.detail)
                this.setData({
                    collectProjectCode: this.detail.projectCode
                })
            }
        },

        goCollect({
            target
        }) {
            console.log(target)
            this.detail = target.dataset.item
            if (this.detail.projectCode !== this.data.collectProjectCode) {
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
        select_box(e) {
            if (this.data.flag) return;
            let data = e.currentTarget.dataset.item;
            //   let id = data.id;
            //   if (this.data.listIndex == id) {
            //     id = "";
            //     data = {};
            //   }
            //   this.setData({
            //     listIndex: id,
            //   });
            this.triggerEvent("myevent", data);
        },
    },
});