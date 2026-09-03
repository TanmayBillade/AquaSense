import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../../theme';

interface GaugeChartProps {
  value: number; // 0-100
  size?: number;
  label?: string;
  status?: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value = 0,
  size = 160,
  label,
  status,
}) => {
  const theme = useAppTheme();
  const safeValue = typeof value === 'number' && !isNaN(value) ? Math.min(100, Math.max(0, value)) : 0;
  const radius = size / 2 - 15;
  const strokeWidth = 15;
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: safeValue,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [safeValue, animatedValue]);

  const rotation = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['-90deg', '90deg'],
  });

  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 180) * Math.PI / 180.0;
    return {
      x: centerX + (r * Math.cos(angleInRadians)),
      y: centerY + (r * Math.sin(angleInRadians))
    };
  };

  const createArc = (startAngle: number, endAngle: number, color: string) => {
    const start = polarToCartesian(size / 2, size / 2, radius, endAngle);
    const end = polarToCartesian(size / 2, size / 2, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return (
      <Path
        d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        key={color}
      />
    );
  };

  return (
    <View style={{ width: size, height: size / 2 + 40, alignItems: 'center' }}>
      <Svg width={size} height={size / 2 + 10}>
        {/* Red 0-40 */}
        {createArc(0, 72, theme.colors.error)}
        {/* Orange 40-70 */}
        {createArc(72, 126, 'orange')}
        {/* Green 70-100 */}
        {createArc(126, 180, '#4caf50')}
      </Svg>
      
      {/* Needle */}
      <Animated.View style={{
        position: 'absolute',
        top: size / 2 - 15,
        left: size / 2 - 4,
        width: 8,
        height: size / 2,
        backgroundColor: theme.colors.onSurface,
        transform: [
          { translateY: -(size / 4) },
          { rotate: rotation as unknown as string },
          { translateY: size / 4 }
        ],
        borderRadius: 4,
      }} />

      <View style={{ position: 'absolute', bottom: 0, alignItems: 'center' }}>
        <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>{safeValue.toFixed(0)}%</Text>
        {label && <Text variant="bodySmall">{label}</Text>}
        {status && <Text variant="labelSmall" style={{ color: theme.colors.primary, marginTop: 4 }}>{status}</Text>}
      </View>
    </View>
  );
};
