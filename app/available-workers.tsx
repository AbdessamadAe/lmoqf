import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { fetchAvailableWorkers, Worker, fetchSkills } from './services/dataService';
import { Ionicons } from '@expo/vector-icons';
import { EmptyStateIllustration } from '@/components/illustrations/EmptyStateIllustration';

export default function AvailableWorkersScreen() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  const primaryColor = useThemeColor({ light: '#2563eb', dark: '#3b82f6' }, 'tint');
  const secondaryBackground = useThemeColor({ light: '#f5f5f7', dark: '#2a2a2a' }, 'background');
  const cardBackground = useThemeColor({ light: '#ffffff', dark: '#1f2937' }, 'card');
  const mutedTextColor = useThemeColor({ light: '#6b7280', dark: '#9ca3af' }, 'text');
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [workersData, skillsData] = await Promise.all([
        fetchAvailableWorkers(),
        fetchSkills(),
      ]);
      
      setWorkers(workersData);
      setSkills(skillsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  const handleSkillFilter = (skill: string) => {
    // Toggle skill filter
    setSelectedSkill(selectedSkill === skill ? '' : skill);
  };
  
  // Filter workers based on selected skill
  const filteredWorkers = selectedSkill 
    ? workers.filter(worker => worker.skill === selectedSkill)
    : workers;
  
  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
        <ThemedText style={styles.loadingText}>Loading available workers...</ThemedText>
      </ThemedView>
    );
  }
  
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <Stack.Screen 
          options={{ 
            headerTitle: 'Available Workers',
            headerShown: true,
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: '600',
            },
          }} 
        />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              colors={[primaryColor]}
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle}>Find the right worker</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Browse through our collection of skilled professionals</ThemedText>
          </View>
          
          {/* Filter by skills */}
          <View style={styles.filterSection}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="options-outline" size={18} color={primaryColor} style={styles.sectionIcon} />
              <ThemedText style={styles.sectionTitle}>Filter by skill</ThemedText>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.skillsContainer}
            >
              {skills.map(skill => (
                <TouchableOpacity
                  key={skill}
                  style={[
                    styles.skillButton,
                    { 
                      backgroundColor: skill === selectedSkill ? primaryColor : secondaryBackground,
                      borderWidth: skill === selectedSkill ? 0 : 0.5,
                      borderColor: 'rgba(0,0,0,0.05)'
                    }
                  ]}
                  onPress={() => handleSkillFilter(skill)}
                >
                  <ThemedText 
                    style={[
                      styles.skillText,
                      { color: skill === selectedSkill ? '#fff' : undefined }
                    ]}
                  >
                    {skill}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {/* Worker Cards */}
          <View style={styles.workersSection}>
            <View style={styles.workersSectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="people-outline" size={18} color={primaryColor} style={styles.sectionIcon} />
                <ThemedText style={styles.sectionTitle}>Available Workers</ThemedText>
              </View>
              <View style={styles.counterBadge}>
                <ThemedText style={styles.counterText}>{filteredWorkers.length}</ThemedText>
              </View>
            </View>
          
            {filteredWorkers.length === 0 ? (
              <ThemedView style={styles.emptyState}>
                <EmptyStateIllustration />
                <ThemedText style={styles.emptyStateTitle}>No workers found</ThemedText>
                <ThemedText style={styles.emptyStateText}>
                  {selectedSkill 
                    ? `No workers with ${selectedSkill} skills are currently available` 
                    : 'No workers are currently available in your area'}
                </ThemedText>
                <TouchableOpacity
                  style={[styles.refreshButton, { backgroundColor: primaryColor }]}
                  onPress={handleRefresh}
                >
                  <Ionicons name="refresh-outline" size={16} color="#fff" style={styles.refreshIcon} />
                  <ThemedText style={styles.refreshText}>Refresh</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            ) : (
              <View style={styles.workersContainer}>
                {filteredWorkers.map((worker) => (
                  <View 
                    key={worker.id} 
                    style={[styles.workerCard, { backgroundColor: cardBackground }]}
                  >
                    <View style={styles.workerHeader}>
                      <View style={styles.avatarContainer}>
                        <View style={[styles.avatar, { 
                          backgroundColor: 'rgba(37, 99, 235, 0.1)' 
                        }]}>
                          <ThemedText style={[styles.avatarText, { color: primaryColor }]}>
                            {worker.name.charAt(0)}
                          </ThemedText>
                        </View>
                      </View>
                      <View style={styles.workerInfo}>
                        <ThemedText style={styles.workerName}>{worker.name}</ThemedText>
                        <View style={styles.ratingContainer}>
                          <Ionicons name="star" size={14} color="#FFC107" />
                          <ThemedText style={styles.ratingText}>
                            {worker.rating} ({worker.ratingCount})
                          </ThemedText>
                        </View>
                      </View>
                    </View>
                    
                    <View style={styles.detailsCard}>
                      <View style={styles.detailItem}>
                        <Ionicons name="construct-outline" size={16} color={primaryColor} style={styles.detailIcon} />
                        <View>
                          <ThemedText style={styles.detailLabel}>Skill</ThemedText>
                          <ThemedText style={styles.detailValue}>{worker.skill}</ThemedText>
                        </View>
                      </View>
                      
                      <View style={styles.detailItem}>
                        <Ionicons name="location-outline" size={16} color={primaryColor} style={styles.detailIcon} />
                        <View>
                          <ThemedText style={styles.detailLabel}>Location</ThemedText>
                          <ThemedText style={styles.detailValue}>{worker.location}</ThemedText>
                        </View>
                      </View>
                      
                      <View style={styles.detailItem}>
                        <Ionicons name="cash-outline" size={16} color={primaryColor} style={styles.detailIcon} />
                        <View>
                          <ThemedText style={styles.detailLabel}>Hourly Rate</ThemedText>
                          <ThemedText style={styles.detailValue}>${worker.hourlyRate}/hr</ThemedText>
                        </View>
                      </View>
                    </View>
                    
                    <TouchableOpacity
                      style={[styles.hireButton, { backgroundColor: primaryColor }]}
                      onPress={() => {/* Will implement hiring flow later */}}
                    >
                      <ThemedText style={styles.hireButtonText}>Contact Worker</ThemedText>
                      <Ionicons name="chatbox-outline" size={18} color="#fff" style={styles.hireButtonIcon} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    marginVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    lineHeight: 22,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  skillsContainer: {
    paddingBottom: 8,
    gap: 8,
  },
  skillButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
  },
  skillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  workersSection: {
    flex: 1,
  },
  workersSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  counterBadge: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  workersContainer: {
    gap: 20,
  },
  workerCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  workerHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  detailsCard: {
    gap: 12,
    padding: 14,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 10,
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  hireButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  hireButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  hireButtonIcon: {
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: '80%',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  refreshText: {
    color: '#fff',
    fontWeight: '600',
  },
  refreshIcon: {
    marginRight: 6,
  },
});