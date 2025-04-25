/**
 * Service for fetching various data needed by the app
 */

// Worker type definition
export interface Worker {
  id: string;
  name: string;
  skill: string;
  location: string;
  rating: number;
  ratingCount: number;
  hourlyRate: number;
  available: boolean;
}

/**
 * Fetch skills list from mock data
 */
export const fetchSkills = async (): Promise<string[]> => {
  try {
    // In a real app, this would be an API call
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Import mock data
    const mockData = require('../lib/mockData.json');
    return mockData.skills || [];
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
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const workersData = require('../lib/workers.json');
    return workersData.workers || [];
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
    const workers = await fetchWorkers();
    
    if (onlyAvailable) {
      return workers.filter(worker => worker.available);
    }
    
    return workers;
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
    const workers = await fetchWorkers();
    return workers.find(worker => worker.id === workerId) || null;
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
    const workers = await fetchWorkers();
    
    if (!skill) return workers;
    
    return workers.filter(worker => 
      worker.skill.toLowerCase() === skill.toLowerCase()
    );
  } catch (error) {
    console.error('Error searching workers by skill:', error);
    return [];
  }
};