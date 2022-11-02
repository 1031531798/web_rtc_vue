<template>
  <div class="home">
    <header>
      <div>webRtc demo</div>
      <div>sokcetId: {{user}}</div>
    </header>
    <div class="control-box">
      <a-button type="primary" status="success" style="margin-right:20px" @click="createRoom">
        <template #icon>
          <icon-plus />
        </template>
        <span>创建房间</span>
      </a-button>
      <a-input-search v-model="text" :style="{width:'320px'}" placeholder="请输入房间号" search-button @search="handleJoin">
        <template #button-icon>
          <icon-import />
        </template>
        <template #button-default>
          加入房间
        </template>
      </a-input-search>
    </div>
    <RoomList style="width: 80%" :data="roomData" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { io, Socket } from 'socket.io-client'
import { User } from '@/types/user'
import { Message } from '@arco-design/web-vue'
import RoomList from '@/components/room/RoomList.vue'
import { useRtcStore } from '@/store'
import { strParse } from '@/util/util'
import router from '@/router'
import { joinRoom, leaveRoom } from '@/components/room/roomEvent'
export default defineComponent({
  name: 'HomeView',
  components: {
    RoomList
  },
  setup () {
    const text = ref<string>('')
    const user = computed(() => {
      return rtcStore.user.userId
    })
    const roomData = ref([])
    const rtcStore = useRtcStore()
    const rtcSocket = initSocket()
    // 初始化 socket
    function initSocket () {
      if (rtcStore.rtcSocket instanceof Socket) {
        return rtcStore.rtcSocket
      } else {
        const socket = io('http://192.168.19.129:3000')
        rtcStore.rtcSocket = socket
        return socket
      }
    }
    // 创建房间
    function createRoom () {
      rtcSocket.emit('createRoom')
    }
    // 加入房间
    function handleJoin () {
      joinRoom(text.value)
    }

    function getRoomList () {
      rtcSocket.emit('roomList')
    }

    // socket 响应监听
    function initOnEvent () {
      // 向指定的服务器建立连接，地址可以省略
      rtcSocket.on('login', (data: string) => {
        rtcStore.user.userId = data
      })
      // 自定义msg事件，发送‘你好服务器’字符串向服务器
      rtcSocket.on('msg', (data: string) => {
        // 监听浏览器通过msg事件发送的信息
        console.log('接收到服务器数据', data)// 你好浏览器
      })
      // 获取房间列表
      rtcSocket.on('roomList', (data: string) => {
        roomData.value = strParse(data)
      })
      // 房间已满
      rtcSocket.on('full', (room: string) => { // 如果从服务端收到 "full" 消息
        console.log('Room ' + room + ' is full')
      })
      // 房间空
      rtcSocket.on('empty', (room: string) => { // 如果从服务端收到 "empty" 消息
        console.log('Room ' + room + ' is empty')
      })
      // 断开连接
      rtcSocket.on('disconnect', () => {
        if (rtcStore.currentRoom.id) {
          leaveRoom(rtcStore.currentRoom.id)
        }
      })
      rtcSocket.on('join', (room: string) => { // 如果从服务端收到 “join" 消息
        const response = strParse(room)
        if (response.success) {
          // 设置当前room对象
          rtcStore.$patch({ currentRoom: response.data })
          Message.success('加入房间成功')
          router.push('/room')
        } else {
          Message.warning('加入房间失败')
        }
      })
    }
    onUnmounted(() => {
      rtcSocket.removeListener()
    })
    onMounted(() => {
      getRoomList()
      initOnEvent()
      rtcSocket.emit('login')
    })
    return {
      text,
      user,
      createRoom,
      handleJoin,
      joinRoom,
      roomData
    }
  }
})
</script>
<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.control-box {
  margin-top: 20px;
}
</style>
