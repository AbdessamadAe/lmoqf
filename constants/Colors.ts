/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { lightTheme, darkTheme } from '../app/theme/theme';

// Using theme colors instead of hardcoded values
export const Colors = {
  light: {
    text: lightTheme.colors.textPrimary,
    background: lightTheme.colors.background,
    tint: lightTheme.colors.primary,
    icon: lightTheme.colors.textSecondary,
    tabIconDefault: lightTheme.colors.textSecondary,
    tabIconSelected: lightTheme.colors.primary,
  },
  dark: {
    text: darkTheme.colors.textPrimary,
    background: darkTheme.colors.background,
    tint: darkTheme.colors.primary,
    icon: darkTheme.colors.textSecondary,
    tabIconDefault: darkTheme.colors.textSecondary,
    tabIconSelected: darkTheme.colors.primary,
  },
};
