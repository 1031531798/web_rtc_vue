<template>
  <span class="theme-mode">
    <a-switch v-model:model-value="systemStore.themeMode" @change="changeSwitch" :checked-value="ThemeModeEnum.dark" :unchecked-value="ThemeModeEnum.light">
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
import { onMounted } from 'vue'
import { useSystemStore } from '@/store/system'
import { ThemeModeEnum } from '@/enums'
const systemStore = useSystemStore()

function changeSwitch (val: ThemeModeEnum) {
  if (val === ThemeModeEnum.light) {
    document.body.removeAttribute('arco-theme')
  } else {
    document.body.setAttribute('arco-theme', 'dark')
  }
}
function matchMode (e: {matches: boolean, media: string}) {
  const colorMode = e.matches ? ThemeModeEnum.dark : ThemeModeEnum.light
  changeSwitch(colorMode)
  systemStore.themeMode = colorMode
}
onMounted(() => {
  // 获取系统主题颜色
  const mql: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
  matchMode(mql)
})
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
