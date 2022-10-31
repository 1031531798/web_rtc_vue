import { User } from './user'

// 房间 类型
export interface RoomType {
  id: number
  createUser: string
  createDate: string | number
  roomPerson: User[]
}
