import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import 'react-native-get-random-values'; // Required for crypto functions
import { v4 as uuidv4 } from 'uuid';
import { Worker } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HIRER_CALLED_WORKERS_KEY, WORKER_PHONE_KEY } from '@/constants/localStorage';


// Worker profile interface should use Worker from dataService
export type WorkerProfile = Worker;

// Types
export type WorkerAvailability = {
  isAvailable: boolean;
  availableSince: string; // ISO date string
  phoneNumber: string;
  lastChecked?: string; // Track when we last checked availability
};

// Constants for availability reset check
const AVAILABILITY_LAST_CHECKED = 'lmoqf@:availabilityLastChecked';
const AVAILABILITY_RESET_DETECTED = 'lmoqf@:availabilityResetDetected';

export const getCalledWorkers = async (): Promise<Worker[]> => {
  try {
    const calledworkers = await AsyncStorage.getItem(HIRER_CALLED_WORKERS_KEY);
    if (calledworkers) {
      return JSON.parse(calledworkers);
    }
    return [];
  } catch (error) {
    console.error('Error getting called workers:', error);
    return [];
  }
}


export const setCalledWorkers = async (calledWorkers: Worker[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(HIRER_CALLED_WORKERS_KEY, JSON.stringify(calledWorkers));
  } catch (error) {
    console.error('Error setting called workers:', error);
  }
}

