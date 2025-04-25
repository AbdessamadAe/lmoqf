import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storage
const WORKER_PROFILE_KEY = '@lmoqf:worker_profile';
const WORKER_AVAILABILITY_KEY = '@lmoqf:worker_availability';

// Types
export type WorkerAvailability = {
  isAvailable: boolean;
  availableSince: string; // ISO date string
  phoneNumber: string;
};

// Save worker profile data
export const saveWorkerProfile = async (profileData: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(WORKER_PROFILE_KEY, JSON.stringify(profileData));
  } catch (error) {
    console.error('Error saving worker profile:', error);
    throw error;
  }
};

// Get worker profile data
export const getWorkerProfile = async (): Promise<any | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(WORKER_PROFILE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving worker profile:', error);
    throw error;
  }
};

// Set worker as available
export const setWorkerAvailable = async (phoneNumber: string): Promise<void> => {
  try {
    const availabilityData: WorkerAvailability = {
      isAvailable: true,
      availableSince: new Date().toISOString(),
      phoneNumber
    };
    await AsyncStorage.setItem(WORKER_AVAILABILITY_KEY, JSON.stringify(availabilityData));
  } catch (error) {
    console.error('Error setting worker availability:', error);
    throw error;
  }
};

// Set worker as unavailable
export const setWorkerUnavailable = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(WORKER_AVAILABILITY_KEY);
  } catch (error) {
    console.error('Error removing worker availability:', error);
    throw error;
  }
};

// Get worker availability status
export const getWorkerAvailability = async (): Promise<WorkerAvailability | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(WORKER_AVAILABILITY_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving worker availability:', error);
    throw error;
  }
};

// Check if worker is currently available
export const isWorkerAvailable = async (): Promise<boolean> => {
  const availability = await getWorkerAvailability();
  return availability !== null && availability.isAvailable;
};

// Calculate how long the worker has been waiting
export const getWaitingDuration = async (): Promise<number | null> => {
  const availability = await getWorkerAvailability();
  if (!availability) return null;
  
  const availableSince = new Date(availability.availableSince).getTime();
  const now = new Date().getTime();
  
  // Return duration in minutes
  return Math.floor((now - availableSince) / (1000 * 60));
};