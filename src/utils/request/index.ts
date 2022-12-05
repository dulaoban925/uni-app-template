/**
 * 系统使用的 request 工具
 * @anchor SuperYing
 * @date 2022/11/30 15:53:20
 */
import oriRequest from './Request'
import { CustomRequestOptions } from '@/types/request'

// request 默认 timeout 60000
const request = oriRequest.create({
  baseURL: ''
} as CustomRequestOptions)

request.interceptors.request.use(
  () => {
    // 请求拦截器成功回调
  },
  () => {
    // 请求拦截器失败回调
  }
)

request.interceptors.response.use(
  () => {
    // 响应拦截器成功回调
  },
  () => {
    // 响应拦截器失败回调
  }
)

export default request
