import { createI18n } from "vue-i18n"
import en from "./locales/en.json"
import tl from "./locales/tl.json"

const i18n = createI18n({
  legacy: false,
  locale: "en", // default language
  fallbackLocale: "en",
  messages: {
    en,
    tl,
  },
})

export default i18n
