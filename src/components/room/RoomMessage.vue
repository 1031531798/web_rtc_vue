<template>
  <div class="room-message rounded-md">
    <div class="room-message ">
      <h3>聊天消息</h3>
      <div v-for="item in messageList" :key="item.userId">

      </div>
    </div>
  </div>
</template>

<script setup>
import { useRtcStore } from '@/store'
import { computed } from 'vue-demi'
const messageList = computed(() => {
  return []
})

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
  }
</style>
