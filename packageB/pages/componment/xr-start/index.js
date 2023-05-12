// component/xr-start/xr-start.t
let n = 0
let rotation
let oldRotation
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    obsList: {
      type: Array,
      default: []
    },
    mediaList: {
      type: Array,
      default: []
    },
    paramList: {
      type: Array,
      default: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
      flag:false
  },
  detached() {
    this.innerAudioContext?.destroy()

    this.data.mediaList.forEach((c, v) => {
      this.scene.assets.releaseAsset('gltf', `gltf-${v}`);
    })
    wx.offDeviceMotionChange(this.listener)
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
  },
  attached() {
    wx.startDeviceMotionListening({
      interval: 'game'
    })
    this.listener = (res) => {
      rotation = res.alpha
    }
    wx.onDeviceMotionChange(this.listener)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleARReady: function ({
      detail
    }) {
      oldRotation = rotation
      console.log('arReady', this.scene.ar.arVersion);
      if(this.data.mediaList[0].projectCode =='312330376891027456'){
        this.innerAudioContext = wx.createInnerAudioContext({
            useWebAudioImplement: true // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
          })
          this.innerAudioContext.src = 'https://arimage-search.obs.cn-north-1.myhuaweicloud.com/arkitmp3.mp3'
    
          // this.innerAudioContext.play() // 播放
         this.innerAudioContext.loop = true
    
    }
    },
    handleReady: function ({
      detail
    }) {

      const xrFrameSystem = wx.getXrFrameSystem();
      this.scene = detail.value;
      this.anchor = this.scene.getNodeById('anchor');
      this.xrgltf = this.scene.createElement(xrFrameSystem.XRGLTF, {
        'anim-autoplay': true,
        'castShadow': true,
        'receiveShadow': true
      })
      this.GLTF = this.xrgltf.getComponent(xrFrameSystem.GLTF)
      this.trs = this.xrgltf.getComponent(xrFrameSystem.Transform);
      this.tmpV3 = new(xrFrameSystem.Vector3)();
      this.scene.addChild(this.xrgltf);
    },
    async loadGLTF(gltfList) {
      const scene = this.scene
      this.gltfModel = await Promise.all(gltfList.map((gltfItem, index) => scene.assets.loadAsset({
        type: 'gltf',
        assetId: 'gltf-' + index,
        src: 'https:' + gltfItem.mediaUrl,

      })))
      this.triggerEvent('changeShow', {
        isShowScan: true
      })

    },
    handleAssetsLoaded() {
      this.loadGLTF(this.data.mediaList)

    },
    async changeModel(index) {
      this.trs.visible = true
      const anchor = this.anchor
      let params = this.data.paramList.filter((e) => {
        return e.mediaCode == this.data.mediaList[index].mediaCode
      })
      const scale = params[1].modelParamInfo.split("|");
      this.GLTF.setData({
        model: this.gltfModel[index].value
      })
      if (!anchor.visible) {
        this.trs.setData({
          scale: [scale[0],scale[1],scale[2]]
        })
      } else {
        console.log(this.scene.ar.arVersion)
        if (this.scene.ar.arVersion == 1) {
          rotation = -rotation - oldRotation
          rotation = Math.trunc(rotation)
          this.trs.setData({
            rotation:[0,rotation,0]
          })
        } else {
          wx.offDeviceMotionChange(this.listener)
        }
        this.scene.ar.placeHere(this.xrgltf, true);
        console.log(this.innerAudioContext)
      this.innerAudioContext?.play()
        this.trs.setData({
          scale: [scale[0], scale[1],scale[2]],
        })
      }
      anchor.visible = false
    },
    reset() {
      this.anchor.visible = true
      this.trs.visible = false
    },
  }
})