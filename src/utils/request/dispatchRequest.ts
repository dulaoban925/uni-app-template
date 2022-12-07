/**
 * Request 请求逻辑
 * @anchor SuperYing
 * @date 2022/11/30 15:52:29
 */
import {
  CustomRequestOptions,
  UniRequestSuccessCallbackResult,
  UniGeneralCallbackResult
} from '@/types/request'
import { buildFullPath, buildURL } from './helpers'

export default function dispatchRequest(
  config: CustomRequestOptions
): Promise<UniRequestSuccessCallbackResult | UniGeneralCallbackResult> {
  return new Promise((resolve, reject) => {
    // 保证 header 配置项存在
    config.header = config.header || {}
    // 合并 url
    config.url = buildURL(
      buildFullPath(config.baseURL ?? '', config.url),
      config.params
    )
    // 设置 success 回调
    config.success = (result: UniRequestSuccessCallbackResult) => {
      // 自定义 success 配置
      config.success?.call(null, result)
      resolve(result)
    }
    // 设置 fail 回调
    config.fail = (error: UniGeneralCallbackResult) => {
      // 自定义 fail 配置
      config.fail?.call(null, error)
      reject(error)
    }
    // 发送请求
    uni.request(config)
  })
}
