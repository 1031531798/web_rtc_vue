<template>
  <div class="home">
    <header>
      <div>webRtc demo</div>
      <div>sokcetId: {{user.name}}</div>
    </header>
    <div class="control-box">
      <a-button type="primary" status="success" style="margin-right:20px" @click="createRoom">
        <template #icon>
          <icon-plus />
        </template>
        <span>创建房间</span>
      </a-button>
      <a-input-search v-model="text" :style="{width:'320px'}" placeholder="请输入房间号" search-button @search="joinRoom">
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
import { defineComponent, onMounted, ref } from 'vue'
import { io } from 'socket.io-client'
import { User } from '@/types/user'
import { Message } from '@arco-design/web-vue'
import RoomList from '@/components/RoomList.vue'
import { useRtcStore } from '@/store'
import { strParse } from '@/util/util'
import router from '@/router'

export default defineComponent({
  name: 'HomeView',
  components: {
    RoomList
  },
  setup () {
    const text = ref<string>('')
    const socket = io('http://localhost:3000')

    const user = ref<User>({
      name: '-'
    })
    const roomData = ref([])
    const rtcStore = useRtcStore()
    // 保存 socket 实例
    rtcStore.$patch({ rtcSocket: socket })

    // 创建房间
    function createRoom () {
      socket.emit('createRoom')
    }
    // 加入房间
    function joinRoom () {
      if (text.value) {
        socket.emit('join', text.value)
      } else {
        Message.warning('房间号不能为空')
      }
    }

    function getRoomList () {
      socket.emit('roomList')
    }

    onMounted(() => {
      getRoomList()
      // 向指定的服务器建立连接，地址可以省略
      socket.on('login', (data: any) => {
        user.value.name = data
      })
      // 自定义msg事件，发送‘你好服务器’字符串向服务器
      socket.on('msg', (data: any) => {
        // 监听浏览器通过msg事件发送的信息
        console.log('接收到服务器数据', data)// 你好浏览器
      })
      // 获取房间列表
      socket.on('roomList', (data: any) => {
        roomData.value = strParse(data)
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
        const response = strParse(room)
        console.log(response)
        if (response.success) {
          // 设置当前room对象
          rtcStore.$patch({ currentRoom: response.data })
          Message.success('加入房间成功')
          router.push('/room')
        } else {
          Message.warning('加入房间失败')
        }
      })
    })
    return {
      text,
      user,
      createRoom,
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
