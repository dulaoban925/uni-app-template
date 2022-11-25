import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  optimizeDeps: {
    // 此处 uni-ui 使用 npm 安装方式，默认情况下 babel-loader 会忽略 node_modules 下的文件，导致条件编译失效，通过此配置避免该问题。
    entries: ['@dcloudio/uni-ui']
  },
  resolve: {
    alias: {
      '@': resolve('./src')
    }
  }
})
