import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, FlatList, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/app/theme/useTheme';

interface DropdownProps {
  label?: string;
  placeholder?: string;
  items: string[];
  value: string;
  onValueChange: (value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  required?: boolean;
}

export function Dropdown({
  label,
  placeholder = 'Select an option',
  items,
  value,
  onValueChange,
  containerStyle,
  required = false,
}: DropdownProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const theme = useTheme();

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
      {label && (
        <ThemedText 
          style={{ 
            marginBottom: theme.spacing.xs,
            fontSize: theme.fontSizes.md,
            fontWeight: theme.fontWeights.medium
          }}
        >
          {label} {required && <ThemedText style={{ color: theme.colors.notification }}>*</ThemedText>}
        </ThemedText>
      )}
      
      <TouchableOpacity
        onPress={toggleModal}
        style={[
          styles.dropdownButton,
          { 
            backgroundColor: theme.colors.inputBackground,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.md,
          }
        ]}
      >
        <ThemedText style={{ 
          color: value ? theme.colors.textPrimary : theme.colors.textSecondary,
          flex: 1
        }}>
          {value || placeholder}
        </ThemedText>
        <View style={styles.iconContainer}>
          {value ? (
            <TouchableOpacity onPress={clearSelection} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
          <Ionicons name="chevron-down" size={18} color={theme.colors.textSecondary} />
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
            <View style={styles.modalHeader}>
              <ThemedText style={{ 
                fontSize: theme.fontSizes.lg, 
                fontWeight: theme.fontWeights.semiBold 
              }}>
                {label || 'Select Option'}
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
                    value === item && { 
                      backgroundColor: theme.colors.primary + '15'
                    }
                  ]} 
                  onPress={() => handleSelect(item)}
                >
                  <ThemedText style={{ 
                    fontSize: theme.fontSizes.md,
                    color: value === item ? theme.colors.primary : theme.colors.textPrimary,
                    fontWeight: value === item ? theme.fontWeights.medium : theme.fontWeights.regular
                  }}>
                    {item}
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
    marginRight: 8,
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