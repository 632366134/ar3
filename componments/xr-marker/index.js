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
    }
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
    markerWidth: 1,
    markerHeight: 1,
    obsList1: [],
    mediaList1: [],
    videoIdList: []

  },

  lifetimes: {
    detached() {
      clearInterval(this.innerInterval);

      this.data.mediaList.forEach((c, v) => {
        this.scene.assets.releaseAsset('gltf', `gltf-${v}`);
      })
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
    handleARReady: function () {
      console.log('arReady', this.data.obsList)
      let paramList = this.data.paramList.filter(i => {
        let flag = this.data.mediaList.some(v => {
          return v.mediaCode == i.mediaCode
        })
        if (flag) return true
      })
      paramList.forEach(e => {
        e.modelParamInfo = e.modelParamInfo.split("|")
      })
      console.log(paramList)
      this.setData({
        obsList1: this.data.obsList,
        mediaList1: this.data.mediaList,
        paramList1: paramList

      })

    },
    async handleReady({
      detail
    }) {
      const xrScene = this.scene = detail.value;
      console.log('xr-scene', xrScene);
      // 加载场景资源
      const gltfResList = [];
      const videoResList = [];

      const markerList = this.data.mediaList;
      for (let i = 0; i < markerList.length; i++) {
        const marker = markerList[i];
        switch (marker.mediaType) {
          case 5:
            gltfResList.push(marker);
            break;
          case 4:
            videoResList.push(marker);
            break;
        }
      }
      console.log(gltfResList, videoResList)
      try {
        console.log('1')
        await this.loadVideo(videoResList)
        console.log('2')
        await this.loadGLTF(gltfResList)
        console.log('3')
        await this.triggerEvent('changeShow', {
          isShowScan: true,
        arReady: true,

        })
      } catch (err) {
        console.log('[marker load] error: ', err)
      }
    },
    // handleReady({
    //   detail
    // }) {
    //   let {
    //     obsList,
    //     mediaList,
    //     paramList
    //   } = this.data
    //   let rawData = []
    //   let rawObj = {}
    //   let mpList = []
    //   let omList = []
    //   let pmlist = []
    //   paramList = paramList.filter(i => {
    //     let flag = mediaList.some(v => {
    //       return v.mediaCode == i.mediaCode
    //     })
    //     if (flag) return true
    //   })
    //   console.log(obsList, mediaList, paramList)
    //   obsList.forEach((item, index) => {
    //     omList = mediaList.filter((item2) => {
    //       return item2.parentCode == item.mediaCode
    //     })
    //     omList.forEach((item3) => {
    //       mpList = paramList.filter(item4 => {
    //         return item3.mediaCode == item4.mediaCode
    //       })
    //       const position = mpList[0].modelParamInfo.split("|");
    //       const scale = mpList[1].modelParamInfo.split("|");
    //       const roation = mpList[2].modelParamInfo.split("|");
    //       pmlist.push([position, scale, roation])
    //     })


    //     rawObj = {
    //       obsList: [item],
    //       mediaList: omList,
    //       paramList: pmlist
    //     }
    //     rawData.push(rawObj)
    //   })
    //   this.setData({
    //     rawData,
    //     assetsFlag: true
    //   })
    //   console.log(rawData)
    //   const xrFrameSystem = wx.getXrFrameSystem();
    //   this.scene = detail.value;
    //   // this.anchor = this.scene.getNodeById('anchor');
    //   // this.xrgltf = this.scene.createElement(xrFrameSystem.XRGLTF)
    //   // this.GLTF = this.xrgltf.getComponent(xrFrameSystem.GLTF)
    //   // this.trs = this.xrgltf.getComponent(xrFrameSystem.Transform);
    //   // this.tmpV3 = new(xrFrameSystem.Vector3)();
    //   // this.scene.addChild(this.xrgltf);
    //   this.triggerEvent('changeShow', {
    //     isShowScan: true
    //   })
    // },
    async loadGLTF(gltfList) {
      console.log('gogltf')
      const scene = this.scene
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
    },
    // async loadVideoSingle(videoItem) {

    //     const scene = this.scene
    //     console.log(videoItem)
    //     const videoTexture = await scene.assets.loadAsset({
    //         type: 'video-texture',
    //         assetId: `video-` + videoItem.id,
    //         src: 'https:' + videoItem.mediaUrl,
    //         options: {
    //             autoPlay: true
    //         },
    //     });
    //     console.log('videoTexture', videoTexture);
    //     const videoMat = scene.createMaterial(
    //         scene.assets.getAsset('effect', 'simple'), {
    //             u_baseColorMap: videoTexture.value.texture
    //         }
    //     )
    //     scene.assets.addAsset('material', `video-mat-${videoItem.id}`, videoMat)

    //     console.log('video asset loaded')
    //     this.setData({
    //         videoLoaded: true,
    //     })
    // },
    async loadVideo(videoList) {
      console.log('goloadvideo', videoList)
      const scene = this.scene
      if (videoList.length > 0) {
        const videoIdList = [];
        const videos = await Promise.all(videoList.map((videoItem) => {
          videoIdList.push(videoItem.id);
          return scene.assets.loadAsset({
            type: 'video-texture',
            assetId: `video-${videoItem.id}`,
            src: 'https:' + videoItem.mediaUrl,
            options: {
              // autoPlay: true,
              loop: true
            },
          })
        }))
        videos.map((videoTexture, index) => {
          const videoMat = scene.createMaterial(
            scene.assets.getAsset('effect', 'standard'), {
              u_baseColorMap: videoTexture.value.texture
            }
          )
          scene.assets.addAsset('material', `video-mat-${videoList[index].id}`, videoMat)
        })
        console.log('video asset loaded')
        this.setData({
          videoIdList: videoIdList,
          // videoLoaded: true
        })
      } else {
        this.setData({
          videoIdList: [],
          videoLoaded: false
        })
      }
    },
    releaseVideo(id) {
      if (id !== -1) {
        // 存在纹理才进行释放
        const scene = this.scene
        // 释放加载过的资源
        scene.assets.releaseAsset('video-texture', `video-${id}`);
        scene.assets.releaseAsset('material', `video-mat-${id}`);
      }
    },
    handleTrackerSwitch({
      detail
    }) {
      console.log('tracked match', detail)

      const active = detail.value;
      this.data.videoIdList.forEach(i => {
        // this.releaseVideo(i);
        const video = this.scene.assets.getAsset('video-texture', `video-${i}`);
        console.log(i, video)
        if (video) {
          let p = video.width / video.height
          this.setData({
            videoLoaded: true,
            markerWidth: 1 * p,
          })
          active ? video.play() : video.stop();

        }
      })

      // if (this.data.loaded) {
      //     const element = detail.el;
      //     const active = detail.value;
      //     const data = this.data;
      //     const markerList = data.mediaList;
      //     for (let i = 0; i < markerList.length; i++) {
      //         const markerInfo = markerList[i];
      //         const markerTracker = this.scene.getElementById(`marker-${markerInfo.parentCode}`)

      //         if (element === markerTracker) {
      //             // 处理视频纹理
      //             this.releaseVideo(this.videoId);
      //             this.videoId = -1;
      //             // 匹配 tracker
      //             switch (markerInfo.mediaType) {
      //                 case 'scan': // scan
      //                     this.scanHandler(markerTracker, markerInfo, active);
      //                     break;
      //                 case 4: // video
      //                     // if (active) {
      //                     //     console.log(markerInfo)
      //                     //     this.videoHanler(markerInfo);
      //                     // }
      //                     break;
      //                 case 5: // gltf
      //                     break;
      //             }
      //             // this.triggerEvent('trackerchange', {
      //             //   name: markerInfo.name,
      //             //   active: active,
      //             //   type: markerInfo.renderType,
      //             // })
      //         }
      //     }
      // }
    },
    scanHandler(markerTracker, markerInfo, active) {
      const renderType = markerInfo.renderType
      const xrFrameSystem = wx.getXrFrameSystem()
      const camera = this.scene.getElementById('camera').getComponent(xrFrameSystem.Camera);
      const trackerTRS = markerTracker.getComponent(xrFrameSystem.Transform)
      const rightTRS = this.scene.getElementById(`normal-right-${markerInfo.id}`).getComponent(xrFrameSystem.Transform);
      const trackerPos = camera.convertWorldPositionToClip(trackerTRS.worldPosition)
      const rightPos = camera.convertWorldPositionToClip(rightTRS.worldPosition)
      const posX = ((trackerPos.x + 1) / 2)
      const posY = (1 - (trackerPos.y + 1) / 2)
      const rightPosX = ((rightPos.x + 1) / 2)

      // 获取识别图，图片比例
      let widthDivideHeight = 1
      wx.getImageInfo({
        src: markerInfo.markerImage,
        success: res => {
          const {
            width,
            height
          } = res
          widthDivideHeight = width / height
        },
        fail: res => {
          console.error(res)
        }
      })
      // 通知上层
      this.triggerEvent('trackerchange', {
        name: markerInfo.name,
        active: active,
        type: renderType,
        trackerInfo: {
          x: posX,
          y: posY,
          halfWidth: rightPosX - posX,
          widthDivideHeight
        }
      })
      if (active) {
        // 激活态开启tracker位置同步
        let preX = posX;
        let preY = posY;
        let preR = rightPosX
        this.innerInterval = setInterval(() => {
          const tPos = camera.convertWorldPositionToClip(trackerTRS.worldPosition)
          const rPos = camera.convertWorldPositionToClip(rightTRS.worldPosition)
          const pX = ((tPos.x + 1) / 2)
          const pY = (1 - (tPos.y + 1) / 2)
          const rX = ((rPos.x + 1) / 2)

          const dX = Math.abs(pX - preX)
          const dY = Math.abs(pY - preY)
          const dR = Math.abs(rX - preR)

          if (dX > 0.005 || dY > 0.005 || dR > 0.005) {
            preX = pX;
            preY = pY;
            preR = rX
            this.triggerEvent('trackermove', {
              active: true,
              type: 'scan',
              trackerInfo: {
                x: pX,
                y: pY,
                halfWidth: rX - pX,
                widthDivideHeight
              }
            })
          }
        }, 40)
      } else {
        // 取消态去除tracker位置同步
        clearInterval(this.innerInterval)
        this.triggerEvent('trackermove', {
          active: false,
          type: 'scan',
          trackerInfo: {
            x: 0,
            y: 0,
            halfWidth: 0
          }
        })
      }

    },
    videoHanler(markerInfo) {
      this.setData({
        videoLoaded: false,
        videoRatioLoaded: false,
      })

      this.setData({
        markerWidth: 1.5,
        markerHeight: 1,
        videoRatioLoaded: true,
      });
      try {
        this.loadVideoSingle(markerInfo)
      } catch (err) {
        console.log('[video load] error: ', err)
      }

      this.videoId = markerInfo.id;
    }

  }
})