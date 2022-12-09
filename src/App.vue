<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { checkSso } from '@/utils'
import { useUserStore } from '@/stores/user'

onLaunch(() => {
  checkSso().then(() => {
    // 获取用户信息
    const userStore = useUserStore()
    userStore.getInfo()
  })
  console.log('App Launch')
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>
<style></style>
