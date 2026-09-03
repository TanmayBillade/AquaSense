import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../../theme';

interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color: string;
  backgroundColor?: string;
  label?: string;
  sublabel?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value = 0,
  size = 120,
  strokeWidth = 10,
  color,
  backgroundColor,
  label,
  sublabel,
}) => {
  const theme = useAppTheme();
  const safeValue = typeof value === 'number' && !isNaN(value) ? Math.min(100, Math.max(0, value)) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: safeValue,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [safeValue, animatedValue]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          stroke={backgroundColor || theme.colors.surfaceVariant}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
          {safeValue.toFixed(0)}
        </Text>
        {label && <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{label}</Text>}
        {sublabel && <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>{sublabel}</Text>}
      </View>
    </View>
  );
};
