import { Message } from '@arco-design/web-vue'
import { Socket } from 'socket.io-client'
import { useRtcStore } from './../../store/index'

// 加入房间
export function joinRoom (id: string) {
  const { rtcSocket } = useRtcStore()
  if (id && rtcSocket instanceof Socket) {
    rtcSocket.emit('join', id)
  } else {
    Message.warning('房间号不能为空')
  }
}

// 离开房间
export function leaveRoom (id: string) {
  const { rtcSocket } = useRtcStore()
  if (id && rtcSocket instanceof Socket) {
    rtcSocket.emit('exit', id)
  } else {
    Message.warning('房间号不能为空')
  }
}
