<template>
  <div class="room" v-if="hasInRoom">
    <div class="room-video rounded-md">
      <div class="room-video-item">
        <video controls :id="rtcStore.user.userId"></video>
        <div>
          <span>{{rtcStore.user.userId}}</span>
          <IconFaceSmileFill style="color: #ffcd00" />
        </div>
      </div>
      <div class="room-video-item" v-for="(item, key) of getVideoList" :key="key">
        <video controls :id="key"></video>
        <div>{{getVideoUserName(key)}}</div>
      </div>
    </div>
    <div class="room-main">
      <RoomDetail />
      <RoomMessage />
    </div>
  </div>
  <div v-else>
    <EmptyRoom />
  </div>
</template>

<script setup lang="ts">
import { useRtcStore } from '@/store'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import RoomDetail from '@/components/room/RoomDetail.vue'
import RoomMessage from '@/components/room/RoomMessage.vue'
import EmptyRoom from '@/components/room/EmptyRoom.vue'
import { MultiplayerRealTime } from '@/components/media/multiplayer'
import { Socket } from 'socket.io-client'
import { strParse } from '@/util/util'
import { leaveRoom } from '@/components/room/roomEvent'
import { useJoinPeerId, getVideoUserName } from '@/hook/room'
const rtcStore = useRtcStore()
const socket = rtcStore.rtcSocket as Socket
const multipVideo = ref()
const hasInRoom = computed(() => {
  return rtcStore.currentRoom.id
})
const getVideoList = computed(() => {
  return multipVideo.value?.peerList as {key: string}
})

function setRoomEvent () {
  if (socket instanceof Socket) {
    socket.on('addUser', (id: string) => {
      if (id !== rtcStore.user.userId) {
        multipVideo.value && multipVideo.value.addUser({ userId: id })
        Message.info(`${id} 加入房间`)
      }
    })
    socket.on('roomChange', (roomStr: string) => {
      const room = strParse(roomStr)
      rtcStore.currentRoom = room
    })
    socket.on('exit', (userId: string) => {
      if (userId) {
        const box = document.getElementById(userId)
        box?.remove()
        Message.info(`${userId} 退出房间`)
        const peerId = useJoinPeerId(userId)
        multipVideo.value && multipVideo.value.closePeer(peerId)
      }
    })
    multipVideo.value = new MultiplayerRealTime()
    multipVideo.value.init()
  }
}
onUnmounted(() => {
  rtcStore.currentRoom.id && leaveRoom(rtcStore.currentRoom.id)
  // 关闭媒体通讯
  multipVideo.value && multipVideo.value.disconnect()
})
onMounted(() => {
  if (rtcStore.currentRoom.id) {
    setRoomEvent()
  }
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
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    justify-content: space-around;
    height: 100%;
    background-color: $bg-home;
    padding: 10px;
    video {
      transform: rotateY(180deg);
    }
    &-item {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      margin: 10px;
      div {
        white-space: nowrap;
      }
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
// 控制所有video控制条旋转
video::-webkit-media-controls-enclosure{ transform: rotateY(180deg) !important; }
// video 时间线隐藏
video::-webkit-media-controls-timeline{display: none !important; }
</style>

<style lang="scss" scoped>
@media screen and (max-width: 900px) {
  .room {
    flex-direction: column;
    &-video {
      width: 100%;
      height: auto;
      justify-content: flex-start;
      overflow-x: auto;
    }
    &-main {
      flex-direction: row;
      width: 100%;
      margin-left: 0;
      .room-detail {
        display: none;
      }
      .room-message {
        height: 100%;
        width: 100%;
      }
    }
    video {
      width: 120px;
      height: 50px;
    }
  }
}
</style>
