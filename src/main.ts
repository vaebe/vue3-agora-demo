import { createApp } from 'vue'
import 'virtual:uno.css'
import '@/assets/css/index.scss'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
