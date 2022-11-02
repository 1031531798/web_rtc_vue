<template>
  <div class="room" v-if="hasInRoom">
    <div class="room-video rounded-md">
      <video id="Rtc"></video>
      <video id="RtcB"></video>
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
import { computed, onMounted, onUnmounted } from 'vue-demi'
import RoomDetail from '@/components/room/RoomDetail.vue'
import EmptyRoom from '@/components/room/EmptyRoom.vue'
import { LocalRtc } from '@/components/media/local'
import { Socket } from 'socket.io-client'
import { strParse } from '@/util/util'
const rtcStore = useRtcStore()
const socket = rtcStore.rtcSocket as Socket
const hasInRoom = computed(() => {
  return rtcStore.currentRoom.id
})
function setRoomEvent () {
  if (socket instanceof Socket) {
    socket.on('roomChange', (roomStr: string) => {
      const room = strParse(roomStr)
      console.log(room, 'room change')
      rtcStore.currentRoom = room
    })
    new LocalRtc().initMedia()
  }
}
onUnmounted(() => {
  socket.emit && socket.emit('exit', rtcStore.currentRoom.id)
  rtcStore.currentRoom = { id: undefined }
})
onMounted(() => {
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
    background: #f2f3f5;
    flex: 1;
    height: 100%;
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
