import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, FlatList, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/app/theme/useTheme';
import i18n from '../i18n/i18n';
import { useLanguage } from '../i18n/LanguageContext';

interface DropdownProps {
  label?: string;
  placeholder?: string;
  items: string[];
  value: string;
  onValueChange: (value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  clearButtonStyle?: StyleProp<ViewStyle>;
  textAlign?: 'left' | 'right' | 'center';
  required?: boolean;
  compact?: boolean;
}

export function Dropdown({
  label,
  placeholder = 'Select an option',
  items,
  value,
  onValueChange,
  containerStyle,
  dropdownStyle,
  itemTextStyle,
  iconStyle,
  clearButtonStyle,
  textAlign,
  required = false,
  compact = false,
}: DropdownProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const theme = useTheme();
  const { isRTL } = useLanguage();
  
  // Set default textAlign based on RTL if not provided
  const effectiveTextAlign = textAlign || (isRTL ? 'right' : 'left');

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleSelect = (item: string) => {
    onValueChange(item);
    toggleModal();
  };

  const clearSelection = () => {
    onValueChange('');
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        onPress={toggleModal}
        style={[
          styles.dropdownButton,
          { 
            backgroundColor: theme.colors.inputBackground,
            borderRadius: theme.borderRadius.md,
            padding: compact ? theme.spacing.sm : theme.spacing.md,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
          dropdownStyle
        ]}
      >
        <ThemedText style={{ 
          color: value ? theme.colors.textPrimary : theme.colors.textSecondary,
          flex: 1,
          textAlign: effectiveTextAlign,
          paddingLeft: isRTL ? 0 : 4,
          paddingRight: isRTL ? 4 : 0
        }}>
          { value || placeholder}
        </ThemedText>
        <View style={[
          styles.iconContainer,
          { flexDirection: isRTL ? 'row-reverse' : 'row' }
        ]}>
          {value ? (
            <TouchableOpacity 
              onPress={clearSelection} 
              style={[
                styles.clearButton, 
                isRTL ? { marginLeft: 8 } : { marginRight: 8 },
                clearButtonStyle
              ]}
            >
              <Ionicons name="close-circle" size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
          <Ionicons 
            name={isRTL ? "chevron-back" : "chevron-down"} 
            size={18} 
            color={theme.colors.textSecondary}
            style={iconStyle}
          />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={toggleModal}
        >
          <ThemedView 
            style={[
              styles.modalContent, 
              { 
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.lg,
                maxHeight: '60%',
              }
            ]}
          >
            <View style={[
              styles.modalHeader,
              { flexDirection: isRTL ? 'row-reverse' : 'row' }
            ]}>
              <ThemedText style={{ 
                fontSize: theme.fontSizes.lg, 
                fontWeight: theme.fontWeights.semiBold 
              }}>
                {i18n.t('Select_Option')}
              </ThemedText>
              <TouchableOpacity onPress={toggleModal}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={items}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.optionItem,
                    { flexDirection: isRTL ? 'row-reverse' : 'row' },
                    value === item && { 
                      backgroundColor: theme.colors.primary + '15'
                    }
                  ]} 
                  onPress={() => handleSelect(item)}
                >
                  <ThemedText style={[{ 
                    fontSize: theme.fontSizes.md,
                    color: value === item ? theme.colors.primary : theme.colors.textPrimary,
                    fontWeight: value === item ? theme.fontWeights.medium : theme.fontWeights.regular,
                    textAlign: effectiveTextAlign,
                    flex: 1,
                  }, itemTextStyle]}>
                    {i18n.t(`${label}s.${item}`)}
                  </ThemedText>
                  {value === item && (
                    <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </ThemedView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    // RTL adjustments are applied inline
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    padding: 16,
    maxWidth: 500,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    marginBottom: 8,
  },
  optionItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
  },
});