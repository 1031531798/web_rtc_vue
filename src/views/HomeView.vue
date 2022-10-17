<template>
  <div class="home">
    <header>webRtc demo</header>
    <div class="home-body">
      <video>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
type RTCSdpType = 'answer' | 'offer' | 'pranswer' | 'rollback';

interface RTCSessionDescriptionInit {
    sdp?: string;
    type: RTCSdpType;
}
// import SimplePeer from 'simple-peer'
export default defineComponent({
  name: 'HomeView',
  components: {
  },
  setup () {
    const text = ref<string>('')
    // 创建本地RTC对象
    const localConnection = new RTCPeerConnection()
    const sendChannel = localConnection.createDataChannel('sendChannel')
    let receiveChannel
    function sendMessage (type: string) {
      const messageInputBox = document.getElementById('messageInput') as HTMLInputElement
      if (type === '1') {
        // 发送主机端
        const message = messageInputBox?.value
        sendChannel.send(message)
        messageInputBox.value = ''
        messageInputBox.focus()
      } else {
        // 发送给连接者
      }
    }
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
    }
  }
})
</script>
