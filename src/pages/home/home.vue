<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title" @click="goToDemo">{{ title }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useRouter } from '@/hooks'

const title = ref(import.meta.env.VITE_APP_TITLE)

const router = useRouter()

const goToDemo = () => {
  router.push({
    url: '/pages/demo/demo',
    query: {
      a: 1
    }
  })
}
</script>

<style lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: $uni-color-primary;
}
</style>
