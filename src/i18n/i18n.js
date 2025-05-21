import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en.json';
import ua from '../locales/ua.json';

const resources = {
  en: { translation: en },
  uk: { translation: ua }, 
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',        
    fallbackLng: 'en', 
    debug: false,
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
