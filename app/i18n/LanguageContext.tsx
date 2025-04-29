import React, { createContext, useState, useContext, useEffect } from 'react';
import { I18nManager, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, { setLanguage } from './i18n';
import { LANGUAGE_STORAGE_KEY } from '@/constants/localStorage';

// Define the shape of our context
type LanguageContextType = {
  locale: string;
  setLocale: (language: string) => void;
  isRTL: boolean;
};

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  locale: 'fr',
  setLocale: () => {},
  isRTL: false,
});


// Language Provider component
export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [locale, setLocale] = useState<string>(i18n.locale || 'fr');
  const [isRTL, setIsRTL] = useState<boolean>(I18nManager.isRTL);

  // Load saved language preference
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage) {
          changeLanguage(savedLanguage);
          if (savedLanguage === 'ar') {
            I18nManager.forceRTL(true);
          }
          else {
            I18nManager.forceRTL(false);
          }
        } else {
          // Assume default language is English
          let deviceLanguage = 'fr';
          changeLanguage(deviceLanguage);
        }
      } catch (error) {
        console.error("Failed to load language preference:", error);
        // Ensure we have a fallback
        changeLanguage('fr');
      }
    };
    
    loadLanguage();
  }, []);

  // Change language function
  const changeLanguage = (language: string) => {
    // Check if the language requires RTL
    const isNewLangRTL = language === 'ar';
    
    // If RTL setting would change
    if (isNewLangRTL !== isRTL) {
      setIsRTL(isNewLangRTL);
      I18nManager.forceRTL(isNewLangRTL);
    }
    
    // Set the locale in i18n
    setLanguage(language);
    
    // Update state
    setLocale(language);
    
    // Save preference
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language).catch(error => {
      console.warn('Could not save language preference:', error);
    });
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale: changeLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using language context
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;