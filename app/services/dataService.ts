/**
 * Service for fetching various data needed by the app
 */
import { supabase } from '../lib/supabase';

// Worker type definition
export interface Worker {
  id: string;
  name: string;
  phone: string;
  location: string;
  skill: string;
  available?: boolean;
}

/**
 * Fetch skills list from Supabase
 */
export const fetchSkills = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('name');
      
    if (error) throw error;
    
    return data ? data.map(skill => skill.name) : [];
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
};

/**
 * Fetch all available workers
 */
export const fetchWorkers = async (): Promise<Worker[]> => {
  try {
    const { data, error } = await supabase
      .from('workers')
      .select(`
        id,
        name,
        phone,
        location,
        skill,
        available
      `);
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching workers:', error);
    return [];
  }
};

/**
 * Fetch available workers
 * @param onlyAvailable If true, returns only workers who are currently available
 */
export const fetchAvailableWorkers = async (onlyAvailable = true): Promise<Worker[]> => {
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
    
    if (onlyAvailable) {
      query.eq('available', true);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching available workers:', error);
    return [];
  }
};

/**
 * Fetch worker by ID
 * @param workerId The ID of the worker to fetch
 */
export const fetchWorkerById = async (workerId: string): Promise<Worker | null> => {
  try {
    const { data, error } = await supabase
      .from('workers')
      .select(`
        id,
        name,
        phone,
        location,
        skill,
        available
      `)
      .eq('id', workerId)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching worker by ID:', error);
    return null;
  }
};

/**
 * Search workers by skill
 * @param skill The skill to search for
 */
export const searchWorkersBySkill = async (skill: string): Promise<Worker[]> => {
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
    
    if (skill) {
      // Case insensitive search
      query.ilike('skill', `%${skill}%`);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error searching workers by skill:', error);
    return [];
  }
};