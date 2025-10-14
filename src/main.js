import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "./router"
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"
import "./style.css"
import App from "./App.vue"
import i18n from "./i18n"

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(Toast, {
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
})

app.mount("#app")
