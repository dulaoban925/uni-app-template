import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getUserInfo } from '@/apis/auth'

export const useUserStore = defineStore('user', () => {
  const bip = ref('') // bip
  const name = ref('') // 姓名
  const jobNo = ref('') // 工号
  const tenancyId = ref('') // 租户id
  const allInfo = ref({}) // 所有用户信息

  // 获取用户信息
  function getInfo() {
    getUserInfo().then(({ data }) => {
      allInfo.value = data
      const { zusrid, znachn, zpernr, tenancyid } = data
      bip.value = zusrid
      name.value = znachn
      jobNo.value = zpernr
      tenancyId.value = tenancyid
    })
  }

  return {
    bip,
    name,
    jobNo,
    tenancyId,
    allInfo,
    getInfo
  }
})
