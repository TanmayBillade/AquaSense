import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  colors?: string[];
}

const GradientBackground: React.FC<Props> = ({ children, style, colors }) => {
  const theme = useAppTheme();
  const defaultColors = [theme.colors.primary, theme.colors.secondary];

  return (
    <LinearGradient colors={colors || defaultColors} style={[styles.container, style]}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default GradientBackground;
