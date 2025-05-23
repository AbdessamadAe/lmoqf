import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_ROLE_STORAGE_KEY } from '@/constants/localStorage';

export type UserRole = 'worker' | 'hirer' | null;

interface UserRoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => Promise<void>;
  isWorker: boolean;
  isHirer: boolean;
  isRoleSelected: boolean;
}

const UserRoleContext = createContext<UserRoleContextType>({
  userRole: null,
  setUserRole: async () => {},
  isWorker: false,
  isHirer: false,
  isRoleSelected: false,
});

export const useUserRole = () => useContext(UserRoleContext);

export const UserRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRoleState] = useState<UserRole>(null);

  useEffect(() => {
    // Load saved user role from AsyncStorage on component mount
    const loadUserRole = async () => {
      try {
        const savedRole = await AsyncStorage.getItem(USER_ROLE_STORAGE_KEY) as UserRole;
        if (savedRole) {
          setUserRoleState(savedRole);
        }
      } catch (error) {
        console.error('Error loading user role:', error);
      }
    };

    loadUserRole();
  }, []);

  const setUserRole = async (role: UserRole) => {
    try {
      if (role) {
        await AsyncStorage.setItem(USER_ROLE_STORAGE_KEY, role);
      } else {
        await AsyncStorage.removeItem(USER_ROLE_STORAGE_KEY);
      }
      setUserRoleState(role);
    } catch (error) {
      console.error('Error saving user role:', error);
    }
  };

  const value = {
    userRole,
    setUserRole,
    isWorker: userRole === 'worker',
    isHirer: userRole === 'hirer',
    isRoleSelected: userRole !== null,
  };

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
};

export default UserRoleContext;