/**
 * 全局操作 hook
 * 1.各种弹窗
 * 2.router
 * 3.全局环境变量
 * @anchor SuperYing
 * @date 2022/11/24 20:01:46
 */
export function useGlobalOperation() {
  // 获取全局变量
  const getGlobalEvnVar = (name: string) => {
    const envVar = import.meta.env[name]
    if (!envVar) {
      console.warn(`不存在环境变量${name}，请检查拼写是否正确`)
      return
    }
    return envVar
  }
  return {
    getGlobalEvnVar
  }
}
