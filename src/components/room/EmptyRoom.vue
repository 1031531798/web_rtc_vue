<template>
  <div class="room-empty">
     <a-result status="warning" title="房间不存在">
    <template #subtitle>
      请前往Home进入房间
    </template>

    <template #extra>
      <a-space>
        <a-button type='primary' @click="goHome">
          <span>现在去寻找房间 <icon-home /></span>
        </a-button>
      </a-space>
    </template>
  </a-result>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'

function goHome () {
  router.push('/')
}
</script>

<style lang="scss" scoped>

</style>
