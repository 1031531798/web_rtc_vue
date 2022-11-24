import { ThemeModeEnum } from './../enums/index'

import { defineStore } from 'pinia'
export const useSystemStore = defineStore('systemStore', {
  state: () => {
    return {
      themeMode: ThemeModeEnum.light as ThemeModeEnum
    }
  },
  actions: {

  }
})
