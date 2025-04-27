/**
 * Service for fetching data needed by hirers
 */
import { supabase } from '../lib/supabase';
import { HIRER_LOCATION_KEY } from '@/constants/localStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';



export const saveHirerLocation = async (location: string): Promise<void> => {
  try {
    // Save the location to AsyncStorage
    await AsyncStorage.setItem(HIRER_LOCATION_KEY, location.trim());
  } catch (error) {
    console.error('Error saving location:', error);
    throw new Error('Failed to save location');
  }
};

export const getHirerLocation = async (): Promise<string | null> => {
  try {
    // Retrieve the location from AsyncStorage
    const location = await AsyncStorage.getItem(HIRER_LOCATION_KEY);
    return location;
  }
  catch (error) {
    console.error('Error retrieving location:', error);
    throw new Error('Failed to retrieve location');
  }
};

// Reusable error handler
const handleError = (error: any, context: string): never => {
  console.error(`Error ${context}:`, error);
  throw error;
};

/**
 * Fetch skills list from Supabase
 */
export const fetchSkills = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('name');
      
    if (error) return handleError(error, 'fetching skills');
    
    return data ? data.map(skill => skill.name) : [];
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
};

/**
 * Fetch workers with options for filtering
 * @param options Filter options
 */
export const fetchWorkers = async (options?: { 
  onlyAvailable?: boolean,
  skill?: string,
  id?: string,
  phone?: string
}): Promise<Worker[]> => {
  try {
    const query = supabase
      .from('workers')
      .select(`
        id,
        name,
        phone,
        location,
        skill,
        available
      `);

    const location = await AsyncStorage.getItem(HIRER_LOCATION_KEY);
    
    // Apply filters if provided
    if (options?.onlyAvailable) {
      query.eq('available', true);
    }
    
    if (options?.skill) {
      query.ilike('skill', `%${options.skill}%`);
    }
    
    if (options?.id) {
      query.eq('id', options.id);
    }
    
    if (options?.phone) {
      query.eq('phone', options.phone);
    }

    if (location) {
      query.eq('location', location);
    }
    
    const { data, error } = await query;
    
    if (error) return handleError(error, 'fetching workers');
    
    return data || [];
  } catch (error) {
    console.error('Error fetching workers:', error);
    return [];
  }
};

/**
 * Fetch worker by ID
 * @param workerId The ID of the worker to fetch
 */
export const fetchWorkerById = async (workerId: string): Promise<Worker | null> => {
  try {
    const workers = await fetchWorkers({ id: workerId });
    return workers.length > 0 ? workers[0] : null;
  } catch (error) {
    console.error('Error fetching worker by ID:', error);
    return null;
  }
};

/**
 * Fetch worker by phone number
 * @param phone The phone number of the worker to fetch
 */
export const fetchWorkerByPhone = async (phone: string): Promise<Worker | null> => {
  try {
    const workers = await fetchWorkers({ phone });
    return workers.length > 0 ? workers[0] : null;
  } catch (error) {
    console.error('Error fetching worker by phone:', error);
    return null;
  }
};

/**
 * Fetch available workers
 */
export const fetchAvailableWorkers = async (): Promise<Worker[]> => {
  return fetchWorkers({ onlyAvailable: true });
};

/**
 * Search workers by skill
 * @param skill The skill to search for
 */
export const searchWorkersBySkill = async (skill: string): Promise<Worker[]> => {
  return fetchWorkers({ skill });
};