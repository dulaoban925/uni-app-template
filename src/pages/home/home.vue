<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title" @click="goToDemo">{{ title }}</text>
    </view>
    <uni-section title="基础用法" type="line" padding>
      <view class="example-body">
        <uni-badge class="uni-badge-left-margin" text="1" />
        <uni-badge class="uni-badge-left-margin" text="2" type="primary" />
        <uni-badge class="uni-badge-left-margin" text="34" type="success" />
        <uni-badge class="uni-badge-left-margin" text="45" type="warning" />
        <uni-badge class="uni-badge-left-margin" text="123" type="info" />
      </view>
    </uni-section>
    <navigator url="/pages/demo/demo">goToDemo</navigator>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from '@/hooks'
const title = ref(import.meta.env.VITE_APP_TITLE)

const router = useRouter()

const goToDemo = () => {
  router.replace({
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
