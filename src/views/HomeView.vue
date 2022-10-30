<template>
  <div class="home">
    <header>webRtc demo</header>
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
import SimplePeer from 'simple-peer'
import { DeepstreamClient } from '@deepstream/client'
import { getImageList } from '@/api'
import { io } from 'socket.io-client'
// import SimplePeer from 'simple-peer'
type SubscribeType = {
  sender: string
  signal: any
}
export default defineComponent({
  name: 'HomeView',
  components: {
  },
  setup () {
    const text = ref<string>('')
    const video1 = ref<HTMLVideoElement>()
    const video2 = ref<HTMLVideoElement>()
    const isReceive = ref<boolean>(document.location.hash === '#init')
    const ds = new DeepstreamClient('localhost:8081')
    const forList = ref()
    forList.value = [
      { name: '第一' },
      { name: '第二' },
      { name: '第三' },
      { name: '第四' }
    ]

    // 发送数据
    function sendMessage (type: string) {
      const messageInputBox = document.getElementById('messageInput') as HTMLInputElement
      if (type === '1') {
        // 发送主机端
        const message = messageInputBox?.value
        forList.value.splice(1, 1)
        console.log(forList.value)
        messageInputBox.value = ''
        messageInputBox.focus()
      } else {
        // 发送给连接者
      }
    }

    function gotMedia (stream?: MediaStream) {
      // 创建管道
      const peer1 = new SimplePeer({ initiator: true })
      // const peer2 = new SimplePeer({ stream: stream })
      const userName = 'user/' + ds.getUid()
      console.log('my userName', userName)
      // 启动信令
      peer1.on('signal', (signal: string) => {
        ds.event.emit('rtc-signal', {
          sender: userName,
          signal
        })
        // peer2.signal(data)
      })
      ds.event.subscribe('rtc-signal', msg => {
        const data = msg as SubscribeType
        if (data && data.sender !== userName) {
          // 如果不是我的消息
          console.log('rtc-signal', msg)
          peer1.signal(data.signal)
        }
      })
      // peer2.on('signal', data => {
      //   peer1.signal(data)
      // })

      // peer1.on('stream', stream => {
      //   console.log('peer1 stream', stream)
      //   const video = video1.value
      //   if (video) {
      //     if ('srcObject' in video) {
      //       video.srcObject = stream
      //     }

      //     video.play()
      //   }
      // })
      // peer2.on('stream', stream => {
      //   console.log('peer2 stream', stream)
      //   const video = video2.value
      //   if (video) {
      //     if ('srcObject' in video) {
      //       video.srcObject = stream
      //     }
      //     video.play()
      //   }
      // })
      peer1.on('connect', () => {
        console.log('peer1 connect')
        peer1.send('发送和信息')
        peer1.send('peer1 发送信息')
      })
      peer1.on('data', data => {
        console.log('data', data)
      })
    }
    onMounted(() => {
      const soc = io('http://localhost:3000')
      // 向指定的服务器建立连接，地址可以省略
      soc.emit('msg', '你好服务器')
      // 自定义msg事件，发送‘你好服务器’字符串向服务器
      soc.on('msg', (data: any) => {
        // 监听浏览器通过msg事件发送的信息
        console.log('接收到服务器数据', data)// 你好浏览器
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
      forList
    }
  }
})
</script>
<style scoped>
video {
  width: 300px;
  height: 150px;
}
</style>
