<template>
  <view>this is demo page</view>
</template>
<script setup lang="ts">
import { useRouter } from '@/hooks'
const router = useRouter()

console.log(router.getQuery())
</script>
