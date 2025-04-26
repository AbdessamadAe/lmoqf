import { supabase } from '../app/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const WORKER_PROFILE_KEY = '@lmoqf:worker_profile';
const WORKER_AVAILABLE_KEY = '@lmoqf:worker_available';
const WAITING_START_TIME_KEY = '@lmoqf:waiting_start_time';

// Types
export type WorkerAvailability = {
  isAvailable: boolean;
  availableSince: string; // ISO date string
  phoneNumber: string;
};

// Save worker profile data to Supabase and AsyncStorage
export const saveWorkerProfile = async (profileData: any): Promise<void> => {
  try {
    // Save to Supabase
    const { error } = await supabase
      .from('workers')
      .upsert({ 
        id: profileData.id,
        ...profileData 
      });
      
    if (error) throw error;
    
    // Also save to AsyncStorage
    await AsyncStorage.setItem(WORKER_PROFILE_KEY, JSON.stringify(profileData));
  } catch (error) {
    console.error('Error saving worker profile:', error);
    throw error;
  }
};

// Get worker profile data with fallback to AsyncStorage if Supabase fails
export const getWorkerProfile = async (phone?: string): Promise<any | null> => {
  try {
    // First try to get from AsyncStorage as it's faster and more reliable
    const localProfileString = await AsyncStorage.getItem(WORKER_PROFILE_KEY);
    const localProfile = localProfileString ? JSON.parse(localProfileString) : null;
    
    // If we have a specific phone to search for and it doesn't match the stored profile
    if (phone && localProfile && localProfile.phone !== phone) {
      localProfile = null;
    }
    
    // If we have local profile and no specific phone was requested, return it immediately
    if (localProfile && !phone) {
      console.log('Retrieved profile from AsyncStorage:', localProfile.name);
      return localProfile;
    }
    
    // Try to get from Supabase with or without phone filter
    const query = supabase.from('workers').select('*');
    
    if (phone) {
      query.eq('phone', phone);
    }
    
    const { data, error } = await query.single();

    if (error && error.code !== 'PGRST116') {
      // If there's a real error (not just "no rows"), use AsyncStorage as fallback
      console.log('Supabase error, using AsyncStorage profile');
      return localProfile;
    }
    
    // If we got data from Supabase, sync it to AsyncStorage for future offline use
    if (data) {
      await AsyncStorage.setItem(WORKER_PROFILE_KEY, JSON.stringify(data));
      return data;
    }
    
    // If no Supabase data but we have local data, use that
    if (localProfile) {
      return localProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting worker profile:', error);
    
    // Last resort: try AsyncStorage
    try {
      const localProfileString = await AsyncStorage.getItem(WORKER_PROFILE_KEY);
      return localProfileString ? JSON.parse(localProfileString) : null;
    } catch (localError) {
      console.error('Complete failure getting profile:', localError);
      return null;
    }
  }
};

// Set worker as available in both Supabase and AsyncStorage
export const setWorkerAvailable = async (phoneNumber: string): Promise<void> => {
  try {
    const availabilityData: WorkerAvailability = {
      isAvailable: true,
      availableSince: new Date().toISOString(),
      phoneNumber
    };
    
    // Save to Supabase
    const { error } = await supabase
      .from('worker_availability')
      .upsert({ 
        phone_number: phoneNumber,
        is_available: true,
        available_since: new Date().toISOString()
      });
      
    if (error) throw error;
    
    // Save to AsyncStorage
    await AsyncStorage.setItem(WORKER_AVAILABLE_KEY, JSON.stringify(availabilityData));
    await AsyncStorage.setItem(WAITING_START_TIME_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Error setting worker availability:', error);
    throw error;
  }
};

// Set worker as unavailable in both Supabase and AsyncStorage
export const setWorkerUnavailable = async (): Promise<void> => {
  try {
    // Get worker profile
    const { data: worker } = await supabase
      .from('workers')
      .select('phone')
      .single();
      
    if (worker && worker.phone) {
      // Update in Supabase
      const { error } = await supabase
        .from('worker_availability')
        .update({ is_available: false })
        .eq('phone_number', worker.phone);
        
      if (error) throw error;
    }
    
    // Update in AsyncStorage (regardless of Supabase result)
    await AsyncStorage.multiRemove([WORKER_AVAILABLE_KEY, WAITING_START_TIME_KEY]);
  } catch (error) {
    console.error('Error setting worker as unavailable:', error);
    
    // Try to at least update AsyncStorage
    try {
      await AsyncStorage.multiRemove([WORKER_AVAILABLE_KEY, WAITING_START_TIME_KEY]);
    } catch (localError) {
      console.error('Failed to update local storage:', localError);
    }
    
    throw error;
  }
};

// Get worker availability status with fallback to AsyncStorage
export const getWorkerAvailability = async (): Promise<WorkerAvailability | null> => {
  try {
    // Try Supabase first
    const { data: worker } = await supabase
      .from('workers')
      .select('phone')
      .single();
      
    if (!worker) {
      // Try local storage as fallback
      const localAvailability = await AsyncStorage.getItem(WORKER_AVAILABLE_KEY);
      return localAvailability ? JSON.parse(localAvailability) : null;
    }
    
    const { data, error } = await supabase
      .from('worker_availability')
      .select('*')
      .eq('phone_number', worker.phone)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      // Try local storage on error
      const localAvailability = await AsyncStorage.getItem(WORKER_AVAILABLE_KEY);
      return localAvailability ? JSON.parse(localAvailability) : null;
    }
    
    if (data) {
      // Sync to AsyncStorage
      const availabilityData = {
        isAvailable: data.is_available,
        availableSince: data.available_since,
        phoneNumber: data.phone_number
      };
      await AsyncStorage.setItem(WORKER_AVAILABLE_KEY, JSON.stringify(availabilityData));
      return availabilityData;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting worker availability:', error);
    
    // Try local storage as last resort
    try {
      const localAvailability = await AsyncStorage.getItem(WORKER_AVAILABLE_KEY);
      return localAvailability ? JSON.parse(localAvailability) : null;
    } catch (localError) {
      console.error('Complete failure getting availability:', localError);
      return null;
    }
  }
};

// Check if worker is currently available
export const isWorkerAvailable = async (): Promise<boolean> => {
  const availability = await getWorkerAvailability();
  return availability !== null && availability.isAvailable;
};

// Get the duration that a worker has been waiting
export const getWaitingDuration = async (): Promise<number | null> => {
  try {
    // Try getting from AsyncStorage first as it's faster
    const startTimeString = await AsyncStorage.getItem(WAITING_START_TIME_KEY);
    
    if (!startTimeString) {
      // If not in AsyncStorage, check if we can get it from Supabase
      const availability = await getWorkerAvailability();
      
      if (availability && availability.isAvailable) {
        const startTime = new Date(availability.availableSince).getTime();
        const now = new Date().getTime();
        const durationMinutes = Math.floor((now - startTime) / (60 * 1000));
        
        // Save to AsyncStorage for future reference
        await AsyncStorage.setItem(WAITING_START_TIME_KEY, availability.availableSince);
        
        return durationMinutes;
      }
      
      return null;
    }
    
    // Calculate duration from AsyncStorage timestamp
    const startTime = new Date(startTimeString).getTime();
    const now = new Date().getTime();
    return Math.floor((now - startTime) / (60 * 1000));
  } catch (error) {
    console.error('Error getting waiting duration:', error);
    return null;
  }
};
