/**
 * Navigation types for the Lmouqf app.
 * Provides type safety for route names and params.
 */

/**
 * Root navigation parameters
 */
export type RootStackParamList = {
  '(onboarding)': undefined;
  'worker-registration': undefined;
  '(worker-tabs)': undefined;
  '(hirer-tabs)': undefined;
  '+not-found': undefined;
};

/**
 * Onboarding stack parameters
 */
export type OnboardingStackParamList = {
  index: undefined;
  'worker-registration': undefined;
};

/**
 * Worker tabs parameters
 */
export type WorkerTabsParamList = {
  index: { newRegistration?: string };
  profile: { directFromRegistration?: string };
  settings: undefined;
};

/**
 * Hirer tabs parameters
 */
export type HirerTabsParamList = {
  index: undefined;
  workers: undefined;
  settings: undefined;
};

/**
 * Combined params list for easy import
 */
export type AppParamList =
  & RootStackParamList
  & OnboardingStackParamList
  & WorkerTabsParamList
  & HirerTabsParamList;