import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'
import '@/styles/common.scss'
import { createPinia } from 'pinia'
const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(ArcoVue)
app.use(pinia)
app.use(ArcoVueIcon)

app.mount('#app')
