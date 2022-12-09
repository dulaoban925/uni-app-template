/**
 * 系统使用的 request 工具
 * @anchor SuperYing
 * @date 2022/11/30 15:53:20
 */
import oriRequest from './Request'
import { CustomRequestOptions } from '@/types/request'
import { isString } from '..'
import { checkAuth, getAuthToken, removeAuthToken } from '@/utils'
import { login } from '@/apis/sso'
import { useUserStore } from '@/stores/user'

// 权限相关地址前缀
const authUrlPrefix = 'auth/'
// 是否为权限相关请求
let isAuthUrl = false

// 默认 params
function getDefaultParams() {
  const userStore = useUserStore()
  const params: any = {}
  const tenancyId = userStore.tenancyId
  if (tenancyId) {
    params.tenancyid = tenancyId
  }
  return params
}

// request 默认 timeout 60000
const service = oriRequest.create({
  baseURL: '/api'
} as CustomRequestOptions)

service.interceptors.request.use(
  (config: CustomRequestOptions) => {
    return new Promise((resolve, reject) => {
      // 请求拦截器成功回调
      // 判断当前接口地址是否为权限相关地址
      isAuthUrl = config.url.startsWith(authUrlPrefix)
      if (isAuthUrl) return resolve(true)
      // 若非权限相关接口，则校验权限
      checkAuth()
        .then(resolve)
        .catch(e => reject(e))
    })
      .then(() => {
        if (!config.header) config.header = {}
        config.header['X-Requested-With'] = 'XMLHttpRequest'
        const token = getAuthToken()
        if (token) {
          config.header.Authorization = `Bearer ${token}`
        }
        return config
      })
      .catch(e => {
        return Promise.reject(e)
      })
  },
  err => {
    // 请求拦截器失败回调
    Promise.reject(err)
  }
)

service.interceptors.response.use(
  res => {
    // 响应拦截器成功回调
    const responseCode = parseInt(res.data.code)
    // 请求成功判断
    const isSuccess =
      responseCode &&
      ((responseCode >= 200 && responseCode < 300) ||
        responseCode === 304 ||
        responseCode === 2000)
    if (!isSuccess && !isAuthUrl) {
      return Promise.reject(res)
    }
    return res
  },
  err => {
    // 响应拦a截器失败回调
    // 无权限
    if (err && err.code === 401) {
      // 移除现有 token
      removeAuthToken()
      // 重新登录
      login()
    }
    return Promise.reject(err)
  }
)

// 处理传入的config，兼容单独传 url 和 整体 config 参数的场景
const handleConfig = (
  config1: CustomRequestOptions | string,
  config2 = {}
): CustomRequestOptions => {
  const config = config2 as CustomRequestOptions
  if (isString(config1)) {
    config.url = config1.replace(/^\/+/, '')
  }
  // 处理 params
  if (!config.params) config.params = {}
  const defaultParams = getDefaultParams()
  config.params = Object.assign({}, defaultParams, config.params)
  return config
}
const request = async (config: CustomRequestOptions | string, config1 = {}) => {
  config = handleConfig(config, config1)
  const { data } = await service(config)
  return data
}

export default request
