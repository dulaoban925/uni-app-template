/**
 * Request 类
 * @anchor SuperYing
 * @date 2022/11/30 15:50:32
 */
import InterceptorManager from './InterceptorManager'
import {
  CustomRequestOptions,
  RequestConfigMethod,
  RequestInterceptor,
  RequestInstance
} from '@/types/request'
import { isString } from '@/utils'
import { bind, extend, mergeConfig } from './helpers'
import type { Handler } from './InterceptorManager'
import dispatchRequest from './dispatchRequest'

export class Request {
  defaults: CustomRequestOptions
  interceptors: RequestInterceptor
  constructor(instanceConfig: CustomRequestOptions) {
    // 默认配置
    this.defaults = instanceConfig
    // 拦截器
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }
  }

  /**
   * 请求方法
   * 允许请求方式：
   * request(url, config)
   * or
   * request({
   *  url: '',
   *  ...
   * })
   */
  request(config: CustomRequestOptions | string) {
    // 处理请求
    if (isString(config)) {
      // eslint-disable-next-line prefer-rest-params
      config = arguments[1] || {}
      // eslint-disable-next-line prefer-rest-params
      ;(config as unknown as CustomRequestOptions).url = arguments[0]
    } else {
      config = config || {}
    }
    // 合并 默认配置
    config = mergeConfig(this.defaults, config as CustomRequestOptions)
    // 转换请求方法为大写
    config.method = (
      config.method ||
      this.defaults.method ||
      'get'
    ).toUpperCase() as RequestConfigMethod

    // 请求拦截器链
    const requestInterceptorChain: VoidFunction[] = []
    this.interceptors.request.forEach((interceptor: Handler) => {
      requestInterceptorChain.unshift(
        interceptor.fulfilled,
        interceptor.rejected
      )
    })
    // 响应拦截器链
    const responseInterceptorChian: VoidFunction[] = []
    this.interceptors.response.forEach((interceptor: Handler) => {
      responseInterceptorChian.push(interceptor.fulfilled, interceptor.rejected)
    })
    // 执行链，初始值添加 undefined 是因为执行链都是成对出现的，不加 undefined，可能后续取执行函数时出错
    const chain: any[] = [dispatchRequest, undefined]
    chain.unshift(...requestInterceptorChain)
    chain.push([...responseInterceptorChian])

    let promise = Promise.resolve(config)
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift())
    }

    return promise
  }
}

// 创建实例
function createInstance(defaultConfig: CustomRequestOptions): RequestInstance {
  const context = new Request(defaultConfig)
  // 此处 instance 为一个函数，可直接执行的请求函数
  const instance = bind(Request.prototype.request, context)
  // 将 Response 的原型属性添加到 instance 上，如 request 方法
  extend(instance, Request.prototype, context)
  // 将 Request 实例对象属性添加到 instance 上，如 defaults 属性
  extend(instance, context)

  return instance as RequestInstance
}

const request: RequestInstance = createInstance({} as CustomRequestOptions)

request.create = function (instanceConfig: CustomRequestOptions) {
  return createInstance(
    mergeConfig(request.defaults as CustomRequestOptions, instanceConfig)
  )
}

export default request
