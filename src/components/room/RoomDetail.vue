<template>
  <div class="room-detail rounded-md">
    <div class="room-detail-info">

    </div>
    <div class="room-detail-perosn">
      <h3>房间人员</h3>
      <div v-for="item in getRoomPerson" :key="item.userId">
        {{item.userId}}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRtcStore } from '@/store'
import { computed } from 'vue-demi'
const rtcStore = useRtcStore()
const getRoomPerson = computed(() => {
  return rtcStore.currentRoom.roomPerson || []
})
</script>

<style lang="scss" scoped>
  .room-detail {
    width: 100%;
    height: 20%;
    min-height: 300px;
    background: #fff;
  }
</style>
