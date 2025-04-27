import { Stack } from 'expo-router';
import { useTheme } from '@/app/theme/useTheme';
import { StatusBar } from 'expo-status-bar';
import i18n from '@/app/i18n/i18n';

export default function ProfileLayout() {
  const theme = useTheme();

  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'slide_from_right',
        }}
      >

        <Stack.Screen
            name="index"
            options={{
              title: i18n.t('profile'),
              headerShown: false,
            }}
        />

        <Stack.Screen
            name="edit-profile"
            options={{
              title: i18n.t('workerProfile.editProfile'),
              headerShown: true,
              headerBackVisible: true,
            }}
        />
        
        
      </Stack>
    </>
  );
}
