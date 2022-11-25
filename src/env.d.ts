/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 环境变量类型，用于只能提示在 .env 中定义的环境变量
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string // 应用名称
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
