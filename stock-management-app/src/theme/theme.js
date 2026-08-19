import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightThemeColors = {
  primary: '#1E3A8A',     // Slate blue / Indigo
  primaryContainer: '#DBEAFE',
  secondary: '#0D9488',   // Teal accent
  secondaryContainer: '#CCFBF1',
  tertiary: '#F59E0B',    // Amber / Accent
  tertiaryContainer: '#FEF3C7',
  background: '#F8FAFC',  // Very light gray/blue
  surface: '#FFFFFF',
  surfaceVariant: '#F1F5F9',
  onSurface: '#0F172A',
  onSurfaceVariant: '#475569',
  outline: '#CBD5E1',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  card: '#FFFFFF',
};

export const darkThemeColors = {
  primary: '#3B82F6',     // Bright blue
  primaryContainer: '#1E3A8A',
  secondary: '#14B8A6',   // Bright teal
  secondaryContainer: '#0F766E',
  tertiary: '#FBBF24',    // Bright amber
  tertiaryContainer: '#78350F',
  background: '#0F172A',  // Dark slate
  surface: '#1E293B',     // Card / container dark surface
  surfaceVariant: '#334155',
  onSurface: '#F8FAFC',
  onSurfaceVariant: '#94A3B8',
  outline: '#475569',
  error: '#F87171',
  success: '#34D399',
  warning: '#FBBF24',
  info: '#60A5FA',
  card: '#1E293B',
};

export const CustomLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...lightThemeColors,
  },
  roundness: 12,
};

export const CustomDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkThemeColors,
  },
  roundness: 12,
};
