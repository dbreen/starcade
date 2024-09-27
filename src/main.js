import { createApp } from 'vue'
import { Quasar } from 'quasar'
import { createPinia } from 'pinia'
import quasarLang from 'quasar/lang/en-US'
import quasarIconSet from 'quasar/icon-set/material-icons'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(Quasar, {
  plugins: {},
  lang: quasarLang,
  iconSet: quasarIconSet,
})

app.use(router)
app.use(pinia)

app.mount('#app')
