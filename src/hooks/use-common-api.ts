/**
 * 通用请求 hook
 * @anchor SuperYing
 * @date 2022/11/24 12:00:03
 */
import {
  queryList,
  queryByPage,
  queryById,
  add,
  update,
  del
} from '@/apis/common'
export function useCommonApi() {
  return {
    queryList: () => queryList(),
    queryByPage: () => queryByPage(),
    queryById: () => queryById(),
    add: () => add(),
    update: () => update(),
    del: () => del()
  }
}
