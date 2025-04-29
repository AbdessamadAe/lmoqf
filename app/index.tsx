import { Redirect } from 'expo-router';
import { useUserRole } from './context/UserRoleContext';
import { useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import * as Notifications from 'expo-notifications';
import { scheduleDailyReminder } from './helpers/notification';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export default function Index() {
  // Schedule a daily reminder
  useEffect(() => {
    scheduleDailyReminder(12, 45);
  }, []);

  const { userRole, isRoleSelected } = useUserRole();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    if (isRoleSelected) {
      const path = userRole === 'worker' 
        ? '(worker-tabs)' 
        : '(hirer-tabs)';
      setRedirectPath(path);
    } else {
      setRedirectPath('(onboarding)');
    }
  }, [userRole, isRoleSelected]);

  if (redirectPath === null) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return <Redirect href={redirectPath} />;
}