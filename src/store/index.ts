import { defineStore } from 'pinia'
export const useRtcStore = defineStore('rtcStore', {
  state: () => {
    return {
      // 当前room对象
      currentRoom: {
        id: undefined
      },
      rtcSocket: {},
      user: {
        userId: ''
      }
    }
  },
  actions: {
    clearRoom () {
      this.currentRoom = {
        id: undefined
      }
      console.log(this)
    }
  }
})
