import { createSSRApp } from 'vue'
import App from './App.vue'
import * as Pinia from 'pinia'

export function createApp() {
  const app = createSSRApp(App)
  const store = Pinia.createPinia()
  app.use(store)

  return {
    app,
    Pinia
  }
}
