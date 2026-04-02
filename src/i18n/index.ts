import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { APP_CONSTANTS } from '@/config/constants'
import en from './locales/en.json'
import tr from './locales/tr.json'

const savedLanguage = localStorage.getItem(APP_CONSTANTS.LANGUAGE_KEY) ?? 'en'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    tr: { translation: tr },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

// Persist language selection
i18n.on('languageChanged', (lng) => {
  localStorage.setItem(APP_CONSTANTS.LANGUAGE_KEY, lng)
  document.documentElement.lang = lng
})

export default i18n
