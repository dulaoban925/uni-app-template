import { isArray, isPlainObject } from '@vue/shared'
export * from '@vue/shared'
export { default as request } from './request'
export * from './local-storage'

// 获取当前页面栈信息
export function getCurrentPage() {
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

// 是否为未定义
export function isUndefined(val: any) {
  return typeof val === 'undefined'
}

// 判断对象是否为 URLSearchParams 类型
export function isURLSearchParams(val: any) {
  return (
    typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams
  )
}

/**
 * 遍历数组 or 对象，并对每一个元素执行自定义方法
 * @param {Object|Array} obj 遍历的对象
 * @param {Function} fn 为对象每个元素执行的函数
 */
export function forEach(
  obj: Record<string, any> | any[],
  fn: (
    item: any,
    index: number | string,
    obj: Record<string, any> | any[]
  ) => void
) {
  if (obj === null || typeof obj === 'undefined') {
    return
  }
  // 若传入的参数为基础类型，转化为数组
  if (typeof obj !== 'object') {
    obj = [obj]
  }
  if (isArray(obj)) {
    // 遍历数组
    for (let i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj)
    }
  } else {
    // 遍历对象属性
    for (const key in obj) {
      // 仅处理对象自身属性，不处理原型链属性
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj)
      }
    }
  }
}

/**
 * 合并多个对象
 */
export function merge(...args: any[]) {
  const result: any = {}
  function assignValue(val: any, key: any) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val)
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val)
    } else if (isArray(val)) {
      result[key] = val.slice()
    } else {
      result[key] = val
    }
  }

  for (let i = 0, l = arguments.length; i < l; i++) {
    forEach(args[i], assignValue)
  }
  return result
}
