/**
 * Request 帮助函数
 * @anchor SuperYing
 * @date 2022/12/01 10:12:23
 */
import { CustomRequestOptions } from '@/types/request'
import {
  isPlainObject,
  merge,
  isArray,
  forEach,
  isUndefined,
  isDate,
  isObject,
  isURLSearchParams
} from '@/utils'

// 判断传入的 url 是否为绝对路径
export function isAbsoluteURL(url: string): boolean {
  // 若以 "<scheme>://" 或 "//" 开头，即为绝对路径
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

// 编码
function encode(val: string) {
  return encodeURIComponent(val)
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

// 序列化 params，整合进 url
export function buildURL(url: string, params: any) {
  console.log(params)
  if (!params) return url
  let serializedParams = ''
  if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parts: string[] = []

    forEach(params, (val, key) => {
      console.log(key)
      if (val === null || typeof val === 'undefined') return
      if (isArray(val)) {
        key = `${key}[]`
      } else {
        val = [val]
      }

      forEach(val, v => {
        if (isDate(v)) {
          v = v.toISOString()
        } else if (isObject(v)) {
          v = JSON.stringify(v)
        }
        parts.push(`${encode(key as string)}=${encode(v)}`)
      })
    })
    serializedParams = parts.join('&')
  }
  if (serializedParams) {
    const hashMarkIndex = url.indexOf('#')
    if (hashMarkIndex !== -1) {
      url = url.slice(0, hashMarkIndex)
    }
    const paramsConnector = url.indexOf('?') === -1 ? '?' : '&'
    url += `${paramsConnector}${serializedParams}`
  }
  return url
}

// 合并 baseURL 和 relativeURL
export function combineURLs(baseURL: string, relativeURL: string): string {
  return relativeURL
    ? `${baseURL.replace(/\/+$/, '')}/${relativeURL.replace(/^\/+/, '')}`
    : baseURL
}

// 组装完整的请求地址
export function buildFullPath(baseURL: string, requestedURL: string): string {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL)
  }
  return requestedURL
}

// 合并 request config
export function mergeConfig(
  config1: CustomRequestOptions,
  config2: CustomRequestOptions
) {
  // 最终配置
  const config = {} as CustomRequestOptions
  // 直接使用 config2 的配置项
  const valueFromConfig2Keys = ['url', 'method', 'data']
  // 深度合并的配置项
  const mergeDeepPropKeys = ['header']
  // 允许默认，但是会使用 config2 覆盖的配置项
  const defaultToConfig2Keys = [
    'baseURL',
    'timeout',
    'dataType',
    'responseType',
    'sslVerify',
    'withCredentials',
    'firstIpv4',
    'success',
    'fail',
    'complete'
  ]

  // 获取已合并的值
  const getMergedValue = (target: any, source: any) => {
    if (isPlainObject(target) && isPlainObject(source)) {
      return merge(target, source)
    } else if (isPlainObject(source)) {
      return merge({}, source)
    } else if (isArray(source)) {
      return source.slice()
    }
    return source
  }

  // 处理直接使用 config2 覆盖的属性
  forEach(valueFromConfig2Keys, (prop: keyof CustomRequestOptions) => {
    if (!isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop])
    }
  })

  // 处理深度复制的属性
  forEach(mergeDeepPropKeys, (prop: keyof CustomRequestOptions) => {
    if (!isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop])
    } else if (!isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop])
    }
  })

  // 处理允许 config1 默认，但是会使用 config2 覆盖的属性
  forEach(defaultToConfig2Keys, (prop: keyof CustomRequestOptions) => {
    if (!isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop])
    } else if (!isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop])
    }
  })

  return config
}

// 将指定函数逻辑绑定指定上下文，并返回一个函数
export function bind(
  fn: (...args: any) => void,
  context: any
): (...args: any) => void {
  return function () {
    const args = new Array(arguments.length)
    for (let i = 0; i < args.length; i++) {
      // eslint-disable-next-line prefer-rest-params
      args[i] = arguments[i]
    }
    return fn.apply(context, args)
  }
}

// 将 source 的所有属性及属性值添加到 target 上，若source 的属性值函数，则执行上下文为 context
export function extend(target: any, source: any, context?: any) {
  forEach(source, (val, key) => {
    console.log(context ? 'prototype' : 'context', val, key)
    if (context && typeof val === 'function') {
      target[key] = bind(val, context)
    } else {
      target[key] = val
    }
  })
  return target
}
