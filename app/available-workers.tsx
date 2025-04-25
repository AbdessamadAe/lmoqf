import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { fetchAvailableWorkers, Worker, fetchSkills } from './services/dataService';

export default function AvailableWorkersScreen() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  const primaryColor = useThemeColor({ light: '#2563eb', dark: '#3b82f6' }, 'tint');
  const secondaryBackground = useThemeColor({ light: '#f0f0f0', dark: '#2a2a2a' }, 'background');
  const cardBackground = useThemeColor({ light: '#ffffff', dark: '#1c1c1e' }, 'card');
  
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
          <View style={styles.topSpacing} />
          
          {/* Filter by skills */}
          <ThemedText style={styles.sectionTitle}>Filter by skill</ThemedText>
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
                  { backgroundColor: skill === selectedSkill ? primaryColor : secondaryBackground }
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
          
          {/* Worker Cards */}
          <ThemedText style={styles.sectionTitle}>
            {filteredWorkers.length} Workers Available
          </ThemedText>
          
          {filteredWorkers.length === 0 ? (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyStateText}>No workers available{selectedSkill ? ` with ${selectedSkill} skills` : ''}</ThemedText>
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
                      <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
                        <ThemedText style={styles.avatarText}>
                          {worker.name.charAt(0)}
                        </ThemedText>
                      </View>
                    </View>
                    <View style={styles.workerInfo}>
                      <ThemedText style={styles.workerName}>{worker.name}</ThemedText>
                      <View style={styles.ratingContainer}>
                        <Image 
                          source={require('@/assets/images/icon.png')} 
                          style={styles.starIcon}
                          resizeMode="contain" 
                        />
                        <ThemedText style={styles.ratingText}>
                          {worker.rating} ({worker.ratingCount})
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.workerDetails}>
                    <View style={styles.detailItem}>
                      <ThemedText style={styles.detailLabel}>Skill</ThemedText>
                      <ThemedText style={styles.detailValue}>{worker.skill}</ThemedText>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <ThemedText style={styles.detailLabel}>Location</ThemedText>
                      <ThemedText style={styles.detailValue}>{worker.location}</ThemedText>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <ThemedText style={styles.detailLabel}>Rate</ThemedText>
                      <ThemedText style={styles.detailValue}>${worker.hourlyRate}/hr</ThemedText>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={[styles.hireButton, { backgroundColor: primaryColor }]}
                    onPress={() => {/* Will implement hiring flow later */}}
                  >
                    <ThemedText style={styles.hireButtonText}>Hire Now</ThemedText>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
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
  topSpacing: {
    height: 10,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  skillsContainer: {
    paddingBottom: 8,
    gap: 8,
  },
  skillButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  skillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  workersContainer: {
    gap: 16,
  },
  workerCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    color: '#ffffff',
    fontSize: 24,
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
  starIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
  },
  workerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  detailItem: {
    minWidth: '30%',
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  hireButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  hireButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
});