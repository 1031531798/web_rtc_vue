<template>
  <div class="home">
    <header>
      <div>webRtc demo</div>
      <div>sokcetId: {{user.name}}</div>
    </header>
    <div class="home-body">
      <video ref="video1">
      </video>
      <video ref="video2">
      </video>
    </div>
    <div class="control-box">
      <input id="messageInput" v-model="text" />
      <button @click="sendMessage('1')">发送主机</button>
      <button @click="sendMessage('2')">发送连接者</button>
    </div>
    <p>消息</p>
    <div class="message-box">
    </div>
    <div class="home-body">
      <video>
      </video>
    </div>
    <p>消息2</p>
    <div class="message-box">

    </div>
    <div v-for="(item, index) in forList" :key="index">
      <div>{{item.name}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
<<<<<<< HEAD
type RTCSdpType = 'answer' | 'offer' | 'pranswer' | 'rollback';

interface RTCSessionDescriptionInit {
    sdp?: string;
    type: RTCSdpType;
}
// import SimplePeer from 'simple-peer'
=======
import SimplePeer from 'simple-peer'
import { DeepstreamClient } from '@deepstream/client'
import { getImageList } from '@/api'
import { io } from 'socket.io-client'
// import SimplePeer from 'simple-peer'
import { User } from '@/types/user'
type SubscribeType = {
  sender: string
  signal: any
}
>>>>>>> main
export default defineComponent({
  name: 'HomeView',
  components: {
  },
  setup () {
    const text = ref<string>('')
<<<<<<< HEAD
    // 创建本地RTC对象
    const localConnection = new RTCPeerConnection()
    const sendChannel = localConnection.createDataChannel('sendChannel')
    let receiveChannel
=======
    const video1 = ref<HTMLVideoElement>()
    const video2 = ref<HTMLVideoElement>()
    const user = ref<User>({
      name: '-'
    })
    const isReceive = ref<boolean>(document.location.hash === '#init')
    const ds = new DeepstreamClient('localhost:8080')
    const forList = ref()
    forList.value = [
      { name: '第一' },
      { name: '第二' },
      { name: '第三' },
      { name: '第四' }
    ]

    // 发送数据
>>>>>>> main
    function sendMessage (type: string) {
      const messageInputBox = document.getElementById('messageInput') as HTMLInputElement
      if (type === '1') {
        // 发送主机端
        const message = messageInputBox?.value
<<<<<<< HEAD
        sendChannel.send(message)
=======
        forList.value.splice(1, 1)
        console.log(forList.value)
>>>>>>> main
        messageInputBox.value = ''
        messageInputBox.focus()
      } else {
        // 发送给连接者
      }
    }
<<<<<<< HEAD
    sendChannel.onopen = handleSendChannelStatusChange
    sendChannel.onclose = handleSendChannelStatusChange
    // 创建远程RTC对象
    const remoteConnection = new RTCPeerConnection()
    remoteConnection.ondatachannel = (event) => {
      console.log('接受节点消息', event)
      receiveChannel = event.channel
      receiveChannel.onmessage = handleReceiveMessage
      receiveChannel.onopen = () => {
        console.log('open data channel')
      }
      receiveChannel.onclose = () => {
        console.log('close data channel')
      }
    }
    if (localConnection) {
      localConnection.createOffer()
        .then(offer => {
          console.log(offer)
          return localConnection.setLocalDescription(offer)
        })
        .then(() => remoteConnection.setRemoteDescription(localConnection.localDescription as RTCSessionDescriptionInit,
          () => console.log('成功'), () => console.log('失败')
        )) // 配置本地连接
        .then(() => remoteConnection.createAnswer())
        .then(answer => remoteConnection.setLocalDescription(answer))
        .then(() => localConnection.setRemoteDescription(remoteConnection.localDescription as RTCSessionDescriptionInit, () => console.log('成功'), () => console.log('失败'))) // 配置远程连接
        .catch()
    }
    function handleSendChannelStatusChange (event: any) {
      console.log(event)
    }
    function handleReceiveMessage (event: any) {
      console.log(event)
    }
    onMounted(() => {
      // const promise = navigator.mediaDevices.getUserMedia(
      //   { audio: false, video: true }
      // )
      // promise.then((stream) => {
      //   const video = document.querySelector('video')
      //   if (video) {
      //     video.srcObject = stream
      //     video.play()
      //   }
      // })
    })
    // const p2 = new SimplePeer({
    //   initiator: document.location.hash === '#initiator'
    // })
    // p2.on('error', (err: any) => {
    //   console.log('error', err)
    // })
    // p2.on('signal', (data: any) => {
    //   console.log('SIGNAL', JSON.stringify(data))
    // })
    // p2.on('connect', () => {
    //   console.log('CONNECT')
    //   p2.send('whatever' + Math.random())
    // })
    // p2.on('data', (data: any) => {
    //   console.log('data: ' + data)
    // })
    // console.log(p2, 'P2')
    // return {
    // }
    return {
      text,
      sendMessage
=======

    onMounted(() => {
      const socket = io('http://localhost:3000')
      // 向指定的服务器建立连接，地址可以省略
      socket.on('login', (data: any) => {
        user.value.name = data
      })
      // 自定义msg事件，发送‘你好服务器’字符串向服务器
      socket.on('msg', (data: any) => {
        // 监听浏览器通过msg事件发送的信息
        console.log('接收到服务器数据', data)// 你好浏览器
      })
      // 房间已满
      socket.on('full', (room) => { // 如果从服务端收到 "full" 消息
        console.log('Room ' + room + ' is full')
      })
      // 房间空
      socket.on('empty', (room) => { // 如果从服务端收到 "empty" 消息
        console.log('Room ' + room + ' is empty')
      })
      socket.on('join', (room) => { // 如果从服务端收到 “join" 消息
        console.log('加入房间成功： ' + room)
      })
      // navigator.mediaDevices.getUserMedia({
      //   video: true,
      //   audio: false
      // }).then(gotMedia).catch((e) => {
      //   console.error('media 构建失败', e)
      // })
      // gotMedia()
    })
    return {
      text,
      video1,
      video2,
      isReceive,
      sendMessage,
      forList,
      user
>>>>>>> main
    }
  }
})
</script>
<<<<<<< HEAD
=======
<style scoped>
video {
  width: 300px;
  height: 150px;
}
</style>
>>>>>>> main
