// component/xr-start/xr-start.t
let n = 0
Component({
    behaviors: [require('../common/share-behavior').default],
    innerInterval: 0,
    videoId: -1,
    /**
     * 组件的属性列表
     */
    properties: {
        obsList: {
            type: Array,
            value: []
        },
        mediaList: {
            type: Array,
            value: []
        },
        paramList: {
            type: Array,
            value: []
        },
        gltfResList: {
            type: Array,
            value: []
        },
        videoResList: {
            type: Array,
            value: []
        },
        imageResList: {
            type: Array,
            value: []
        },
    },
    observers: {
        obsList(newVal) {
            this.setData({
                obsList1: newVal
            })
        },
        mediaList(newVal) {
            this.setData({
                mediaList1: newVal
            })
        },
        paramList(newVal) {
            this.setData({
                paramList1: newVal
            })
        },
        gltfResList(newVal) {
            this.setData({
                gltfResList1: newVal
            })
        },
        videoResList(newVal) {
            this.setData({
                videoResList1: newVal
            })
        },
        imageResList(newVal) {
            this.setData({
                imageResList1: newVal
            })
        },
    },
    /**
     * 组件的初始数据
     */
    data: {
        rawData: [],
        loaded: true,
        arReady: true,
        gltfLoaded: false,
        videoLoaded: false,
        videoRatioLoaded: false,
        imageLoaded: false,
        markerWidth: 1,
        markerHeight: 1,
        obsList1: [],
        mediaList1: [],
        paramList1: [],
        videoIdList: [],
        imageIdList: [],
        gltfResList:[],
        imageResList1:[],
        videoResList1:[]

    },

    lifetimes: {
        detached() {
            clearInterval(this.innerInterval);
            this.data.mediaList1.forEach((c, v) => {
                this.scene.assets.releaseAsset('gltf', `gltf-${v}`);
            })
            this.releaseVideo();
            this.releaseImage();
            this.releaseGLTF();
            console.log('xr-startdetached')
            this.scene.removeChild(this.xrgltf);
            if (this.scene) {
                this.scene = null
            }
            if (this.anchor) {
                this.anchor = null
            }
            if (this.trs) {
                this.trs = null
            }
            if (this.GLTF) {
                this.GLTF = null
            }
            if (this.xrgltf) {
                this.xrgltf = null
            }
            if (this.tmpV3) {
                this.tmpV3 = null
            }
            if (this.gltfModel) {
                this.gltfModel = null
            }
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        releaseImage() {
            if (this.data.imageIdList && this.data.imageIdList.length > 0) {
                const scene = this.scene

                // 声明使 gltf Mesh 移除
                this.setData({
                    gltfLoaded: false
                });

                this.data.imageIdList.map((id) => {
                    // 释放加载过的资源
                    scene.assets.releaseAsset('texture', `image-${id}`);
                    scene.assets.releaseAsset('material', `image-mat${id}`);
                    this.setData({
                        imageIdList: []
                    });
                })
            }
        },
        releaseGLTF() {
            if (this.data.gltfIdList && this.data.gltfIdList.length > 0) {
                const scene = this.scene

                // 声明使 gltf Mesh 移除
                this.setData({
                    gltfLoaded: false
                });

                this.data.gltfIdList.map((id) => {
                    // 释放加载过的资源
                    scene.assets.releaseAsset('gltf', `gltf-${id}`);
                })
                this.setData({
                    gltfIdList: []
                });
            }
        },
        releaseVideo() {
            if (this.data.videoIdList && this.data.videoIdList.length > 0) {
                const scene = this.scene

                // 声明使视频 Mesh 移除
                this.setData({
                    videoLoaded: false
                });

                this.data.videoIdList.map((id) => {
                    // 释放加载过的资源
                    scene.assets.releaseAsset('video-texture', `video-${id}`);
                    scene.assets.releaseAsset('material', `video-mat-${id}`);
                })
                this.setData({
                    videoIdList: []
                });

            }
        },
        handleAssetsProgress: function ({
            detail
        }) {
            console.log('assets progress', detail.value);
        },
        handleAssetsLoaded: function ({
            detail
        }) {
            console.log('assets loaded', detail.value);
        },
        handleARReady: function () {},
        async handleReady({
            detail
        }) {
            const xrScene = this.scene = detail.value;
            console.log('xr-scene', xrScene);
            // 加载场景资源
            try {
                // await this.loadVideo(this.data.videoResList1)
                await this.loadGLTF(this.data.gltfResList1)
                await this.loadImage(this.data.imageResList1)
                await this.triggerEvent('changeShow', {
                    isShowScan: true
                })
            } catch (err) {
                console.log('[gltf load] error: ', err)
            }

        },
        async loadGLTF(gltfList) {
            console.log('gogltf')
            const scene = this.scene
            if (gltfList.length > 0) {

                console.log(gltfList)
                const gltfModel = await Promise.all(gltfList.map(gltfItem => scene.assets.loadAsset({
                    type: 'gltf',
                    assetId: 'gltf-' + gltfItem.id,
                    src: 'https:' + gltfItem.mediaUrl,
                })))
                console.log('glTF asset loaded')
                this.setData({
                    gltfLoaded: true
                })
            } else {
                console.log('gltfList', gltfList)
                this.setData({
                    gltfLoaded: false
                })
            }
        },
        // async loadVideo(videoList) {
        //     console.log('goloadvideo', videoList)
        //     const scene = this.scene
        //     if (videoList.length > 0) {
        //         const videoIdList = [];
        //         const videos = await Promise.all(videoList.map(async(videoItem) => {
        //             videoIdList.push(videoItem.id);
        //             const v = await scene.assets.loadAsset({
        //                 type: 'video-texture',
        //                 assetId: `video-${videoItem.id}`,
        //                 src: `https:${videoItem.mediaUrl}`
        //             })
        //             console.log(v)
        //             return v
        //         }))
        //         videos.map((videoTexture, index) => {
        //             const videoMat = scene.createMaterial(
        //                 scene.assets.getAsset('effect', 'standard'), {
        //                     u_baseColorMap: videoTexture.value.texture
        //                 }
        //             )
        //             scene.assets.addAsset('material', `video-mat-${videoList[index].id}`, videoMat)
        //         })
        //         console.log('video asset loaded')
        //         this.setData({
        //             videoIdList: videoIdList,
        //             // videoLoaded: false
        //         })
        //     } else {
        //         console.log('goloadvideo2', videoList)

        //         this.setData({
        //             videoIdList: [],
        //             videoLoaded: false
        //         })
        //     }
        // },
        async loadImage(imageList) {
            console.log('goimage', imageList)
            const scene = this.scene
            if (imageList.length > 0) {
                const imageIdList = [];
                const images = await Promise.all(imageList.map((imageItem) => {
                    imageIdList.push(imageItem.id);
                    return scene.assets.loadAsset({
                        type: 'texture',
                        assetId: `image-${imageItem.id}`,
                        src: 'https:' + imageItem.mediaUrl
                    })
                }))
                console.log(images[0], 'images')
                images.map((videoTexture, index) => {
                    const videoMat = scene.createMaterial(
                        scene.assets.getAsset('effect', 'standard'), {
                            u_baseColorMap: videoTexture.value
                        }
                    )
                    scene.assets.addAsset('material', `image-mat-${imageList[index].id}`, videoMat)
                })
                console.log('image asset loaded')
                this.setData({
                    imageIdList: imageIdList,
                    imageLoaded: true
                })
            } else {
                this.setData({
                    imageIdList: [],
                    imageLoaded: false
                })
            }
        },
        async loadVideo(videoItem) {
            const scene = this.scene
            this.data.videoIdList.push(videoItem.id)
            console.log(this.data.videoIdList)
            const videoTexture = await scene.assets.loadAsset({
                type: 'video-texture',
                assetId: `video-${videoItem.id}`,
                src: `https:${videoItem.mediaUrl}`,
                options: {
                    loop: true,
                    autoPlay: false
                },
            });
            console.log('videoTexture', videoTexture);
            const videoMat = scene.createMaterial(
                scene.assets.getAsset('effect', 'simple'), {
                    u_baseColorMap: videoTexture.value.texture
                }
            )
            scene.assets.addAsset('material', `video-mat-${videoItem.id}`, videoMat)
            if (videoTexture) {
                let p = videoTexture.value.width / videoTexture.value.height
                this.setData({
                    videoLoaded: true,
                    markerWidth: 1 * p,
                })
                const video = this.scene.assets.getAsset('video-texture', `video-${videoItem.id}`);
                video.play()
                console.log('video asset loaded')
            }
        },
        handleTrackerSwitch({
            detail
        }) {
            console.log('tracked match', detail)
            const active = detail.value;
            const element = detail.el;
            let obsList = this.data.obsList1
            obsList.forEach(i => {
                // const video = this.scene.assets.getAsset('video-texture', `video-${i}`);
                const markerInfo = i;
                console.log(markerInfo)
                const markerTracker = this.scene.getElementById(`marker-${markerInfo.mediaCode}`)
                if (element === markerTracker) {
                    // 处理视频纹理
                    this.releaseVideo();
                    // 匹配 tracker
                    if (active) {
                       const list = this.data.videoResList1.filter(v=> v.parentCode ===markerInfo.mediaCode)
                       console.log(list)
                        this.loadVideo(list[0])
                      }

                }

            })


        },

    }
})