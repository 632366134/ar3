// componments/searchRowHistroy/searchRowHistroy.js
const app = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        historyList: {
            type: Array,
            default: []
        },
        historyFlag: {
            type: Boolean,
            default: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        isIPhoneX: app.isIPhoneX,
        SearchHistoryList: []

    },
    pageLifetimes: {
        show() {
            const SearchHistoryList = wx.getStorageSync('SearchHistoryList') || []
            this.setData({
                SearchHistoryList
            })

        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        delete() {
            wx.removeStorageSync('SearchHistoryList')
            this.setData({
                SearchHistoryList: []
            })
        },
        goSearch() {
            this.triggerEvent("myevent1");
        },
        goSearch2({
            currentTarget
        }) {
            this.triggerEvent("myevent2", currentTarget.dataset.item);
        },
        myKeyinput(e) {
            console.log(e)
            this.triggerEvent("myKeyinput", e);
        },
        myevent1() {
            this.triggerEvent("myevent1");
        },
        // deleteHistory() {
        //     this.triggerEvent("deleteHistory");
        // }
    },
});