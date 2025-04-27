import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl, ActivityIndicator, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/app/theme/useTheme';
import { fetchAvailableWorkers, Worker, fetchSkills } from '../services/hirerService';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { InputField } from '../components/InputField';
import { EmptyStateIllustration } from '@/components/illustrations/EmptyStateIllustration';
import i18n from '@/app/i18n/i18n';
import { StatusBar } from 'expo-status-bar';
import { useUserRole } from '@/app/context/UserRoleContext';

// Update the Worker interface if needed
// If this is already defined elsewhere, this change should be made there instead
interface ExtendedWorker extends Worker {
  phone?: string;
}

export default function WorkersScreen() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const theme = useTheme();
  const navigation = useNavigation();
  const { isHirer, userRole } = useUserRole();

  // If user is not a hirer, redirect to home page
  if (!isHirer) {
    return <Redirect href="/(tabs)" />;
  }

  // Set the header title
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: i18n.t('workers'),
      headerStyle: {
        backgroundColor: theme.colors.background,
      },
      headerTitleStyle: {
        color: theme.colors.textPrimary,
        fontSize: theme.fontSizes.xl,
        fontWeight: theme.fontWeights.bold,
      },
      headerShadowVisible: false,
    });
  }, [navigation, theme]);

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
    setSelectedSkill(selectedSkill === skill ? '' : skill);
  };

  // Filter workers based on selected skill and search query
  const filteredWorkers = workers.filter(worker => {
    const matchesSkill = selectedSkill ? worker.skill === selectedSkill : true;
    const matchesSearch = searchQuery 
      ? worker.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        worker.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.location.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    return matchesSkill && matchesSearch;
  });

  const handleCallWorker = (worker: ExtendedWorker) => {
    const phone = worker.phone || '';
    
    if (!phone) {
      Alert.alert(
        "Phone Number Unavailable", 
        `${worker.name}'s phone number is not available.`
      );
      return;
    }
    
    const phoneUrl = `tel:${phone}`;
    
    Linking.canOpenURL(phoneUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          Alert.alert(
            "Call Not Supported", 
            "Your device doesn't support making phone calls from the app."
          );
        }
      })
      .catch(error => {
        console.error('Error making call:', error);
        Alert.alert(
          "Call Error", 
          "There was an error trying to make the call. Please try again."
        );
      });
  };
  
  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <ThemedText style={{ marginTop: 16, color: theme.colors.textSecondary }}>
          Loading workers...
        </ThemedText>
      </ThemedView>
    );
  }
  
  return (
    <SafeAreaView edges={['left', 'right']} style={{ flex: 1 }}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <InputField
            placeholder="Search workers by name, skill, or location"
            iconName="search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            containerStyle={styles.searchInput}
          />
        </View>
        
        {/* Filter pills by skill */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsContainer}
        >
          {skills.map(skill => (
            <Button
              key={skill}
              title={skill}
              variant={selectedSkill === skill ? 'primary' : 'outline'}
              size="sm"
              onPress={() => handleSkillFilter(skill)}
              fullWidth={false}
              style={styles.pillButton}
            />
          ))}
        </ScrollView>
        
        {/* Results Heading */}
        <View style={styles.resultsHeader}>
          <ThemedText style={[styles.resultsTitle, { 
            color: theme.colors.textPrimary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontWeights.semiBold
          }]}>
            {selectedSkill ? 
              `${selectedSkill} Workers` : 
              `Available Workers`
            }
          </ThemedText>
          <View style={[styles.counterBadge, { backgroundColor: theme.colors.primary + '20' }]}>
            <ThemedText style={[styles.counterText, { color: theme.colors.primary }]}>
              {filteredWorkers.length}
            </ThemedText>
          </View>
        </View>
          
        {/* Worker Cards */}
        {filteredWorkers.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <EmptyStateIllustration />
            <ThemedText style={[styles.emptyStateTitle, { 
              color: theme.colors.textPrimary,
              fontSize: theme.fontSizes.xl,
              fontWeight: theme.fontWeights.semiBold
            }]}>
              No workers found
            </ThemedText>
            <ThemedText style={[styles.emptyStateText, { 
              color: theme.colors.textSecondary,
              fontSize: theme.fontSizes.md,
              textAlign: 'center',
              marginBottom: 24
            }]}>
              {selectedSkill 
                ? `No workers with ${selectedSkill} skills are currently available` 
                : 'No workers match your search criteria'}
            </ThemedText>
            <Button
              title="Refresh"
              variant="primary"
              icon="refresh"
              onPress={handleRefresh}
              fullWidth={false}
            />
          </ThemedView>
        ) : (
          <View style={styles.workersContainer}>
            {filteredWorkers.map((worker) => (
              <Card key={worker.id} style={styles.workerCard} variant="elevated">
                <View style={styles.cardHeader}>
                  <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primary + '15' }]}>
                    <ThemedText style={[styles.avatarText, { color: theme.colors.primary }]}>
                      {worker.name.charAt(0)}
                    </ThemedText>
                  </View>
                  <View style={styles.headerContent}>
                    <ThemedText style={[styles.workerName, { 
                      color: theme.colors.textPrimary,
                      fontSize: theme.fontSizes.lg,
                      fontWeight: theme.fontWeights.semiBold
                    }]}>
                      {worker.name}
                    </ThemedText>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#FFC107" />
                      <ThemedText style={[styles.ratingText, { 
                        color: theme.colors.textSecondary,
                        fontSize: theme.fontSizes.sm
                      }]}>
                        {worker.rating} ({worker.ratingCount} reviews)
                      </ThemedText>
                    </View>
                  </View>
                </View>
                
                <View style={[styles.tagsContainer, { gap: theme.spacing.sm }]}>
                  <View style={[styles.tag, { backgroundColor: theme.colors.primary + '15' }]}>
                    <Ionicons name="construct-outline" size={14} color={theme.colors.primary} />
                    <ThemedText style={[styles.tagText, { color: theme.colors.primary }]}>
                      {worker.skill}
                    </ThemedText>
                  </View>
                  <View style={[styles.tag, { backgroundColor: theme.colors.secondary + '15' }]}>
                    <Ionicons name="location-outline" size={14} color={theme.colors.secondary} />
                    <ThemedText style={[styles.tagText, { color: theme.colors.secondary }]}>
                      {worker.location}
                    </ThemedText>
                  </View>
                  <View style={[styles.tag, { backgroundColor: theme.colors.tertiary + '15' }]}>
                    <Ionicons name="cash-outline" size={14} color={theme.colors.tertiary} />
                    <ThemedText style={[styles.tagText, { color: theme.colors.tertiary }]}>
                      ${worker.hourlyRate}/hr
                    </ThemedText>
                  </View>
                  <View style={[styles.tag, { backgroundColor: theme.colors.secondary + '15' }]}>
                    <Ionicons name="call-outline" size={14} color={theme.colors.secondary} />
                    <ThemedText style={[styles.tagText, { color: theme.colors.secondary }]}>
                      {worker.phone ? worker.phone : 'No phone number'}
                    </ThemedText>
                  </View>
                </View>
                
                <Button
                  title="Call Worker"
                  variant="primary"
                  icon="call-outline"
                  onPress={() => handleCallWorker(worker)}
                  style={{ marginTop: theme.spacing.md }}
                />
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    marginTop: 0,
    padding: 16,
    paddingBottom: 40,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 8,
  },
  pillsContainer: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  pillButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  resultsTitle: {
    flex: 1,
  },
  counterBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  workersContainer: {
    gap: 16,
  },
  workerCard: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  workerName: {
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 30,
  },
  emptyStateTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    maxWidth: '80%',
    marginBottom: 24,
  },
});