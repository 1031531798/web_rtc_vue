import { useRtcStore } from '@/store'
export class MultiplayerRealTime {
  peerList
  roomData
  localStream
  socket
  store
  constructor () {
    this.peerList = {}
    this.localStream = undefined
    this.socket = useRtcStore().rtcSocket
    this.store = useRtcStore()
    this.roomData = this.store.currentRoom
  }

  init () {
    this.getUserMedia()
    this.socketInit()
  }

  getUserMedia () {
    // 兼容浏览器的getUserMedia写法
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
        this.localStream = stream
        const video = document.querySelector('#Rtc')
        if ('srcObject' in video) { // 判断是否支持 srcObject 属性
          video.srcObject = stream
        } else {
          video.src = window.URL.createObjectURL(stream)
        }
        video.onloadedmetadata = function (e) {
          video.play()
        }
        this.initVideo()
      })
      .catch((err) => { // 捕获错误
        console.error(err.name + ': ' + err.message)
      })
  }

  createPeerConnection (user) {
    const videoBox = document.querySelector('.room-video')
    console.log('添加video', videoBox)
    const iceServer = {
      iceServers: [
        {
          url: 'stun:stun.l.google.com:19302'
        }
      ]
    }
    // 兼容浏览器的PeerConnection写法
    const PeerConnection = (window.RTCPeerConnection ||
                    window.webkitRTCPeerConnection ||
                    window.mozRTCPeerConnection)
    // 创建
    const peer = new PeerConnection(iceServer)
    // 向PeerConnection中加入需要发送的流
    peer.addStream(this.localStream)

    // 如果检测到媒体流连接到本地，将其绑定到一个video标签上输出
    peer.onaddstream = (event) => {
      // console.log('event-stream', event);
      const videos = document.querySelector('#' + user.userId)
      if (videos) {
        videos.srcObject = event.stream
      } else {
        const video = document.createElement('video')
        video.controls = true
        video.autoplay = 'autoplay'
        video.srcObject = event.stream
        video.id = user.userId
        videoBox.append(video)
      }
    }
    // 发送ICE候选到其他客户端
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('__ice_candidate', { candidate: event.candidate, roomid: this.roomData.id, userId: user.userId })
      }
    }
    // console.log('v.userId', v.userId);
    this.peerList[user.userId] = peer
  }

  createOffer (userId, peer) {
    // 发送offer，发送本地session描述
    peer.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    }).then((desc) => {
      // console.log('send-offer', desc);
      peer.setLocalDescription(desc, () => {
        this.socket.emit('offer', { sdp: peer.localDescription, roomid: this.roomData.id, userId })
      })
    })
  }

  initVideo () {
    this.roomData.roomPerson.forEach(item => {
      const { userId } = item
      if (!this.peerList[userId] && userId !== this.store.user.userId) {
        this.createPeerConnection(item)
      }
    })

    for (const k in this.peerList) {
      console.log(this.peerList)
      this.createOffer(k, this.peerList[k])
    }
  }

  socketInit () {
    const socket = this.socket
    socket.on('offer', v => {
      // console.log('take_offer', this.peerList[v.userId]);
      this.peerList[v.userId] && this.peerList[v.userId].setRemoteDescription(v.sdp, () => {
        this.peerList[v.userId].createAnswer().then((desc) => {
          // console.log('send-answer', desc);
          this.peerList[v.userId].setLocalDescription(desc, () => {
            socket.emit('answer', { sdp: this.peerList[v.userId].localDescription, roomid: this.roomData.id, userId: v.userId })
          })
        })
      }, () => { // console.log(err)
      })
    })
    socket.on('answer', v => {
      this.peerList[v.userId] && this.peerList[v.userId].setRemoteDescription(v.sdp, () => {
        console.log('11')
      }, () => { // console.log(err)
      })
    })
    socket.on('__ice_candidate', v => {
      // console.log('take_candidate', v.candidate);
      // 如果是一个ICE的候选，则将其加入到PeerConnection中
      if (v.candidate) {
        this.peerList[v.userId] && this.peerList[v.userId].addIceCandidate(v.candidate)
      }
    })
    socket.on('disconnected', id => {
      // console.log('disconnected', id);
      const dom = document.querySelector('#' + id)
      if (dom) {
        dom.remove()
      }
    })
  }

  close () {
    for (const k in this.peerList) {
      this.peerList[k].close()
      this.peerList[k] = null
    }
  }
}
