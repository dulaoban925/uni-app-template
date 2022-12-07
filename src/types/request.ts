/**
 * http 请求工具相关类型
 * @anchor SuperYing
 * @date 2022/11/23 20:19:28
 */
import InterceptorManager from '@/utils/request/InterceptorManager'

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
type UniRequestOptions = UniApp.RequestOptions

// 请求成功回调参数类型
export type UniRequestSuccessCallbackResult =
  UniApp.RequestSuccessCallbackResult

// 请求通用回调参数类型
export type UniGeneralCallbackResult = UniApp.GeneralCallbackResult
export interface CustomRequestOptions extends UniRequestOptions {
  baseURL?: string
  params?: Record<string, any>
}

// 拦截器
export interface RequestInterceptor {
  request: InterceptorManager
  response: InterceptorManager
}

export interface RequestInstance {
  defaults: CustomRequestOptions
  interceptors: RequestInterceptor
  create: (config: CustomRequestOptions) => RequestInstance
  request: (config: CustomRequestOptions) => Promise<any>
  (config: CustomRequestOptions): Promise<any>
}
