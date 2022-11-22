import { User } from './../types/user'
import { Socket } from 'socket.io-client/build/esm/socket'
import { defineStore } from 'pinia'
export const useRtcStore = defineStore('rtcStore', {
  state: () => {
    return {
      // 当前room对象
      currentRoom: {
        id: undefined,
        roomPerson: [] as User[],
        messageList: []
      },
      rtcSocket: undefined as Socket | undefined,
      user: {
        userId: '',
        name: ''
      }
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
