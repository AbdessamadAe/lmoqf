import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/app/components/Card';
import { Button } from '@/app/components/Button';
import { useTheme } from '@/app/theme/useTheme';
import i18n from '@/app/i18n/i18n';
import { fetchAvailableWorkers } from '../services/hirerService';
import { getWorkerProfile, isWorkerAvailable } from '@/app/services/workerService';
import { HelloWave } from '@/components/HelloWave';
import { useUserRole } from '@/app/context/UserRoleContext';

export default function HomeScreen() {
  const [workersCount, setWorkersCount] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const navigation = useNavigation();
  const { userRole, isWorker, isHirer } = useUserRole();

  // Set the header title
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: i18n.t('appName'),
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

  // Load user data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get available workers count (relevant for both roles)
      const workers = await fetchAvailableWorkers();
      setWorkersCount(workers.length);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };


  const handleFindWorkers = () => {
    router.push('/workers');
  };


  return (
    <SafeAreaView edges={['left', 'right']} style={{ flex: 1 }}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Quick Actions - Role Specific */}
        <View style={styles.actionsSection}>
          <ThemedText style={[styles.sectionTitle, { 
            color: theme.colors.textPrimary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontWeights.semiBold,
            marginBottom: theme.spacing.md 
          }]}>
            Quick Actions
          </ThemedText>
          <View style={styles.actionsRow}>
                <Card style={[styles.actionCard, { flex: 1 }]} variant="flat">
                  <Ionicons name="people-outline" size={24} color={theme.colors.secondary} style={styles.actionIcon} />
                  <ThemedText style={[styles.actionTitle, { 
                    color: theme.colors.textPrimary,
                    fontWeight: theme.fontWeights.semiBold,
                    fontSize: theme.fontSizes.md
                  }]}>
                    Find Workers
                  </ThemedText>
                  <ThemedText style={[styles.actionDescription, {
                    color: theme.colors.textSecondary,
                    fontSize: theme.fontSizes.sm,
                    marginBottom: theme.spacing.sm
                  }]}>
                    {workersCount} workers available
                  </ThemedText>
                  <Button 
                    title="Browse" 
                    onPress={handleFindWorkers} 
                    variant="secondary" 
                    size="sm"
                    icon="arrow-forward"
                  />
                </Card>
          </View>
        </View>

        {/* Featured Categories Section */}
        <View style={styles.featuredSection}>
          <ThemedText style={[styles.sectionTitle, { 
            color: theme.colors.textPrimary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontWeights.semiBold,
            marginBottom: theme.spacing.md 
          }]}>
            Featured Categories
          </ThemedText>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {['Construction', 'Plumbing', 'Electrical', 'Carpentry', 'Painting'].map((category) => (
              <Card key={category} style={styles.categoryCard} variant="elevated" padding="small">
                <ThemedText style={{ 
                  color: theme.colors.textPrimary,
                  fontWeight: theme.fontWeights.medium,
                  fontSize: theme.fontSizes.md
                }}>
                  {category}
                </ThemedText>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* Role-specific Benefits Section */}
        <View style={styles.benefitsSection}>
          <ThemedText style={[styles.sectionTitle, { 
            color: theme.colors.textPrimary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontWeights.semiBold,
            marginBottom: theme.spacing.md 
          }]}>
            Why Use Lmoqf?
          </ThemedText>
          <Card style={styles.benefitCard} variant="outlined">
                <View style={styles.benefitItem}>
                  <Ionicons name="search" size={24} color={theme.colors.primary} style={styles.benefitIcon} />
                  <View style={styles.benefitContent}>
                    <ThemedText style={[styles.benefitTitle, { 
                      color: theme.colors.textPrimary,
                      fontWeight: theme.fontWeights.semiBold 
                    }]}>
                      Find Skilled Workers
                    </ThemedText>
                    <ThemedText style={[styles.benefitDescription, { color: theme.colors.textSecondary }]}>
                      Access a pool of qualified local workers
                    </ThemedText>
                  </View>
                </View>
                
                <View style={styles.benefitItem}>
                  <Ionicons name="timer" size={24} color="#FFC107" style={styles.benefitIcon} />
                  <View style={styles.benefitContent}>
                    <ThemedText style={[styles.benefitTitle, { 
                      color: theme.colors.textPrimary,
                      fontWeight: theme.fontWeights.semiBold 
                    }]}>
                      Quick Hiring
                    </ThemedText>
                    <ThemedText style={[styles.benefitDescription, { color: theme.colors.textSecondary }]}>
                      Find available workers in your area today
                    </ThemedText>
                  </View>
                </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
  welcomeSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  welcomeText: {
    marginLeft: 8,
  },
  welcomeSubtitle: {
    marginLeft: 36,
  },
  actionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    padding: 16,
    alignItems: 'flex-start',
  },
  actionIcon: {
    marginBottom: 12,
  },
  actionTitle: {
    marginBottom: 4,
  },
  actionDescription: {
    marginBottom: 16,
  },
  featuredSection: {
    marginBottom: 24,
  },
  categoriesContainer: {
    paddingRight: 16,
    gap: 8,
  },
  categoryCard: {
    padding: 12,
    minWidth: 24,
    maxWidth: 160,
    alignItems: 'center',
  },
  benefitsSection: {
    marginBottom: 84,
  },
  benefitCard: {
    padding: 0,
  },
  benefitItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  benefitIcon: {
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});