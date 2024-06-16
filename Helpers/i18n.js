import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from '../Translations/en.json';
import de from '../Translations/de.json';

const resources = {
  en,
  de,
};

/**
 * Initializes the i18n instance with translations and configuration.
 */
i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: RNLocalize.getLocales()[0].languageTag, // Set the initial language based on device locale
  fallbackLng: 'en', // Fallback language if the current language is not available

  interpolation: {
    escapeValue: false, // React already does escaping
  },
});

export default {i18n};
