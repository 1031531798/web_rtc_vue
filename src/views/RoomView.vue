<template>
  <div class="room">
    <div class="room-video">

    </div>
    <div class="room-main">

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRtcStore } from '@/store'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue-demi'

const rtcStore = useRtcStore()
const { currentRoom } = storeToRefs(rtcStore)
onMounted(() => {
  console.log(currentRoom, '当前的房间')
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
    border-radius: 10px;
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
