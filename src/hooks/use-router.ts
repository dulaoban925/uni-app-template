/**
 * 路由 hook
 * @anchor SuperYing
 * @date 2022/11/24 20:10:00
 */
import { getCurrentPage } from '@/utils'
// 路由配置类型
type NavigateToOptions = UniApp.NavigateToOptions

interface CustomNavigateToOptions extends NavigateToOptions {
  query?: Record<string, any>
  params?: Record<string, any>
}

// 对象参数 params 与路由地址的映射
const RoutePathParamsMap = new Map()

// 处理 query 参数
const handleQueryOption = (options: CustomNavigateToOptions) => {
  if (!options.query) return
  // url 是否存在 query 参数
  const urlHasQuery = options.url.includes('?')
  // 将 query 参数转为 字符串
  const queryStr = Object.keys(options.query).reduce(
    (pre: string, cur: string, index: number, array: string[]) => {
      const isLast = index === array.length - 1
      const queryParamStr = `${cur}=${options.query?.[cur]}${isLast ? '' : '&'}`
      pre += queryParamStr
      return pre
    },
    urlHasQuery ? '&' : '?'
  )
  options.url += queryStr
}

// 处理 params 参数
// TODO: 确定时机清空路由参数对象，如 back，退出应用等
const handleParamsOption = (options: CustomNavigateToOptions) => {
  const { url, params } = options
  if (params) {
    RoutePathParamsMap.set(url, params)
  } else if (RoutePathParamsMap.get(url)) {
    RoutePathParamsMap.delete(url)
  }
}

// 解析路由参数
function parseNavigatorOptions(
  options: CustomNavigateToOptions | string
): NavigateToOptions | undefined {
  // 若当前配置仅传递字符串，则默认为 url
  if (typeof options === 'string') {
    return {
      url: options
    }
  } else {
    if (!options.url) {
      console.warn(`[Router] url 配置为空`)
      return
    }
    // 处理 url 拼接参数
    handleQueryOption(options)
    // 处理 params 参数
    handleParamsOption(options)
  }
  return options
}

export function useRouter() {
  /**
   * 跳转到指定路由
   * options 允许仅传递 url 字符串，或完整的配置对象
   * {
   *  url: '',
   *  query: '', // 地址后拼接
   *  params: '', // 页面间传递
   * }
   */
  const push = (options: CustomNavigateToOptions | string) => {
    const parsedOptions = parseNavigatorOptions(options)
    parsedOptions && uni.navigateTo(parsedOptions)
  }

  // 关闭当前页面，跳转到应用内的某个页面
  const replace = (options: CustomNavigateToOptions | string) => {
    const parsedOptions = parseNavigatorOptions(options)
    parsedOptions && uni.redirectTo(parsedOptions)
  }

  // 返回指定页面
  const back = (options: UniApp.NavigateBackOptions) => {
    uni.navigateBack(options)
  }

  // 获取params
  const getParams = () => {
    const currentPage = getCurrentPage()
    const mapKey = `/${currentPage.route}`
    return RoutePathParamsMap.get(mapKey)
  }

  // 获取 query
  const getQuery = () => {
    const hrefSearch = location.href.split('?')[1]
    if (!hrefSearch) return
    const query: any = {}
    for (const [key, value] of new URLSearchParams(hrefSearch)) {
      query[key] = value
    }
    return query
  }

  return {
    push,
    replace,
    back,
    getParams,
    getQuery
  }
}
