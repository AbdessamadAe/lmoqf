import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import 'react-native-get-random-values'; // Required for crypto functions
import { v4 as uuidv4 } from 'uuid';

// Worker profile interface
export interface WorkerProfile {
  id?: string;  // Generated on backend
  name: string;
  phone: string;
  location: string;
  skill: string;
  available: boolean;
}

/**
 * Check if a phone number already exists in the workers table
 */
export const checkPhoneExists = async (phone: string): Promise<boolean> => {
  try {
    const { data, error, count } = await supabase
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
export const registerWorker = async (workerData: WorkerProfile): Promise<boolean> => {
  try {
    // Validate worker data
    const validation = validateWorkerData(workerData);
    if (!validation.valid) {
      Alert.alert('Validation Error', validation.message || 'Please complete all required fields');
      return false;
    }
    
    // Check if phone number already exists
    const phoneExists = await checkPhoneExists(workerData.phone);
    if (phoneExists) {
      Alert.alert(
        'Phone Number Already Registered',
        'This phone number is already registered in our system. Please use a different phone number or contact support if you need to update your existing profile.'
      );
      return false;
    }
    
    // Add some default values for fields that would normally be set on the backend
    const augmentedWorkerData: WorkerProfile = {
      ...workerData,
      id: workerData.id || uuidv4(), // Generate proper UUID
      available: workerData.available
    };
    
    // Insert the worker profile into Supabase workers table
    const { error: profileError } = await supabase
      .from('workers')
      .upsert(augmentedWorkerData);
      
    if (profileError) throw profileError;
    
    // If worker is available, set their availability status in the worker_availability table
    if (workerData.available) {
      const { error: availabilityError } = await supabase
        .from('worker_availability')
        .upsert({
          phone_number: workerData.phone,
          is_available: true,
          available_since: new Date().toISOString()
        });
        
      if (availabilityError) throw availabilityError;
    }
    
    return true;
  } catch (error) {
    console.error('Error registering worker:', error);
    Alert.alert('Registration Error', 'Could not complete registration. Please try again.');
    return false;
  }
};

/**
 * Check if worker registration is valid
 */
export const validateWorkerData = (data: Partial<WorkerProfile>): { valid: boolean; message?: string } => {
  if (!data.name || data.name.trim() === '') {
    return { valid: false, message: 'Name is required' };
  }
  
  if (!data.phone || data.phone.trim() === '') {
    return { valid: false, message: 'Phone number is required' };
  }
  
  if (!data.location || data.location.trim() === '') {
    return { valid: false, message: 'Location is required' };
  }
  
  if (!data.skill || data.skill.trim() === '') {
    return { valid: false, message: 'Please select a skill' };
  }
  
  return { valid: true };
};