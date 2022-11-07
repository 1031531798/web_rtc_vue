<template>
  <div class="room" v-if="hasInRoom">
    <div class="room-video rounded-md">
      <div class="room-video-item" :id="item.name" v-for="(item, key) of getVideoList" :key="key">
        <video :id="key"></video>
        <div>{{item.name}}</div>
      </div>
    </div>
    <div class="room-main">
      <RoomDetail />
    </div>
  </div>
  <div v-else>
    <EmptyRoom />
  </div>
</template>

<script setup lang="ts">
import { useRtcStore } from '@/store'
import { computed, onMounted, onUnmounted, ref } from 'vue-demi'
import RoomDetail from '@/components/room/RoomDetail.vue'
import EmptyRoom from '@/components/room/EmptyRoom.vue'
import { MultiplayerRealTime } from '@/components/media/multiplayer'
import { Socket } from 'socket.io-client'
import { strParse } from '@/util/util'
import { leaveRoom } from '@/components/room/roomEvent'
const rtcStore = useRtcStore()
const socket = rtcStore.rtcSocket as Socket
const multipVideo = ref()
const hasInRoom = computed(() => {
  return rtcStore.currentRoom.id
})
const getVideoList = computed(() => {
  return rtcStore.videoList
})

function setRoomEvent () {
  if (socket instanceof Socket) {
    socket.on('roomChange', (roomStr: string) => {
      const room = strParse(roomStr)
      rtcStore.currentRoom = room
    })
    socket.on('addUser', (id: string) => {
      if (id !== rtcStore.user.userId) {
        multipVideo.value && multipVideo.value.addUser({ userId: id })
      }
    })
    socket.on('exit', (userId: string) => {
      if (userId) {
        const box = document.getElementById(userId)
        box?.remove()
      }
    })
    multipVideo.value = new MultiplayerRealTime()
    multipVideo.value.init()
  }
}
onUnmounted(() => {
  rtcStore.currentRoom.id && leaveRoom(rtcStore.currentRoom.id)
})
onMounted(() => {
  if (rtcStore.user.userId) {
    rtcStore.videoList[rtcStore.user.userId] = rtcStore.user
  }
  setRoomEvent()
  console.log(rtcStore.currentRoom, '当前的房间')
})
</script>

<style lang="scss" scoped>
.room {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 0;
  flex: 1;
  margin: 10px;
  &-video {
    display: grid;
    grid-template-columns: repeat(4, calc(25% - 20px));
    grid-gap: 20px;
    justify-content: center;
    background: #f2f3f5;
    flex: 1;
    height: 100%;
    &-item {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }
  }
  &-main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 30%;
    height: 100%;
    margin-left: 30px;
  }
}
</style>
