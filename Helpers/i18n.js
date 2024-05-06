import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from '../Translations/en.json';
import de from '../Translations/de.json';

const resources = {
  en,
  de,
};


i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: RNLocalize.getLocales()[0].languageTag,
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    }
  });

export default { i18n };
