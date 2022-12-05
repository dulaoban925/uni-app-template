/**
 * 拦截器管理
 */
import { forEach as forEachUtil } from '@/utils'

export interface Handler {
  fulfilled: (args: any) => void
  rejected: (args: any) => void
}

export default class InterceptorManager {
  handlers: (Handler | null)[] = []

  // 添加拦截器
  use(fulfilled: (args: any) => void, rejected: (args: any) => void): number {
    this.handlers.push({
      fulfilled,
      rejected
    })
    return this.handlers.length - 1
  }

  // 删除拦截器
  eject(id: number) {
    if (this.handlers[id]) {
      this.handlers[id] = null
    }
  }

  // 遍历拦截器处理函数
  forEach(fn: (h: Handler) => void) {
    forEachUtil(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h)
      }
    })
  }
}
