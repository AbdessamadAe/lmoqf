import { supabase } from '../app/lib/supabase';

// Types
export type WorkerAvailability = {
  isAvailable: boolean;
  availableSince: string; // ISO date string
  phoneNumber: string;
};

// Save worker profile data
export const saveWorkerProfile = async (profileData: any): Promise<void> => {
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

// Get worker profile data
export const getWorkerProfile = async (): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .single();
      
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is the "no rows returned" error
    
    return data;
  } catch (error) {
    console.error('Error getting worker profile:', error);
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
    
    const { error } = await supabase
      .from('worker_availability')
      .upsert({ 
        phone_number: phoneNumber,
        is_available: true,
        available_since: new Date().toISOString()
      });
      
    if (error) throw error;
  } catch (error) {
    console.error('Error setting worker availability:', error);
    throw error;
  }
};

// Set worker as unavailable
export const setWorkerUnavailable = async (): Promise<void> => {
  try {
    const { data: worker } = await supabase
      .from('workers')
      .select('phone')
      .single();
      
    if (worker && worker.phone) {
      const { error } = await supabase
        .from('worker_availability')
        .update({ is_available: false })
        .eq('phone_number', worker.phone);
        
      if (error) throw error;
    }
  } catch (error) {
    console.error('Error setting worker as unavailable:', error);
    throw error;
  }
};

// Get worker availability status
export const getWorkerAvailability = async (): Promise<WorkerAvailability | null> => {
  try {
    const { data: worker } = await supabase
      .from('workers')
      .select('phone')
      .single();
      
    if (!worker) return null;
    
    const { data, error } = await supabase
      .from('worker_availability')
      .select('*')
      .eq('phone_number', worker.phone)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    
    return data ? {
      isAvailable: data.is_available,
      availableSince: data.available_since,
      phoneNumber: data.phone_number
    } : null;
  } catch (error) {
    console.error('Error getting worker availability:', error);
    throw error;
  }
};

// Check if worker is currently available
export const isWorkerAvailable = async (): Promise<boolean> => {
  const availability = await getWorkerAvailability();
  return availability !== null && availability.isAvailable;
};
