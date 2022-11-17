<template>
  <div class="room-message-box">
    {{data.msg}}
  </div>
</template>

<script setup lang="ts">
import { useRtcStore } from '@/store'
import { MessageData } from './types'
import { defineProps } from 'vue'
const props = defineProps<{
  data: MessageData
}>()
const store = useRtcStore()
const user = store.user

</script>

<style lang="scss" scoped>
.room-message-box {

}

</style>
