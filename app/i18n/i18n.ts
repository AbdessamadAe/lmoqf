import { I18n } from 'i18n-js';
import { Platform } from 'react-native';
import { en } from './translations/en';
import { ar } from './translations/ar';

// Create i18n instance
const i18n = new I18n({
  en,
  ar
});

// Set default locale to English
i18n.defaultLocale = 'fr';
i18n.enableFallback = true;

// Set initial locale based on device settings
// Handle web environment separately since react-native-localize uses native APIs
if (Platform.OS === 'web') {
  // For web, use the browser's language
  try {
    const browserLang = navigator.language.split('-')[0];
    i18n.locale = browserLang in i18n.translations ? browserLang : 'fr';
  } catch (error) {
    console.warn('Could not detect browser language, defaulting to English:', error);
    i18n.locale = 'fr';
  }
} else {
  // For native platforms, try to use react-native-localize
  try {
    const reactNativeLocalize = require('react-native-localize');
    const locales = reactNativeLocalize.getLocales();
    if (Array.isArray(locales) && locales.length > 0) {
      i18n.locale = locales[0].languageCode;
    } else {
      i18n.locale = 'fr';
    }
  } catch (error) {
    console.warn('Could not detect device language, defaulting to English:', error);
    i18n.locale = 'fr';
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