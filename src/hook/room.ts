import { useRtcStore } from '@/store/index'
import { roomSetting } from '@/config/setting'
const rtcStore = useRtcStore()
// 拼接peerId
export function useJoinPeerId (id: string) {
  const user = rtcStore.user
  if (user.userId !== id) {
    const arr = [id, user.userId]
    return arr.sort().join(roomSetting.peerJoinFlag)
  }
  return user.userId
}

// 从拼接的peerId中获取 响应方name
export function getVideoUserName (key: string) {
  const names = key.split(roomSetting.peerJoinFlag)
  const userId = rtcStore.user.userId
  if (Array.isArray(names)) {
    return names.find(item => item !== userId) || ''
  }
  return userId
}
