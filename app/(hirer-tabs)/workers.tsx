import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl, ActivityIndicator, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/app/theme/useTheme';
import { fetchAvailableWorkers, fetchSkills, getHirerLocation } from '../services/hirerService';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { InputField } from '../components/InputField';
import { Dropdown } from '../components/Dropdown';
import { EmptyStateIllustration } from '@/components/illustrations/EmptyStateIllustration';
import i18n from '@/app/i18n/i18n';
import { StatusBar } from 'expo-status-bar';
import { useUserRole } from '@/app/context/UserRoleContext';
import { Worker } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCalledWorkers } from '../services/workerService';

export default function WorkersScreen() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [calledWorkers, setCalledWorkers] = useState<Record<string, boolean>>({});
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
    // Load called workers from storage
    loadCalledWorkers();
  }, []);

  const loadCalledWorkers = async () => {
    try {
      const savedCalledWorkers = await getCalledWorkers();
      if (savedCalledWorkers) {
        setCalledWorkers(savedCalledWorkers);
      }
    } catch (error) {
      console.error('Error loading called workers:', error);
    }
  };

  const saveCalledWorkers = async (updatedCalledWorkers: Record<string, boolean>) => {
    try {
      await setCalledWorkers(updatedCalledWorkers);
    } catch (error) {
      console.error('Error saving called workers:', error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [workersData, skillsData, hirerLocation] = await Promise.all([
        fetchAvailableWorkers(),
        fetchSkills(),
        getHirerLocation(),
      ]);

      setWorkers(workersData);
      setSkills(skillsData);
      setSelectedLocation(hirerLocation || '');
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

  const clearFilters = () => {
    setSelectedSkill('');
    setSelectedLocation('');
    setSearchQuery('');
  };

  // const resetCalledWorkers = () => {
  //   Alert.alert(
  //     "Reset Called Workers",
  //     "Are you sure you want to clear all called workers history?",
  //     [
  //       { text: "Cancel", style: "cancel" },
  //       { 
  //         text: "Reset", 
  //         onPress: async () => {
  //           const updatedCalledWorkers = {};
  //           setCalledWorkers(updatedCalledWorkers);
  //           await saveCalledWorkers(updatedCalledWorkers);
  //         },
  //         style: "destructive"
  //       }
  //     ]
  //   );
  // };

  // Filter workers based on selected skill, location and search query
  const filteredWorkers = workers.filter(worker => {
    const matchesSkill = selectedSkill ? worker.skill === selectedSkill : true;
    const matchesLocation = selectedLocation ? worker.location === selectedLocation : true;
    const matchesSearch = searchQuery
      ? worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.location.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesSkill && matchesLocation && matchesSearch;
  });

  const handleCallWorker = (worker: Worker) => {
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
          // Mark worker as called
          const updatedCalledWorkers = {
            ...calledWorkers,
            [worker.id]: true
          };
          setCalledWorkers(updatedCalledWorkers);
          saveCalledWorkers(updatedCalledWorkers);

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
        {/* Search */}
        <View style={styles.searchContainer}>
          <InputField
            placeholder="Search workers by name, skill, or location"
            iconName="search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            containerStyle={styles.searchInput}
          />
        </View>

        {/* Filter Dropdowns */}
        <View style={styles.filterContainer}>
          <Dropdown 
            label="Skill"
            placeholder="Select skill"
            items={skills}
            value={selectedSkill}
            onValueChange={setSelectedSkill}
            containerStyle={styles.filterDropdown}
          />
        </View>

        {/* Active Filters Display */}
        {(selectedSkill) && (
          <View style={styles.activeFiltersContainer}>
            <ThemedText style={[styles.activeFiltersTitle, { color: theme.colors.textSecondary }]}>
              Active filters:
            </ThemedText>
            <View style={styles.activeFiltersList}>
              {selectedSkill && (
                <View style={[styles.activeFilterChip, { backgroundColor: theme.colors.primary + '15' }]}>
                  <Ionicons name="construct-outline" size={14} color={theme.colors.primary} />
                  <ThemedText style={[styles.activeFilterText, { color: theme.colors.primary }]}>
                    {selectedSkill}
                  </ThemedText>
                  <Ionicons
                    name="close-circle"
                    size={16}
                    color={theme.colors.primary}
                    onPress={() => setSelectedSkill('')}
                    style={styles.removeFilterIcon}
                  />
                </View>
              )}
            </View>
          </View>
        )}

        {/* Results Heading */}
        <View style={styles.resultsHeader}>
          <ThemedText style={[styles.resultsTitle, {
            color: theme.colors.textPrimary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontWeights.semiBold
          }]}>
            {selectedSkill && selectedLocation ?
              `${selectedSkill} Workers in ${selectedLocation}` :
              selectedSkill ?
                `${selectedSkill} Workers` :
                selectedLocation ?
                  `Workers in ${selectedLocation}` :
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
              {selectedSkill && selectedLocation ?
                `No ${selectedSkill} workers in ${selectedLocation} are currently available` :
                selectedSkill ?
                  `No workers with ${selectedSkill} skills are currently available` :
                  selectedLocation ?
                    `No workers in ${selectedLocation} are currently available` :
                    'No workers match your search criteria'}
            </ThemedText>
            <Button
              title="Clear Filters"
              variant="primary"
              icon="refresh"
              onPress={clearFilters}
              fullWidth={false}
              style={{ marginBottom: 16 }}
            />
            <Button
              title="Refresh"
              variant="outline"
              icon="refresh"
              onPress={handleRefresh}
              fullWidth={false}
            />
          </ThemedView>
        ) : (
          <View style={styles.workersContainer}>
            {filteredWorkers.map((worker) => {
              const isCalled = calledWorkers[worker.id];
              return (
                <Card
                  key={worker.id}
                  style={[
                    styles.workerCard,
                    isCalled && styles.calledWorkerCard,
                    { opacity: isCalled ? 0.8 : 1 }
                  ]}
                  variant="elevated"
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.avatarContainer, {
                      backgroundColor: theme.colors.primary + '15',
                      opacity: isCalled ? 0.7 : 1
                    }]}>
                      <ThemedText style={[styles.avatarText, { color: theme.colors.primary }]}>
                        {worker.name.charAt(0)}
                      </ThemedText>
                    </View>
                    <View style={styles.headerContent}>
                      <View style={styles.nameContainer}>
                        <ThemedText style={[styles.workerName, {
                          color: theme.colors.textPrimary,
                          fontSize: theme.fontSizes.lg,
                          fontWeight: theme.fontWeights.semiBold
                        }]}>
                          {worker.name}
                        </ThemedText>
                        {isCalled && (
                          <View style={styles.calledBadge}>
                            <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
                            <ThemedText style={styles.calledText}>
                              Called
                            </ThemedText>
                          </View>
                        )}
                      </View>
                    </View>
                    <Button
                      icon="call-outline"
                      variant={isCalled ? "outline" : "ghost"}
                      size="sm"
                      onPress={() => handleCallWorker(worker)}
                      fullWidth={false}
                      style={styles.callButton}
                    />
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
                  </View>

                  <Button
                    title={isCalled ? "Call Again" : "Contact Worker"}
                    variant={isCalled ? "outline" : "primary"}
                    icon="call-outline"
                    onPress={() => handleCallWorker(worker)}
                    style={{ marginTop: theme.spacing.md }}
                  />
                </Card>
              );
            })}
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
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  filterDropdown: {
    flex: 1,
  },
  filterControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  clearButton: {
    alignSelf: 'flex-end',
  },
  resetCallsButton: {
    marginLeft: 'auto',
  },
  activeFiltersContainer: {
    marginVertical: 12,
  },
  activeFiltersTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  activeFiltersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilterText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 4,
  },
  removeFilterIcon: {
    marginLeft: 4,
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
  calledWorkerCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50', // Success green color
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
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
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  workerName: {
    marginBottom: 4,
    marginRight: 8,
  },
  calledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF5015', // Light green background
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  calledText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4CAF50', // Success green color
    marginLeft: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
  },
  callButton: {
    marginLeft: 8,
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