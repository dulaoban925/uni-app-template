/**
 * 统一认证请求
 * @anchor SuperYing
 * @date 2022/12/06 11:33:10
 */
import { request } from '@/utils'
// 首次登录
export function login() {
  return request('auth/sso/login', {
    params: {
      href: location.href
    }
  }).then((res: string) => {
    // 跳转重定向地址
    location.href = res
  })
}

// 二次登录，使用 code 获取 token
export function loginByCode(code: string) {
  return request('auth/local/login', {
    params: {
      code
    }
  })
}
