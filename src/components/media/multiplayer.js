import { useRtcStore } from '@/store'
import { computed, nextTick } from 'vue'
import { useJoinPeerId } from '@/hook/room'
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
    this.roomData = computed(() => {
      return this.store.currentRoom
    })
  }

  init () {
    this.getUserMedia()
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
      audio: true,
      video: {
        width: { min: 200, ideal: 1280, max: 300 },
        height: { min: 100, ideal: 720, max: 200 }
      }
    })
      .then(stream => {
        this.localStream = stream
        const user = this.store.user

        nextTick(() => {
          const video = document.getElementById(user.userId)
          console.log(video, 'video')
          if ('srcObject' in video) { // 判断是否支持 srcObject 属性
            video.srcObject = stream
          } else {
            video.src = window.URL.createObjectURL(stream)
          }
          video.onloadedmetadata = () => {
            video.play()
          }
        })
        this.socketInit()
        this.initVideo()
      })
      .catch((err) => { // 捕获错误
        console.error(err.name + ': ' + err.message)
      })
  }

  createPeerConnection (user) {
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
      nextTick(() => {
        let video = document.getElementById(user.userId)
        console.log('媒体流', event.stream)
        if (video) {
          if ('srcObject' in video) { // 判断是否支持 srcObject 属性
            video.srcObject = event.stream
          } else {
            video.src = window.URL.createObjectURL(event.stream)
          }
        } else {
          video = document.createElement('video')
          video.controls = true
          video.autoplay = 'autoplay'
          video.srcObject = event.stream
          video.id = user.userId
        // videoBox.append(video)
        }
        video.onloadedmetadata = () => {
          video.play()
          console.log('播放video', video)
        }
      })
    }
    // 发送ICE候选到其他客户端
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('发送ice')
        this.socket.emit('__ice_candidate', { candidate: event.candidate, roomid: this.roomData.id, userId: user.userId })
      }
    }
    this.peerList[user.userId] = peer
  }

  createOffer (userId, peer) {
    // 发送offer，发送本地session描述
    peer.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    }).then((desc) => {
      peer.setLocalDescription(desc, () => {
        console.log('发送offer', userId)
        this.socket.emit('offer', { sdp: peer.localDescription, roomid: this.roomData.id, userId })
      })
    })
  }

  // 用户加入
  addUser (user) {
    console.log('addUser', user)
    const obj = this.concatName(user)
    this.createPeerConnection(obj)
    this.createOffer(obj.userId, this.peerList[obj.userId])
  }

  initVideo () {
    if (this.roomData.roomPerson.length > 1) {
      this.roomData.roomPerson.forEach(item => {
        const { userId } = item
        if (!this.peerList[userId] && userId !== this.store.user.userId) {
          this.createPeerConnection(this.concatName(item))
        }
      })
      for (const k in this.peerList) {
        this.createOffer(k, this.peerList[k])
      }
    }
  }

  socketInit () {
    const socket = this.socket
    socket.on('offer', v => {
      console.log('接收到offer', v.userId)
      this.peerList[v.userId] && this.peerList[v.userId].setRemoteDescription(v.sdp, () => {
        this.peerList[v.userId].createAnswer().then((desc) => {
          this.peerList[v.userId].setLocalDescription(desc, () => {
            console.log('给其他用户发送 answer', v.userId)
            socket.emit('answer', { sdp: this.peerList[v.userId].localDescription, roomid: this.roomData.id, userId: v.userId })
          })
        })
      }, () => { // console.log(err)
      })
    })
    socket.on('answer', v => {
      this.peerList[v.userId] && this.peerList[v.userId].setRemoteDescription(v.sdp, () => {
        console.log('接收到answer', v.userId)
      }, () => { // console.log(err)
      })
    })
    socket.on('__ice_candidate', v => {
      console.log('接收到ice')
      // 如果是一个ICE的候选，则将其加入到PeerConnection中
      if (v.candidate) {
        this.peerList[v.userId] && this.peerList[v.userId].addIceCandidate(v.candidate)
      }
    })
    socket.on('disconnected', id => {
      const dom = document.getElementById(id)
      if (dom) {
        dom.remove()
      }
    })
  }

  closePeer (id) {
    console.log('退出房间', id)
    if (this.peerList[id]) {
      this.peerList[id].close()
      delete this.peerList[id]
    }
    console.log('peerList', this.peerList)
  }

  close () {
    for (const k in this.peerList) {
      this.peerList[k].close()
      this.peerList[k] = null
    }
  }

  // 处理用户对象
  concatName (user) {
    const obj = {}
    obj.userId = useJoinPeerId(user.userId)
    obj.name = user.userId
    return obj
  }

  // 关闭 媒体通讯
  disconnect () {
    this.close()
    this.localStream.getTracks().forEach(track => {
      track.stop()
    })
  }
}
