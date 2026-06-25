import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import App from './App.vue'
import router from './router'

const app = createApp(App)

Sentry.init({
  app,
  dsn: 'http://1133eb47cee3486e982142d711e14b52@localhost:8000/1',
  integrations: [
    new BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
})

app.use(createPinia())
app.use(router)
app.mount('#app')