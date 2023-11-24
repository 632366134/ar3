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
        multipleSlots: true,
        styleIsolation: 'shared'
    },
    externalClasses: ["url"],

    data: {
        isIPhoneX: app.isIPhoneX,
        modelList: [],
        collect: {},
        show: false,
        flag: false,
        message: '',
        activeIndex: 0,
        list: [],
        compList1: [],
        compList2: [],
        compList3: [],
        compList4: [],
        Collectflag: false


    },
    lifetimes: {
        attached() {
            let list = this.list = wx.getStorageSync("list")
            list = list.filter((v) => {
                return v.projectCode != "312330376891027456";
            });
            const compList1 = this.compList1 = wx.getStorageSync("compList1")
            const compList2 = this.compList2 = wx.getStorageSync("compList2")
            const compList3 = this.compList3 = wx.getStorageSync("compList3")
            const compList4 = this.compList4 = wx.getStorageSync("compList4")

            const collect = wx.getStorageSync("collect") ||{};
            if (collect) {
                this.setData({
                    collect: collect
                })
            }

            this.index = 2
            console.log(list.slice(0, this.index * 7))
            this.setData({
                list: list.slice(0, this.index * 7),
                compList1: compList1.slice(0, this.index * 7),
                compList2: compList2.slice(0, this.index * 7),
                compList3: compList3.slice(0, this.index * 7),
                compList4: compList4.slice(0, this.index * 7),
            })
        },
    },
    /**
     * 组件的初始数据
     */


    methods: {
        onReachBottom() {
            console.log('onReachBottom', this.data.activeIndex)
            let step = 7
            this.index++
            switch (this.data.activeIndex) {
                case 0:
                    this.setData({
                        list: this.list.slice(0, this.index * step),
                    })
                    break;
                case 1:
                    this.setData({
                        compList1: this.compList2.slice(0, this.index * step),
                    })

                    break;
                case 2:
                    this.setData({
                        compList2: this.compList3.slice(0, this.index * step),
                    })
                    break;
                case 3:
                    this.setData({
                        compList3: this.compList4.slice(0, this.index * step),

                    })
                    break;
                case 4:
                    this.setData({
                        compList4: this.compList4.slice(0, this.index * step),

                    })
                    break;
                default:
                    break;
            }
        },
        onChange({
            detail
        }) {
            wx.pageScrollTo({
                scrollTop: 0
            })
            this.setData({
                activeIndex: detail.index,
                flag: false
            })
            this.index = 2

        },
        goTop() {
            wx.pageScrollTo({
                scrollTop: 0
            })
        },
        onPageScroll(scrollTop) {
            console.log(scrollTop)
            if (scrollTop > 900) {
                this.setData({
                    flag: true
                })
            } else {
                this.setData({
                    flag: false
                })
            }
        },
        // collectCancel() {},
        // collectConfirm() {
        //     console.log(this.detail, this.data.collectProjectCode)
        //     if (this.detail.projectCode === this.data.collectProjectCode) {
        //         wx.removeStorageSync('collect')
        //         this.setData({
        //             collectProjectCode: ''
        //         })
        //     } else {
        //         wx.setStorageSync('collect', this.detail)
        //         this.setData({
        //             collectProjectCode: this.detail.projectCode
        //         })
        //     }
        // },
        changeCollect() {
            console.log('changeCollectchangeCollectchangeCollect')
            const collect = wx.getStorageSync('collect') || {}
            this.setData({
                collect
            })
            // this.detail = detail
            // if (this.detail.projectCode !== this.data.collectProjectCode) {
            //     this.setData({
            //         message: "是否收藏该AR项目？",
            //         show: true

            //     })
            // } else {
            //     this.setData({
            //         message: "是否取消收藏该AR项目？",
            //         show: true

            //     })
            // }
        },

        async filterProjectName(inputValue) {
            let pageNum = 2,
                pageSize = 4;
            let data1 = `pageNum=${pageNum}&pageSize=${pageSize}&projectName=${inputValue}`;
            let data2 = `pageNum=${pageNum}&pageSize=${pageSize}&CompanyName=${inputValue}`;
            let list1 = await API.selProjectsOnNameByPage(data1);
            let list2 = await API.selProjectsOnCompanyNameByPage(data2);
            let list = [...list1, ...list2];
            let string = list.map(i => JSON.stringify(i))
            list = Array.from(new Set(string))
            list = list.map(d => JSON.parse(d))
            list = list.filter((v) => {
                return v.projectCode != "312330376891027456";
            });
            if (list.length !== 0) {
                for (let i = 0; i < list.length; i++) {
                    let {
                        mediaList
                    } = await API.selMediaApps({
                        projectCode: list[i].projectCode
                    });
                    if (mediaList.some((s) => s.mediaType == 5)) {
                        list[i].mediaType = 5;
                    }
                }
                pageNum++
            } else {
                wx.showToast({
                    title: "没有更多结果",
                    icon: "error",
                });
            }
        },
        select_box(e) {
            if (this.data.flag) return;
            let data = e.currentTarget.dataset.item;
            let id = data.id;
            if (this.data.listIndex == id) {
                id = "";
                data = {};
            }
            this.setData({
                listIndex: id,
            });
            this.triggerEvent("myevent", data);
        },
    },
});