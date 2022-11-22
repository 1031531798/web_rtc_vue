import { RtcIceResponse, RtcSdpResponse } from './../../types/room'
import { User } from './../../types/user'
import { Socket } from 'socket.io-client/build/esm/socket'
import { useRtcStore } from '@/store'
import { computed, nextTick, unref } from 'vue'
import { useJoinPeerId } from '@/hook/room'

export class MultiplayerRealTime {
  peerList: {
    [peerName: string] : RTCPeerConnection | null
  }

  roomData
  localStream: undefined | MediaStream
  socket: Socket
  store
  inboundStream: null | MediaStream
  constructor () {
    this.peerList = {}
    this.localStream = undefined
    this.socket = useRtcStore().rtcSocket as Socket
    this.store = useRtcStore()
    this.inboundStream = null
    this.roomData = computed(() => {
      return this.store.currentRoom
    })
  }

  init () {
    this.getUserMedia()
  }

  getUserMedia () {
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
          const video = document.getElementById(user.userId) as HTMLVideoElement
          if (video) {
            console.log(video, 'video')
            if ('srcObject' in video) { // 判断是否支持 srcObject 属性
              video.srcObject = stream
            }
            video.onloadedmetadata = () => {
              video.play()
            }
          }
        })
        this.socketInit()
        this.initVideo()
      })
      .catch((err) => { // 捕获错误
        console.error(err.name + ': ' + err.message)
      })
  }

  createPeerConnection (user: User) {
    const PeerConnection = window.RTCPeerConnection
    // 创建
    const peer = new PeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302'
        }
      ]
    }) as RTCPeerConnection & {
      addStream: any
      onaddstream: any
    }
    // 向PeerConnection中加入需要发送的流
    // 如果检测到媒体流连接到本地，将其绑定到一个video标签上输出
    if (this.localStream) {
      for (const track of this.localStream.getTracks()) {
        peer.addTrack(track)
      }
    }
    peer.ontrack = (event: RTCTrackEvent) => {
      nextTick(() => {
        const video = document.getElementById(user.userId) as HTMLVideoElement
        let inboundStream = null
        if (event.streams && event.streams[0]) {
          video.srcObject = event.streams[0]
        } else {
          if (!inboundStream) {
            inboundStream = new MediaStream()
            video.srcObject = inboundStream
          }
          video.autoplay = true
          inboundStream.addTrack(event.track)
        }
      })
    }
    // peer?.addStream(this.localStream)
    // peer.onaddstream = (event: any) => {
    //   console.log('检测到媒体流', event, user)
    //   let video = document.getElementById(user.userId) as HTMLVideoElement
    //   if (!video) {
    //     // 没有视频对象 就创建
    //     video = document.createElement('video')
    //   }
    //   if ('srcObject' in video) { // 判断是否支持 srcObject 属性
    //     video.srcObject = event.stream
    //   } else {
    //     video.src = window.URL.createObjectURL(event.stream)
    //   }
    //   video.autoplay = true
    //   video.id = user.userId
    //   video.onloadedmetadata = () => {
    //     video.play()
    //     console.log('播放video', video)
    //   }
    // }
    // 发送ICE候选到其他客户端
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('发送ice')
        const roomData = unref(this.roomData)
        this.socket.emit('__ice_candidate', { candidate: event.candidate, roomid: roomData.id, userId: user.userId })
      }
    }
    this.peerList[user.userId] = peer
  }

  createOffer (userId: string, peer: RTCPeerConnection | null) {
    // 发送offer，发送本地session描述
    if (peer) {
      peer.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      }).then((desc) => {
        peer.setLocalDescription(desc, () => {
          console.log('发送offer', userId)
          const roomData = unref(this.roomData)
          if (roomData.id) {
            this.socket.emit('offer', { sdp: peer.localDescription, roomid: roomData.id, userId })
          }
        }, this.errorCallBack)
      })
    }
  }

  // 用户加入
  addUser (user: User) {
    console.log('addUser', user)
    const obj = this.concatName(user)
    this.createPeerConnection(obj)
    this.createOffer(obj.userId, this.peerList[obj.userId])
  }

  initVideo () {
    const roomData = unref(this.roomData)
    if (roomData.roomPerson.length > 1) {
      roomData.roomPerson.forEach(item => {
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
    const roomData = unref(this.roomData)
    socket.on('offer', (v: RtcSdpResponse) => {
      console.log('接收到offer', v.userId)
      this.peerList[v.userId] && this.peerList[v.userId]?.setRemoteDescription(v.sdp, () => {
        this.peerList[v.userId]?.createAnswer().then((desc) => {
          this.peerList[v.userId]?.setLocalDescription(desc, () => {
            console.log('给其他用户发送 answer', v.userId)
            socket.emit('answer', { sdp: this.peerList[v.userId]?.localDescription, roomid: roomData.id, userId: v.userId })
          }, this.errorCallBack)
        })
      }, () => { // console.log(err)
      })
    })
    socket.on('answer', (v: RtcSdpResponse) => {
      this.peerList[v.userId] && this.peerList[v.userId]?.setRemoteDescription(v.sdp, () => {
        console.log('接收到answer', v.userId)
      }, () => { // console.log(err)
      })
    })
    socket.on('__ice_candidate', (v: RtcIceResponse) => {
      console.log('接收到ice')
      // 如果是一个ICE的候选，则将其加入到PeerConnection中
      if (v.candidate) {
        this.peerList[v.userId] && this.peerList[v.userId]?.addIceCandidate(v.candidate)
      }
    })
    socket.on('disconnected', (id: string) => {
      const dom = document.getElementById(id)
      if (dom) {
        dom.remove()
      }
    })
  }

  errorCallBack (e: Error) {
    throw e
  }

  closePeer (id: string) {
    console.log('退出房间', id)
    if (this.peerList[id]) {
      this.peerList[id]?.close()
      delete this.peerList[id]
    }
    console.log('peerList', this.peerList)
  }

  close () {
    for (const k in this.peerList) {
      this.peerList[k]?.close()
      this.peerList[k] = null
    }
  }

  // 处理用户对象
  concatName (user: User) {
    const obj = {} as User
    obj.userId = useJoinPeerId(user.userId)
    obj.name = user.userId
    return obj
  }

  // 关闭 媒体通讯
  disconnect () {
    this.close()
    this.localStream?.getTracks().forEach(track => {
      track.stop()
    })
  }
}
