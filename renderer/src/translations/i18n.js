import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import the translation files
import { En } from './en';
import { Hi } from './hi';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: En,
      },
      hi: {
        translation: Hi,
      },
    },
});

i18n.changeLanguage('en');
export default i18n;
