import { defineStore } from 'pinia'
export const useRtcStore = defineStore('rtcStore', {
  state: () => {
    return {
      // 当前room对象
      currentRoom: {
        id: undefined,
        roomPerson: [],
        messageList: []
      },
      rtcSocket: {},
      user: {
        userId: '',
        name: ''
      },
      videoList: {} as any
    }
  },
  actions: {
    clearRoom () {
      this.currentRoom = {
        id: undefined,
        roomPerson: [],
        messageList: []
      }
      console.log(this)
    }
  }
})
