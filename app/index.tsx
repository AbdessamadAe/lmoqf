import { Redirect } from 'expo-router';
import { useUserRole } from './context/UserRoleContext';
import { useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function Index() {
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