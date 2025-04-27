import { Stack } from 'expo-router';
import { useTheme } from '@/app/theme/useTheme';
import { StatusBar } from 'expo-status-bar';

// Import navigation types
import { OnboardingStackParamList } from '../types/navigation';

export default function OnboardingLayout() {
  const theme = useTheme();

  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false, // Default is no header
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'slide_from_right',
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTitleStyle: {
            color: theme.colors.textPrimary,
            fontSize: 18,
            fontWeight: '600',
          },
          headerTintColor: theme.colors.primary, // Sets the color for back button and title
        }}
      >
        {/* Main onboarding screen */}
        <Stack.Screen 
          name="index" 
          options={{
            title: 'Welcome',
            headerShown: false, // Hide header for the main onboarding screen
          }}
        />
        
        {/* Worker registration screen */}
        <Stack.Screen 
          name="worker-registration"
          options={{
            title: 'Register as a Worker',
            headerShown: true, // Explicitly show header with back button
            headerBackVisible: true, // Explicitly show back button
            headerBackTitle: '', // Hide back text if present
            headerShadowVisible: false, // Remove shadow
          }}
        />
      </Stack>
    </>
  );
}
