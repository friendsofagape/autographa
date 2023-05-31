import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import the translation files
import { En } from './en';
import { Hi } from './hi';
import { Ru } from './ru';
import { Fa } from './fa';
import { Fr } from './fr';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: {
        translation: En,
      },
      hi: {
        translation: Hi,
      },
      ru: {
        translation: Ru,
      },
      fa: {
        translation: Fa,
      },
      fr: {
        translation: Fr,
      },
    },
});

// i18n.changeLanguage('en');
export default i18n;
