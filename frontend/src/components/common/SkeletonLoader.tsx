import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useAppTheme } from '../../theme';

interface Props {
  width: number | string;
  height: number | string;
  borderRadius?: number;
}

const SkeletonLoader: React.FC<Props> = ({ width, height, borderRadius = 4 }) => {
  const theme = useAppTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: false }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: false }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.skeleton, { width, height, borderRadius, backgroundColor: theme.colors.outlineVariant, opacity }]} />
  );
};

const styles = StyleSheet.create({
  skeleton: { overflow: 'hidden' },
});

export { SkeletonLoader };
export default SkeletonLoader;
