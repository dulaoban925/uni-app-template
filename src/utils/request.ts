/**
 * http 请求
 * 1.统一使用 request，统一 http 请求用法
 * 2.内置 默认请求配置，如 baseUrl，method，withCredentials 等，避免大量重复传递参数
 * 3.内置 请求拦截器，用于权限校验，token 传递，参数集中处理等
 * 4.内置 响应拦截器，用于响应结果分析，处理数据性接口问题
 * 5.内置 请求 loading，提供开关控制启停
 * 6.随应用场景持续丰富......
 * @anchor SuperYing
 * @date 2022/11/23 20:15:47
 */
import { RequestConfig, RequestResponse } from '@/types/request'

const request = async (config: RequestConfig) => {
  try {
    await handleRequestInterceptor(config)
    const response = await handleRequest(config)
    const finalResponse = await handleResponseInterceptor(response)
    return finalResponse
  } catch (e) {
    console.error(e)
  }
}

/**
 * 请求前拦截器
 * 1.校验接口权限
 * 2.请求权限获取及赋值（token）
 * 3.处理请求配置默认值
 */
const handleRequestInterceptor = (config: RequestConfig) => {
  return new Promise((resolve, reject) => {})
}

/**
 * 响应前拦截器
 * 1.处理接口响应数据状态
 */
const handleResponseInterceptor = (response: RequestResponse) => {
  return new Promise((resolve, reject) => {
    console.log(123)
  })
}

// 处理请求的函数
const handleRequest = (config: RequestConfig): Promise<RequestResponse> => {
  return new Promise((resolve, reject) => {
    const { url, data } = config
    uni.request({
      url,
      data,
      success: (response: RequestResponse) => {
        resolve(response)
      },
      fail(response) {
        reject(response)
      }
    })
  })
}

export { request }
