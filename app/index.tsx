import { Redirect } from 'expo-router';
import { useUserRole } from '../context/UserRoleContext';
import { useEffect, useState } from 'react';

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
    // Show loading indicator while determining route
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return <Redirect href={redirectPath} />;
}