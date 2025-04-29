import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl, ActivityIndicator, Linking, Alert, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
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
import { TouchableOpacity } from 'react-native';
import { useLanguage } from '@/app/i18n/LanguageContext';

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
  const { isRTL } = useLanguage();

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
        i18n.t('availableWorkers.contactWorker'),
        i18n.t('workerProfile.contactInformation') + ' ' + i18n.t('validation.phoneRequired')
      );
      return;
    }

    const phoneUrl = `tel:${phone}`;
    
    // Mark worker as called - we do this regardless of whether call succeeds
    const updatedCalledWorkers = {
      ...calledWorkers,
      [worker.id]: true
    };
    setCalledWorkers(updatedCalledWorkers);
    saveCalledWorkers(updatedCalledWorkers);

    // Handle phone call differently based on platform
    if (Platform.OS === 'android') {
      // On Android, we need different handling
      Linking.openURL(phoneUrl)
        .catch(error => {
          console.error('Error making call on Android:', error);
          Alert.alert(
            i18n.t('error'),
            i18n.t('settings.contactSupportDescription') || 'Unable to make the call'
          );
        });
    } else {
      // iOS handling
      Linking.canOpenURL(phoneUrl)
        .then(supported => {
          if (supported) {
            return Linking.openURL(phoneUrl);
          } else {
            Alert.alert(
              i18n.t('cancel'),
              i18n.t('settings.contactSupportDescription')
            );
          }
        })
        .catch(error => {
          console.error('Error making call:', error);
          Alert.alert(
            i18n.t('cancel'),
            i18n.t('settings.contactSupportDescription')
          );
        });
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <ThemedText style={{ marginTop: 16, color: theme.colors.textSecondary }}>
          {i18n.t('loading')}
        </ThemedText>
      </ThemedView>
    );
  }

  // Render individual worker card item
  const renderWorkerCard = ({ item: worker }: { item: Worker }) => {
    const isCalled = calledWorkers[worker.id];
    return (
      <Card
        key={worker.id}
        style={[
          styles.workerCard,
          isCalled && styles.calledWorkerCard,
          { opacity: isCalled ? 0.8 : 1 },
          isRTL && styles.workerCardRTL
        ]}
        variant="elevated"
      >
        <View style={[
          styles.cardHeader,
          isRTL && styles.cardHeaderRTL
        ]}>
          <View style={[
            styles.avatarContainer,
            {
              backgroundColor: theme.colors.primary + '15',
              opacity: isCalled ? 0.7 : 1
            },
            isRTL && styles.avatarContainerRTL
          ]}>
            <ThemedText style={styles.avatarText}>
              {worker.name.charAt(0)}
            </ThemedText>
          </View>
          
          <View style={styles.headerContent}>
            <ThemedText 
              numberOfLines={1} 
              style={[styles.workerName, {
                color: theme.colors.textPrimary,
                fontSize: theme.fontSizes.md,
                fontWeight: theme.fontWeights.semiBold,
                textAlign: isRTL ? 'right' : 'left',
              }]}
            >
              {worker.name}
            </ThemedText>
            
            <View style={[
              styles.tagsContainer,
              isRTL && styles.tagsContainerRTL
            ]}>
              <View style={[styles.tag, { backgroundColor: theme.colors.primary + '15' }]}>
                <Ionicons name="construct-outline" size={12} color={theme.colors.primary} style={isRTL ? {marginRight: 0, marginLeft: 2} : undefined} />
                <ThemedText style={[styles.tagText, { color: theme.colors.primary }]}>
                  {worker.skill}
                </ThemedText>
              </View>
              <View style={[styles.tag, { backgroundColor: theme.colors.secondary + '15' }]}>
                <Ionicons name="location-outline" size={12} color={theme.colors.secondary} style={isRTL ? {marginRight: 0, marginLeft: 2} : undefined} />
                <ThemedText style={[styles.tagText, { color: theme.colors.secondary }]}>
                  {worker.location}
                </ThemedText>
              </View>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.callButton, {
              backgroundColor: isCalled ? theme.colors.background : theme.colors.primary,
              borderColor: theme.colors.primary,
            }]}
            onPress={() => handleCallWorker(worker)}
          >
            <Ionicons 
              name="call-outline" 
              size={18} 
              color={isCalled ? theme.colors.tertiary : 'white'} 
            />
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={{ flex: 1 }}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
        enabled={false}
      >
        <View style={styles.container}>
          {/* Search and Filters Header */}
          <View style={[
            styles.filterHeaderContainer,
            isRTL && styles.filterHeaderContainerRTL
          ]}>
            {/* Search */}
            <InputField
              placeholder={i18n.t('availableWorkers.search')}
              iconName="search"
              textAlign={isRTL ? 'right' : 'left'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              containerStyle={styles.searchInput}
            />

            {/* Filter Dropdown */}
            <Dropdown 
              placeholder={i18n.t('availableWorkers.filterBySkill')}
              items={skills}
              value={selectedSkill ? i18n.t("skills." + selectedSkill) : undefined}
              onValueChange={setSelectedSkill}
              containerStyle={styles.filterDropdown}
              compact={false}
              label="skill"
              />
          </View>

          {/* Results Count */}
          <View style={[
            styles.resultsHeader,
            isRTL && styles.resultsHeaderRTL
          ]}>
            <ThemedText style={[styles.resultsTitle, {
              textAlign: isRTL ? 'right' : 'left'
            }]}>
              {i18n.t('availableWorkers.availableWorkers')}
            </ThemedText>
            <View style={[styles.counterBadge, { backgroundColor: theme.colors.primary + '20' }]}>
              <ThemedText style={[styles.counterText, { color: theme.colors.primary }]}>
                {filteredWorkers.length}
              </ThemedText>
            </View>
          </View>

          {/* Worker List */}
          {filteredWorkers.length === 0 ? (
            <ScrollView 
              contentContainerStyle={styles.emptyState}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={[styles.emptyStateIconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
                <Ionicons name="people-outline" size={40} color={theme.colors.primary} />
              </View>
              <ThemedText style={styles.emptyStateTitle}>
                {i18n.t('availableWorkers.noWorkersFound')}
              </ThemedText>
              <ThemedText style={styles.emptyStateText}>
                {i18n.t('availableWorkers.noWorkersSkill', { skill: selectedSkill || '' })}
              </ThemedText>
              <Button
                title={i18n.t('refresh')}
                variant="outline"
                icon="refresh"
                onPress={handleRefresh}
                fullWidth={false}
              />
            </ScrollView>
          ) : (
            <FlatList
              data={filteredWorkers}
              renderItem={renderWorkerCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.workersList}
              keyboardShouldPersistTaps="handled"
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[theme.colors.primary]}
                  tintColor={theme.colors.primary}
                />
              }
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  filterHeaderContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  filterHeaderContainerRTL: {
    textAlign: 'right',
  },
  searchInput: {
    minHeight: 38,
    marginRight: 8,
  },
  filterDropdown: {
    minHeight: 38
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  counterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  workersList: {
    paddingBottom: 20,
  },
  workerCard: {
    padding: 12,
    marginBottom: 10,
  },
  calledWorkerCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  workerCardRTL: {
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderRightColor: '#4CAF50',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarContainerRTL: {
    marginRight: 0,
    marginLeft: 10,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  workerName: {
    marginBottom: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagsContainerRTL: {
    flexDirection: 'row-reverse',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 2,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  calledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4CAF5015',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  calledBadgeRTL: {
    right: 'auto',
    left: 12,
    flexDirection: 'row-reverse',
  },
  calledText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4CAF50',
    marginLeft: 2,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 0
  },
  emptyStateIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
});