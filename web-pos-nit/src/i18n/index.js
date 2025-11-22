// src/i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import km from './locales/km.json';
import zh from './locales/zh.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      km: { translation: km },
      zh: { translation: zh }
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },

    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;

// ===============================
// src/i18n/locales/en.json


// ===============================
// src/i18n/locales/km.json

// ===============================
// src/i18n/locales/zh.json
