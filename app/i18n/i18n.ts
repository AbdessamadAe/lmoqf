import { I18n } from 'i18n-js';
import * as Localization from 'react-native-localize';
import { Platform } from 'react-native';
import { en } from './translations/en';
import { ar } from './translations/ar';
import { Navigator } from 'expo-router';

// Create i18n instance
const i18n = new I18n({
  en,
  ar
});

// Set default locale to English
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

// Set initial locale based on device settings
// Handle web environment separately since react-native-localize uses native APIs
if (Platform.OS === 'web') {
  // For web, use the browser's language
  const browserLang = 'en';
  i18n.locale = browserLang in i18n.translations ? browserLang : 'en';
} else {
  // For native platforms, use react-native-localize
  const locales = Localization.getLocales();
  if (Array.isArray(locales) && locales.length > 0) {
    i18n.locale = locales[0].languageCode;
  }
}

// Function to change the language
export const setLanguage = (language: string) => {
  i18n.locale = language;
};

// Function to get the current language
export const getCurrentLanguage = () => {
  return i18n.locale;
};

export default i18n;