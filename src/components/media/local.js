export class LocalRtc {
  peerA
  peerB
  offerOption
  localstream
  constructor () {
    this.peerA = undefined
    this.peerB = undefined
    this.offerOption = {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    }
    this.localstream = undefined
  }

  async call () {
    if (!this.peerA || !this.peerB) { // 判断是否有对应实例，没有就重新创建
      this.initPeer()
    }
    try {
      const offer = await this.peerB.createOffer(this.offerOption) // 创建 offer
      await this.onCreateOffer(offer)
    } catch (e) {
      console.log('createOffer: ', e)
    }
  }

  initPeer () {
    // 创建输出端 PeerConnection
    const PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
    this.peerA = new PeerConnection()
    this.peerA.addStream(this.localstream) // 添加本地流
    // 监听 A 的ICE候选信息
    // 如果收集到，就添加给 B
    this.peerA.onicecandidate = (event) => {
      if (event.candidate) {
        this.peerB.addIceCandidate(event.candidate)
      }
    }
    this.peerA.ondatachannel = (event) => {
      console.log(event)
      // this.channelA = event.channel
      // this.channelA.binaryType = 'arraybuffer'
      // this.channelA.onopen = (e) => {
      //   console.log('channelA onopen', e)
      // }
      // this.channelA.onclose = (e) => {
      //   console.log('channelA onclose', e)
      // }
      // this.channelA.onmessage = (e) => {
      //   this.receiveText = JSON.parse(e.data).name
      //   console.log('channelA onmessage', e.data)
      // }
    }
    // 创建呼叫端
    this.peerB = new PeerConnection()
    this.peerB.onaddstream = (event) => { // 监听是否有媒体流接入，如果有就赋值给 rtcB 的 src
      const video = document.querySelector('#RtcB')
      console.log('event-stream', event)
      video.srcObject = event.stream
      video.onloadedmetadata = function (e) {
        video.play()
      }
    }
    // this.channelB = this.peerB.createDataChannel('messagechannel')
    // console.log('this.channelB', this.channelB)
    // this.channelB.binaryType = 'arraybuffer'
    // this.channelB.onopen = (event) => {
    //   console.log('channelB onopen', event)
    //   this.messageOpen = true
    // }
    // this.channelB.onclose = function (event) {
    //   console.log('channelB onclose', event)
    // }
    // 监听 B 的ICE候选信息
    // 如果收集到，就添加给 A
    // this.peerB.onicecandidate = (event) => {
    //   if (event.candidate) {
    //     this.peerA.addIceCandidate(event.candidate)
    //   }
    // }
  }

  async onCreateOffer (desc) {
    try {
      await this.peerB.setLocalDescription(desc) // 呼叫端设置本地 offer 描述
    } catch (e) {
      console.log('Offer-setLocalDescription: ', e)
    }
    try {
      await this.peerA.setRemoteDescription(desc) // 接收端设置远程 offer 描述
    } catch (e) {
      console.log('Offer-setRemoteDescription: ', e)
    }
    try {
      const answer = await this.peerA.createAnswer() // 接收端创建 answer
      await this.onCreateAnswer(answer)
    } catch (e) {
      console.log('createAnswer: ', e)
    }
  }

  async onCreateAnswer (desc) {
    try {
      await this.peerA.setLocalDescription(desc) // 接收端设置本地 answer 描述
    } catch (e) {
      console.log('answer-setLocalDescription: ', e)
    }
    try {
      await this.peerB.setRemoteDescription(desc) // 呼叫端设置远程 answer 描述
    } catch (e) {
      console.log('answer-setRemoteDescription: ', e)
    }
  }

  initMedia () {
    // 判断是否有 navigator.mediaDevices，没有赋成空对象
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {}
    }

    // 继续判断是否有 navigator.mediaDevices.getUserMedia，没有就采用 navigator.getUserMedia
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia = function (prams) {
        const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia
        // 兼容获取
        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
        }
        return new Promise(function (resolve, reject) {
          getUserMedia.call(navigator, prams, resolve, reject)
        })
      }
    }
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: { min: 200, ideal: 1280, max: 300 },
        height: { min: 100, ideal: 720, max: 200 }
      }
    })
      .then(stream => {
        this.localstream = stream
        const video = document.querySelector('#Rtc')
        if ('srcObject' in video) { // 判断是否支持 srcObject 属性
          video.srcObject = stream
        } else {
          video.src = window.URL.createObjectURL(stream)
        }
        this.initPeer()
        this.call()
        video.onloadedmetadata = function (e) {
          video.play()
        }
      })
      .catch((err) => { // 捕获错误
        console.error(err.name + ': ' + err.message)
      })
  }
}
