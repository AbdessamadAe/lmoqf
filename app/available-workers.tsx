import React, { useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, Linking, TextInput, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for available workers
const MOCK_WORKERS = [
  { id: '1', name: 'Ahmed Mohammed', skill: 'Construction', location: 'Rabat', phone: '+212655555555', rating: 4.8 },
  { id: '2', name: 'Fatima Zahra', skill: 'Cleaning', location: 'Casablanca', phone: '+212666666666', rating: 4.5 },
  { id: '3', name: 'Karim Alaoui', skill: 'Plumbing', location: 'Marrakech', phone: '+212677777777', rating: 4.9 },
  { id: '4', name: 'Nadia Ben', skill: 'Painting', location: 'Agadir', phone: '+212688888888', rating: 4.7 },
  { id: '5', name: 'Omar Raji', skill: 'Electrical', location: 'Tangier', phone: '+212699999999', rating: 4.6 },
  { id: '6', name: 'Leila Amrani', skill: 'Gardening', location: 'Fez', phone: '+212611111111', rating: 4.4 },
  { id: '7', name: 'Youssef Benani', skill: 'Moving', location: 'Rabat', phone: '+212622222222', rating: 4.2 },
  { id: '8', name: 'Samira Tazi', skill: 'General Labor', location: 'Casablanca', phone: '+212633333333', rating: 4.3 },
  { id: '9', name: 'Hassan El Fassi', skill: 'Carpentry', location: 'Marrakech', phone: '+212644444444', rating: 4.7 },
  { id: '10', name: 'Amal Wahbi', skill: 'Plumbing', location: 'Tangier', phone: '+212655555556', rating: 4.8 },
];

const LOCATIONS = ['All Cities', 'Rabat', 'Casablanca', 'Marrakech', 'Tangier', 'Fez', 'Agadir'];
const SKILLS = ['All Skills', 'Construction', 'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Gardening', 'Moving', 'Cleaning', 'General Labor'];

export default function AvailableWorkersScreen() {
  const [locationFilter, setLocationFilter] = useState('All Cities');
  const [skillFilter, setSkillFilter] = useState('All Skills');
  const [searchQuery, setSearchQuery] = useState('');
  
  const cardBackground = useThemeColor({ light: '#fff', dark: '#1c1c1e' }, 'background');
  const inputBackground = useThemeColor({ light: '#f0f0f0', dark: '#2a2a2a' }, 'background');
  const primaryColor = useThemeColor({ light: '#2563eb', dark: '#3b82f6' }, 'tint');
  const borderColor = useThemeColor({ light: '#e5e5e5', dark: '#333' }, 'border');
  
  // Filter workers based on selected filters
  const filteredWorkers = MOCK_WORKERS.filter(worker => {
    // Apply location filter
    if (locationFilter !== 'All Cities' && worker.location !== locationFilter) {
      return false;
    }
    
    // Apply skill filter
    if (skillFilter !== 'All Skills' && worker.skill !== skillFilter) {
      return false;
    }
    
    // Apply search query filter (if any)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return worker.name.toLowerCase().includes(query) || 
             worker.skill.toLowerCase().includes(query) ||
             worker.location.toLowerCase().includes(query);
    }
    
    return true;
  });
  
  const handleCallWorker = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };
  
  const renderWorkerCard = ({ item }) => (
    <View style={[styles.card, { backgroundColor: cardBackground, borderColor }]}>
      <View style={styles.cardHeader}>
        <ThemedText style={styles.workerName}>{item.name}</ThemedText>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <ThemedText style={styles.rating}>{item.rating}</ThemedText>
        </View>
      </View>
      
      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="briefcase-outline" size={16} color={primaryColor} />
          <ThemedText style={styles.detailText}>{item.skill}</ThemedText>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color={primaryColor} />
          <ThemedText style={styles.detailText}>{item.location}</ThemedText>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.callButton, { backgroundColor: primaryColor }]}
        onPress={() => handleCallWorker(item.phone)}
      >
        <Ionicons name="call-outline" size={16} color="#fff" />
        <ThemedText style={styles.callButtonText}>Call to Hire</ThemedText>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ 
          headerTitle: 'Available Workers',
          headerShown: true,
          headerTitleStyle: {
            fontSize: 20,
          },
        }} />
        
        <View style={styles.topSpacing} />
        
        <View style={styles.filtersContainer}>
          <View style={[styles.searchContainer, { backgroundColor: inputBackground }]}>
            <Ionicons name="search-outline" size={18} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search workers..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <ScrollableFilters 
            title="Location"
            options={LOCATIONS} 
            selectedOption={locationFilter}
            onSelectOption={setLocationFilter}
            primaryColor={primaryColor}
          />
          
          <ScrollableFilters 
            title="Skill"
            options={SKILLS} 
            selectedOption={skillFilter}
            onSelectOption={setSkillFilter}
            primaryColor={primaryColor}
          />
        </View>
        
        {filteredWorkers.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={60} color={primaryColor} />
            <ThemedText style={styles.noResultsText}>
              No workers found matching your filters
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={filteredWorkers}
            renderItem={renderWorkerCard}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.workersList}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

// Horizontal scrollable filter component
function ScrollableFilters({ title, options, selectedOption, onSelectOption, primaryColor }) {
  return (
    <View style={styles.filterSection}>
      <ThemedText style={styles.filterTitle}>{title}:</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterChip,
              { backgroundColor: option === selectedOption ? primaryColor : 'transparent' }
            ]}
            onPress={() => onSelectOption(option)}
          >
            <ThemedText 
              style={[
                styles.filterChipText,
                { color: option === selectedOption ? '#fff' : undefined }
              ]}
            >
              {option}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  topSpacing: {
    height: 15, // Add space between header and content
  },
  filtersContainer: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  filtersScroll: {
    paddingRight: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  workersList: {
    paddingBottom: 20,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workerName: {
    fontSize: 18,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontWeight: '500',
  },
  cardDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 15,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  callButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    marginTop: 16,
    fontSize: 18,
    textAlign: 'center',
  },
});