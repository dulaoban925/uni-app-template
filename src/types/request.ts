/**
 * http 请求工具相关类型
 * @anchor SuperYing
 * @date 2022/11/23 20:19:28
 */

// 请求方法类型
export type RequestConfigMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'CONNECT'
  | 'HEAD'
  | 'OPTIONS'
  | 'TRACE'

// 请求配置
export interface RequestConfig {
  url: string
  data: Record<string, any> | string
  header?: Record<string, any>
  method?: RequestConfigMethod
  timeout?: number
  dataType?: string
  responseType?: string
  sslVerify?: string
  withCredentials?: string
  firstIpv4?: string
  success?: () => void
  fail?: () => void
  complete?: () => void
}

// 请求成功回调函数结果类型
export interface RequestResponse {
  data: Record<string, any> | string
  statusCode: number
  header: object
  cookies: string[]
}
