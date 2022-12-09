/**
 * 权限相关接口
 * @anchor SuperYing
 * @date 2022/12/06 09:41:33
 */
import { request } from '@/utils'
import { getCompleteTokenResult } from '@/utils'

// 刷新 token 请求
export function refreshTokenRequest() {
  return request('auth/refreshToken', {
    params: {
      refreshToken: getCompleteTokenResult()?.refreshToken?.value
    }
  })
}

// 获取用户信息
export function getUserInfo() {
  return request('system/user/me/info')
}
