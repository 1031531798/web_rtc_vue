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
export default defineComponent({
  name: 'HomeView',
  components: {
  },
  setup () {
    const text = ref<string>('')
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
