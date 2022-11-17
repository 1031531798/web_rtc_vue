<template>
  <div class="room-message rounded-md">
    <div class="room-message-body ">
      <h3>聊天消息</h3>
      <div class="room-message-body-list">
        <div v-for="item in messageList" :key="item.userId">

        </div>
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
import { computed } from 'vue-demi'
import { ref } from 'vue'
import { Socket } from 'socket.io-client'
const msgText = ref<string>('')
const messageList = computed(() => {
  return []
})
function enterEvent (event: KeyboardEvent) {
  event.preventDefault()// 阻止浏览器默认换行操作
  sendMessage()
}
function sendMessage () {
  const socket = useRtcStore().rtcSocket as Socket
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
