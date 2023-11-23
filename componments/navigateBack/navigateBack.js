// componments/navigateBack/navigateBack.js
import {
    navigateBack,switchTab
} from '../../utils/navigate'
var app = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        url: {
            type: String,
            default: ''
        },
        title3: {
            type: String,
            default: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        isIPhoneX: app.isIPhoneX,

    },

    /**
     * 组件的方法列表
     */
    methods: {
        back() {
            if (this.data.url == '') {
                wx.navigateBack()
            } else {
                if (this.data.url === 'index') {
                    switchTab("index")

                } else {
                    navigateBack(this.data.url);

                }

            }
        },
    },
});