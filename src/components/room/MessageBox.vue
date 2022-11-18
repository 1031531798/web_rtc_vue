<template>
  <div class="room-message-box" :class="{'my-message': hasMyMsg}">
    <div class="room-message-box-text">
      <span>{{data.msg}}</span>
    </div>
    <a-avatar
      class="room-message-box-avatar"
      shape="square"
      :size="30"
      :style="{
        verticalAlign: 'middle',
        backgroundColor: '#14a9f8',
      }"
    >
    {{ data.userId.slice(0, 4) }}
  </a-avatar>
  </div>
</template>

<script setup lang="ts">
import { useRtcStore } from '@/store'
import { MessageData } from './types'
import { defineProps, computed } from 'vue'
const props = defineProps<{
  data: MessageData
}>()
const store = useRtcStore()
const user = store.user
const hasMyMsg = computed(() => {
  return user.userId === props.data.userId
})

</script>

<style lang="scss" scoped>
.room-message-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 0 0 40px;
  position: relative;
  line-height: 40px;
  color: #61666D;
  &-text {
    padding: 0 10px;
  }
  &-avatar {
    position: absolute;
    padding: 0 10px;
    right: calc(100% - 40px);
  }
}
.my-message {
  justify-content: flex-end;
  padding: 0 40px 0 0;
  .room-message-box-avatar {
    right: 10px;
  }
}

</style>
