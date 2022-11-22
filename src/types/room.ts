import { Socket } from 'socket.io-client/build/esm/socket'
import { User } from './user'

// 房间 类型
export interface RoomType {
  id: number
  createUser: string
  createDate: string | number
  roomPerson: User[]
}

export interface RtcSocketProps {
  socket: Socket
}

export type RoomVideoType = {
  name: string
  userId: string
}

export interface RtcSdpResponse {
  userId: string
  sdp: RTCSessionDescription
}
export interface RtcIceResponse {
  userId: string
  candidate: RTCIceCandidate
}
