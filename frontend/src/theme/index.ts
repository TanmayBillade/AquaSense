import { MD3LightTheme, MD3DarkTheme, configureFonts, useTheme } from 'react-native-paper';
import { Colors } from './colors';
import { Typography } from './typography';
import { Spacing } from './spacing';

const fontConfig = configureFonts({ config: Typography });

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...Colors.light,
    elevation: {
      ...MD3LightTheme.colors.elevation,
      ...Colors.light.elevation,
    },
  },
  fonts: fontConfig,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...Colors.dark,
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      ...Colors.dark.elevation,
    },
  },
  fonts: fontConfig,
};

export type AppTheme = typeof lightTheme;
export const useAppTheme = () => useTheme<AppTheme>();

export { Colors, Typography, Spacing };
