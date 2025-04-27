import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/app/theme/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface LanguageSelectorProps {
  style?: any;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ style }) => {
  const { locale, setLocale } = useLanguage();
  const theme = useTheme();
  const primaryColor = theme.colors.primary;

  const changeLanguage = (language: string) => {
    if (language === locale) return;

    // Show alert to confirm language change as it will reload the app
    Alert.alert(
      language === 'en' ? 'Change Language' : 'تغيير اللغة',
      language === 'en' 
        ? 'Are you sure you want to change the language to English?' 
        : 'هل أنت متأكد أنك تريد تغيير اللغة إلى العربية؟',
      [
        {
          text: language === 'en' ? 'Cancel' : 'إلغاء',
          style: 'cancel'
        },
        {
          text: language === 'en' ? 'Change' : 'تغيير',
          onPress: () => {
            setLocale(language);
            // The app will reload due to RTL changes if switching between LTR and RTL languages
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.languageButton, locale === 'en' && { backgroundColor: primaryColor }]}
        onPress={() => changeLanguage('en')}
      >
        <ThemedText style={[styles.languageText, locale === 'en' && styles.activeText]}>
          English
        </ThemedText>
        {locale === 'en' && (
          <Ionicons name="checkmark" size={16} color={theme.colors.textPrimary === theme.colors.background ? theme.colors.textPrimary : theme.colors.background} style={styles.checkIcon} />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.languageButton, locale === 'ar' && { backgroundColor: primaryColor }]}
        onPress={() => changeLanguage('ar')}
      >
        <ThemedText style={[styles.languageText, locale === 'ar' && styles.activeText]}>
          العربية
        </ThemedText>
        {locale === 'ar' && (
          <Ionicons name="checkmark" size={16} color={theme.colors.textPrimary === theme.colors.background ? theme.colors.textPrimary : theme.colors.background} style={styles.checkIcon} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeText: {
    color: '#FFFFFF', // This will be overridden by the theme system
  },
  checkIcon: {
    marginLeft: 4,
  }
});