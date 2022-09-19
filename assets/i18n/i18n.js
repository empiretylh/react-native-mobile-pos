import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import mm from './mm.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: en,
    mm: mm,
  },
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
