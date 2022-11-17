<template>
  <div class="room-message rounded-md">
    <div class="room-message-body ">
      <h3>聊天消息</h3>
      <div class="room-message-body-list">
        <MessageBox v-for="item in messageList" :key="item.userId" :data="item" />
      </div>
      <div class="room-message-body-input">
        <a-textarea v-model:model-value="msgText" placeholder="有什么想说的吗..." @keydown.enter="enterEvent" :max-length="30" allow-clear show-word-limit />
        <a-button status="success" type="primary" @click="sendMessage" @keydown.enter="sendMessage">发送</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRtcStore } from '@/store'
import { onMounted, ref } from 'vue'
import { Socket } from 'socket.io-client'
import { strParse } from '@/util/util'
import { MessageData } from '@/components/room/types'
import MessageBox from './MessageBox.vue'
const msgText = ref<string>('')
const socket = useRtcStore().rtcSocket as Socket
const roomData = useRtcStore().currentRoom
const messageList = ref<MessageData[]>(roomData.messageList || [])
function enterEvent (event: KeyboardEvent) {
  event.preventDefault()// 阻止浏览器默认换行操作
  sendMessage()
}
onMounted(() => {
  socket.on('message', (str: string) => {
    const data = strParse(str)
    messageList.value.push(data)
    console.log('messageSend', data)
  })
})
function sendMessage () {
  socket && socket.emit('message', msgText.value)
  msgText.value = ''
}
</script>

<style lang="scss" scoped>
  .room-message {
    width: 100%;
    height: 20%;
    min-height: 300px;
    background-color: $bg-white;
    display: flex;
    flex: 1;
    margin-top: 20px;
    h3 {
      width: 100%;
      text-align: center;
    }
    &-body {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &-list {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
      }
      &-input {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 10px;
        text-align: right;
        button {
          height: 100%;
          width: 50px;
        }
      }
    }
  }
</style>
