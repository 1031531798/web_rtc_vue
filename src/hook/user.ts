import { useRtcStore } from '@/store/index'
export function useUserName () {
  return useRtcStore().user.userId
}
