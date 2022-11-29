export * from './request'
export * from './local-storage'

// 获取当前页面栈信息
export function getCurrentPage() {
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}
