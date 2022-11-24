<template>
  <span class="theme-mode">
    <a-switch v-model:model-value="systemStore.themeMode" @change="changeSwitch" :checked-value="ThemeModeEnum.drak" :unchecked-value="ThemeModeEnum.light">
      <template #checked>
        <span style="position: relative;right: 2px;">🌜</span>
      </template>
      <template #unchecked>
        <span>🌞</span>
      </template>
    </a-switch>
  </span>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useSystemStore } from '@/store/system'
import { ThemeModeEnum } from '@/enums'
const systemStore = useSystemStore()
const mode = computed(() => {
  return systemStore.themeMode
})
function changeSwitch (val: ThemeModeEnum) {
  console.log('change mode', val)
  if (val === ThemeModeEnum.light) {
    document.body.removeAttribute('arco-theme')
  } else {
    document.body.setAttribute('arco-theme', 'dark')
  }
}
</script>
<style lang="scss" scoped>
.theme-mode {
  position: absolute;
  right: 20px;
  ::v-deep(.arco-switch) {
    background-color: #4d4d4d;
    .arco-switch-text {
      font-size: 1rem;
    }
    .arco-switch-handle:hover {
      box-shadow: 0 0 2px 3px #25c2a0;
    }
  }
}
</style>
