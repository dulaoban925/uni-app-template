/**
 * request token 相关操作
 * @anchor SuperYing
 * @date 2022/12/05 19:41:20
 */
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  parseQuery,
  getQuery
} from '@/utils'
import { AUTH } from '@/constants'
import { refreshTokenRequest } from '@/apis/auth'
import { login, loginByCode } from '@/apis/sso'

// 是否正在刷新 token 标识，避免重复刷新
let isRefreshingToken = false
// 刷新 token 的 promise 请求
let doRefreshTokenPromise: null | Promise<void> = null

// 从统一认证跳转会的url状态参数
const fromSsoState = 'from_sso'

// 统一认证校验
export function checkSso() {
  return new Promise((resolve, reject) => {
    // 网页 url 参数
    const query = parseQuery(getQuery())
    if (query.state === fromSsoState && query.code) {
      // 1.从统一认证返回的地址，执行 二次登录 获取 token
      loginByCode(query.code)
        .then(cacheToken)
        .then(res => {
          location.href = res.redirectUrl
          return resolve(res)
        })
    } else {
      // 2.否则判断是否为 401
      checkAuth().catch(e => {
        if (e.code === 401) {
          // 重新登录
          login()
          return reject(e)
        }
      })
      return resolve(true)
    }
  })
}

// 校验 token
export function checkAuth() {
  return new Promise((resolve, reject) => {
    // 1.校验当前 token 是否有效
    const tokenExpires = getTokenExpires()
    if (tokenExpires && parseInt(tokenExpires) > Date.now()) {
      return resolve(true)
    }
    // 2.若 token 无效，判断是否可以刷新
    // 移除原有 token
    removeAuthToken()
    const tokenRefreshExpires = getTokenRefreshExpires()
    if (tokenRefreshExpires && parseInt(tokenRefreshExpires) > Date.now()) {
      if (!isRefreshingToken) {
        doRefreshTokenPromise = refreshToken()
        isRefreshingToken = true
      }
      doRefreshTokenPromise?.then(() => {
        isRefreshingToken = false
        resolve(true)
      })
      return
    }
    // 3.无权限
    const error = {
      code: 401,
      msg: '未授权，请重新登录'
    }
    return reject(error)
  })
}

// 获取缓存 token
export function getAuthToken() {
  return getStorageItem(AUTH.TOKEN)
}

// 设置缓存 token
export function setAuthToken(token: string) {
  setStorageItem(AUTH.TOKEN, token)
}

// 移除缓存 token
export function removeAuthToken() {
  removeStorageItem(AUTH.TOKEN)
}

// 获取 token 过期时间
export function getTokenExpires() {
  return getStorageItem(AUTH.TOKEN_EXPIRES)
}

// 设置 token 过期时间
export function setTokenExpires(expires: number) {
  setStorageItem(AUTH.TOKEN_EXPIRES, expires)
}

// 获取 token 刷新过期时间
export function getTokenRefreshExpires() {
  return getStorageItem(AUTH.TOKEN_REFRESH_EXPIRES)
}

// 设置 token 刷新过期时间
export function setTokenRefreshExpires(expires: number) {
  setStorageItem(AUTH.TOKEN_REFRESH_EXPIRES, expires)
}

// 获取完整的 token 请求结果
export function getCompleteTokenResult() {
  return getStorageItem(AUTH.TOKEN_COMPLETE_RESULT)
}

// 设置完整的 token 请求结果
export function setCompleteTokenResult(result: any) {
  setStorageItem(AUTH.TOKEN_COMPLETE_RESULT, result)
}

// 刷新 token
export function refreshToken() {
  return refreshTokenRequest().then(cacheToken)
}

// 缓存 token 相关
function cacheToken(result: any) {
  if (result.isSuccess) {
    // 缓存请求完整结果
    setCompleteTokenResult(result)
    // 缓存token
    setAuthToken(result.value)
    // 缓存 token 过期时间
    setTokenExpires(result.expiration)
    // 缓存token 刷新过期时间
    setTokenRefreshExpires(result.refreshToken.expiration)
  }
  return result
}