// Save worker profile data to Supabase - consolidating with workerService.registerWorker
export const saveWorkerProfile = async (profileData: Worker): Promise<void> => {
  try {
    const { error } = await supabase
      .from('workers')
      .upsert({
        id: profileData.id,
        ...profileData
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving worker profile:', error);
    throw error;
  }
};

// Get worker profile data from Supabase
export const getWorkerProfile = async (): Promise<Worker | null> => {
  try {
    
    const phoneNumber = await AsyncStorage.getItem(WORKER_PHONE_KEY);
    if (!phoneNumber) {
      throw new Error('No phone number found for the worker');
    }

    // Fetch the worker profile using the phone number stored in AsyncStorage
    const query = supabase.from('workers').select('*').eq('phone', phoneNumber);
    const { data, error } = await query.single();

    if (error) {
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error('Error getting worker profile:', error);
    return null;
  }
};

// Set worker as available in Supabase
export const setWorkerAvailable = async (): Promise<void> => {
  try {
    const phoneNumber = await AsyncStorage.getItem(WORKER_PHONE_KEY);
    if (!phoneNumber) {
      throw new Error('No phone number found for the worker');
    }
    
    // Update availability directly in the workers table
    const { error } = await supabase
      .from('workers')
      .update({ 
        available: true,
        updated_at: new Date().toISOString() 
      })
      .eq('phone', phoneNumber);

    if (error) throw error;
  } catch (error) {
    console.error('Error setting worker availability:', error);
    throw error;
  }
};

// Set worker as unavailable in Supabase
export const setWorkerUnavailable = async (): Promise<void> => {
  try {
    const phoneNumber = await AsyncStorage.getItem(WORKER_PHONE_KEY);
    if (!phoneNumber) {
      throw new Error('No phone number found for the worker');
    }
    
    // Update availability directly in the workers table
    const { error } = await supabase
      .from('workers')
      .update({ 
        available: false,
        updated_at: new Date().toISOString()
      })
      .eq('phone', phoneNumber);

    if (error) throw error;
  } catch (error) {
    console.error('Error setting worker availability:', error);
    throw error;
  }
};

// Get worker availability status from Supabase
export const getWorkerAvailability = async (): Promise<WorkerAvailability | null> => {
  try {
    const phoneNumber = await AsyncStorage.getItem(WORKER_PHONE_KEY);
    if (!phoneNumber) {
      throw new Error('No phone number found for the worker');
    }

    const { data, error } = await supabase
      .from('workers')
      .select('available, updated_at, phone')
      .eq('phone', phoneNumber)
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      return {
        isAvailable: data.available,
        availableSince: data.updated_at,
        phoneNumber: data.phone
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting worker availability:', error);
    return null;
  }
};

// Check if worker is currently available
export const isWorkerAvailable = async (): Promise<boolean> => {
  const availability = await getWorkerAvailability();
  return availability !== null && availability.isAvailable;
};

/**
 * Logs out the worker and clears all locally stored data
 */
export const logoutWorker = async (): Promise<void> => {
  try {
    // Before clearing data, delete worker
    try {
      const phoneNumber = await AsyncStorage.getItem(WORKER_PHONE_KEY);
      if (phoneNumber) {
        await supabase.from('workers').delete().eq('phone', phoneNumber);
      }
    } catch (error) {
      console.error('Error deleting worker during logout:', error);
      // Continue with logout process even if this fails
    }
    
    // Clear all AsyncStorage data
    await AsyncStorage.deleteItem(WORKER_PHONE_KEY);
    

    
    console.log('Worker logged out successfully, all local storage cleared');
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

/**
 * Check if a phone number already exists in the workers table
 */
export const checkPhoneExists = async (phone: string): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from('workers')
      .select('*', { count: 'exact', head: true })
      .eq('phone', phone);
      
    if (error) {
      console.error('Error checking phone existence:', error);
      return false;
    }
    
    return count !== null && count > 0;
  } catch (error) {
    console.error('Error checking if phone exists:', error);
    return false;
  }
};

/**
 * Register a new worker using Supabase
 */
export const registerWorker = async (workerData: WorkerProfile): Promise<{ success: boolean, profile?: WorkerProfile }> => {
  try {
    // Validate worker data
    const validation = validateWorkerData(workerData);
    if (!validation.valid) {
      Alert.alert('Validation Error', validation.message || 'Please complete all required fields');
      return { success: false };
    }
    
    // Check if phone number already exists
    const phoneExists = await checkPhoneExists(workerData.phone);
    if (phoneExists) {
      Alert.alert(
        'Phone Number Already Registered',
        'This phone number is already registered in our system. Please use a different phone number or contact support if you need to update your existing profile.'
      );
      return { success: false };
    }
    
    // Add some default values for fields that would normally be set on the backend
    const augmentedWorkerData: WorkerProfile = {
      ...workerData,
      id: workerData.id || uuidv4(), // Generate proper UUID
    };
    
    // Insert the worker profile into Supabase workers table
    const { error } = await supabase
      .from('workers')
      .insert([augmentedWorkerData]);
      
    if (error) throw error;

    //store user phone number in AsyncStorage
    await AsyncStorage.setItem(WORKER_PHONE_KEY, workerData.phone);
    
    return { success: true, profile: augmentedWorkerData };
  } catch (error) {
    console.error('Error registering worker:', error);
    Alert.alert('Registration Error', 'Could not complete registration. Please try again.');
    return { success: false };
  }
};


/*
  update worker profile
*/

export const updateWorkerProfile = async (workerData: WorkerProfile): Promise<{ success: boolean, profile?: WorkerProfile }> => {
  try {
    // Validate worker data
    const validation = validateWorkerData(workerData);
    if (!validation.valid) {
      Alert.alert('Validation Error', validation.message || 'Please complete all required fields');
      return { success: false };
    }
    
    // Update the worker profile in Supabase
    const { error } = await supabase
      .from('workers')
      .update(workerData)
      .eq('phone', workerData.phone);
      
    if (error) throw error;

    return { success: true, profile: workerData };
  } catch (error) {
    console.error('Error updating worker profile:', error);
    Alert.alert('Update Error', 'Could not update your profile. Please try again.');
    return { success: false };
  }
};

/**
 * Check if worker registration is valid
 */
export const validateWorkerData = (data: Partial<WorkerProfile>): { valid: boolean; message?: string } => {
  if (!data.name || data.name.trim() === '') {
    return { valid: false, message: 'Please enter your name' };
  }
  
  if (!data.phone || data.phone.trim() === '') {
    return { valid: false, message: 'Please enter your phone number' };
  }
  
  if (!data.location || data.location.trim() === '') {
    return { valid: false, message: 'Please enter your location' };
  }
  
  if (!data.skill || data.skill.trim() === '') {
    return { valid: false, message: 'Please select a skill' };
  }
  
  return { valid: true };
};

/**
 * Check if worker availability was reset by the system (at 9pm)
 * Returns true if worker was available before and is now unavailable due to system reset
 */
export const checkAvailabilityReset = async (): Promise<boolean> => {
  try {
    // Get the worker availability
    const availability = await getWorkerAvailability();
    if (!availability) return false;
    
    // Get the last checked time from AsyncStorage
    const lastCheckedStr = await AsyncStorage.getItem(AVAILABILITY_LAST_CHECKED);
    const lastAvailableStr = await AsyncStorage.getItem('lmoqf@:lastAvailableState');
    const wasAvailable = lastAvailableStr === 'true';
    
    // Update last checked time and available state
    await AsyncStorage.setItem(AVAILABILITY_LAST_CHECKED, new Date().toISOString());
    await AsyncStorage.setItem('lmoqf@:lastAvailableState', String(availability.isAvailable));
    
    // If worker was available before but is not available now, and we've checked before
    if (wasAvailable && !availability.isAvailable && lastCheckedStr) {
      // Check if this happened due to the 9pm reset
      const lastChecked = new Date(lastCheckedStr);
      const updatedAt = new Date(availability.availableSince);
      
      // If the update happened after the last check, and around 9pm (between 8:45pm and 9:15pm)
      const updateHour = updatedAt.getHours();
      if (updatedAt > lastChecked && (updateHour === 19 || updateHour === 7)) {
        // Mark that we detected a reset
        await AsyncStorage.setItem(AVAILABILITY_RESET_DETECTED, 'true');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking availability reset:', error);
    return false;
  }
};

/**
 * Check if there's a pending notification for availability reset
 */
export const hasAvailabilityResetNotification = async (): Promise<boolean> => {
  try {
    const resetDetected = await AsyncStorage.getItem(AVAILABILITY_RESET_DETECTED);
    return resetDetected === 'true';
  } catch (error) {
    console.error('Error getting availability reset notification status:', error);
    return false;
  }
};

/**
 * Clear the availability reset notification after it's shown
 */
export const clearAvailabilityResetNotification = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(AVAILABILITY_RESET_DETECTED, 'false');
  } catch (error) {
    console.error('Error clearing availability reset notification:', error);
  }
};

/**
 * Start periodic check for availability reset
 * This should be called when the worker app starts
 */
export const startAvailabilityResetCheck = async (): Promise<void> => {
  // Check for reset immediately when starting
  await checkAvailabilityReset();
};