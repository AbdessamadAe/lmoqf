import { Alert } from 'react-native';

// Types for worker registration
export interface WorkerProfile {
  name: string;
  phone: string;
  location: string;
  skill: string;
  available: boolean;
}

/**
 * Register a new worker
 * This would typically call an API endpoint in a real app
 */
export const registerWorker = async (workerData: WorkerProfile): Promise<boolean> => {
  try {
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would be an API call:
    // const response = await fetch('api/workers', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(workerData)
    // });
    // return response.ok;
    
    console.log('Worker registered:', workerData);
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