// componments/myDialog/myDialog.js
Component({
    options: {
        styleIsolation: 'shared',
    },
    /**
     * 组件的属性列表
     */
    properties: {
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: "提示"
        },
        message: {
            type: String,
            default: ""
        },
        confirmBtnText:{
            type: String,
            default: ""
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
      
    },

    /**
     * 组件的方法列表
     */
    methods: {
        collectConfirm() {
            this.triggerEvent('collectConfirm',{})
        },
        collectCancel(){
            this.triggerEvent('collectCancel',{})

        }
    }
})