import { Stack } from 'expo-router';
import { useTheme } from '@/app/theme/useTheme';
import { StatusBar } from 'expo-status-bar';


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
              title: 'Profile',
              headerShown: false,
            }}
        />

        <Stack.Screen
            name="edit-profile"
            options={{
              title: 'Edit Profile',
              headerShown: true,
              headerBackVisible: true,
            }}
        />
        
        
      </Stack>
    </>
  );
}
