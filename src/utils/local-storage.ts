/**
 * 本地缓存工具封装
 * @anchor SuperYing
 * @date 2022/11/24 20:10:51
 */
// 缓存信息结果类型
interface StorageInfoResult {
  keys: string[]
  currentSize: number
  limitSize: number
}

// 获取所有缓存信息
export function getStorageInfo(): StorageInfoResult {
  return uni.getStorageInfoSync()
}

// 设置缓存
export function setStorageItem(key: string, data: any) {
  uni.setStorageSync(key, data)
}

// 根据 key 获取缓存
export function getStorageItem(key: string) {
  return uni.getStorageSync(key)
}

// 移除指定缓存
export function removeStorageItem(key: string) {
  uni.removeStorageSync(key)
}

// 清空缓存
export function clearStorage() {
  uni.clearStorageSync()
}

// 判断是否存在 key 对应的缓存
export function hasStorageItem(key: string) {
  return !!getStorageItem(key)
}
