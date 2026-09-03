import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useAppTheme } from '../../theme';
import { SkeletonLoader } from '../common/SkeletonLoader';
import { Colors } from '../../theme/colors';

interface WaterQualityCardProps {
  status: string;
  description: string;
  tds: number;
  isLoading?: boolean;
}

export const WaterQualityCard: React.FC<WaterQualityCardProps> = ({
  status = 'Good',
  description = 'Water quality is monitored and safe.',
  tds = 0,
  isLoading,
}) => {
  const theme = useAppTheme();
  const isDark = theme.dark;

  const statusStr = typeof status === 'string' ? status.toLowerCase() : 'good';

  const getBgColor = (st: string) => {
    if (isDark) {
      switch (st) {
        case 'excellent': return Colors.statusDark.excellentBg;
        case 'good': return Colors.statusDark.goodBg;
        case 'moderate': return Colors.statusDark.moderateBg;
        case 'poor': return Colors.statusDark.poorBg;
        case 'unsafe': return Colors.statusDark.unsafeBg;
        default: return theme.colors.surfaceVariant;
      }
    } else {
      switch (st) {
        case 'excellent': return Colors.status.excellentBg;
        case 'good': return Colors.status.goodBg;
        case 'moderate': return Colors.status.moderateBg;
        case 'poor': return Colors.status.poorBg;
        case 'unsafe': return Colors.status.unsafeBg;
        default: return theme.colors.surfaceVariant;
      }
    }
  };

  const getTextColor = (st: string) => {
    switch (st) {
      case 'excellent': return Colors.status.excellent;
      case 'good': return Colors.status.good;
      case 'moderate': return Colors.status.moderate;
      case 'poor': return Colors.status.poor;
      case 'unsafe': return Colors.status.unsafe;
      default: return theme.colors.primary;
    }
  };

  if (isLoading) {
    return (
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <SkeletonLoader width={120} height={24} borderRadius={4} />
          <View style={{ marginTop: 8 }}>
            <SkeletonLoader width={160} height={16} borderRadius={4} />
          </View>
        </Card.Content>
      </Card>
    );
  }

  const displayStatus = typeof status === 'string' && status.length > 0 
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() 
    : 'Unknown';

  const formattedTds = typeof tds === 'number' && !isNaN(tds) ? Math.round(tds * 100) / 100 : 0;

  return (
    <Card style={[styles.card, { backgroundColor: getBgColor(statusStr) }]}>
      <Card.Content>
        <Text variant="headlineSmall" style={{ color: getTextColor(statusStr), fontWeight: 'bold' }}>
          {displayStatus}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, lineHeight: 20 }}>
          {description}
        </Text>
        <View style={[styles.footer, { borderTopColor: theme.colors.outlineVariant }]}>
          <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>
            Based on TDS: <Text style={{ fontWeight: 'bold', color: getTextColor(statusStr) }}>{formattedTds} ppm</Text>
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    flex: 1,
    elevation: 2,
  },
  footer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
});
