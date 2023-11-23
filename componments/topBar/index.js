// packageA/components/topBar/index.js
const app = getApp();

Component({

    /**
     * 组件的属性列表
     */
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    properties: {
        text: {
            default: '',
            type: String
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

    }
})