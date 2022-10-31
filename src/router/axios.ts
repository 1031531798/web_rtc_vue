import axios from 'axios'
import { serialize } from '@/util/util'

const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
  withCredentials: true,
  validateStatus (status: number) {
    return status <= 500
  }
})
request.interceptors.request.use(
  (config: any) => {
    config.headers.Origin = process.env.VUE_APP_API_URL
    const isToken = (config.headers || {}).isToken === false
    const token = '22'
    if (token && !isToken) {
      config.headers.Authorization = `${token}`
    }

    // headers中配置serialize为true开启序列化
    if (config.methods === 'post' && config.headers.serialize) {
      config.data = serialize(config.data)
      delete config.data.serialize
    }

    // 处理get 请求的数组 springmvc 可以处理
    if (config.method === 'get') {
      config.paramsSerializer = function (params: any) {
        return serialize(params)
      }
    }

    return config
  },
  (error: string) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (res: any) => {
    return res
  },
  (error: string) => {
    return Promise.reject(new Error(error))
  }
)

export default request
