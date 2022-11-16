<template>
  <div class="room-message-box">

  </div>
</template>

<script setup lang="ts">
import { useRtcStore } from '@/store'
import {MessageData, MessageModeEnum} from './types'

const props = defineProps<{
  data: MessageData
}>()
    const store = useRtcStore()
    const user = store.user
    const mode = user.userId === props.data.userId ? MessageModeEnum.left ? MessageModeEnum.right.

</script>

<style lang="scss" scoped>
.room-message-box {

}

</style>
