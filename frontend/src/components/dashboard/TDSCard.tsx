import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';
import { SkeletonLoader } from '../common/SkeletonLoader';
import { getRelativeTime } from '../../utils/formatters';
import { Colors } from '../../theme/colors';

interface TDSCardProps {
  tds: number;
  timestamp: string;
  isLoading?: boolean;
}

export const TDSCard: React.FC<TDSCardProps> = ({ tds, timestamp, isLoading }) => {
  const theme = useAppTheme();
  const isDark = theme.dark;

  const getTdsColor = (val: number) => {
    if (val < 50) return isDark ? Colors.statusDark.excellentBg : Colors.status.excellentBg;
    if (val <= 150) return isDark ? Colors.statusDark.goodBg : Colors.status.goodBg;
    if (val <= 250) return isDark ? Colors.statusDark.moderateBg : Colors.status.moderateBg;
    if (val <= 300) return isDark ? Colors.statusDark.poorBg : Colors.status.poorBg;
    return isDark ? Colors.statusDark.unsafeBg : Colors.status.unsafeBg;
  };

  const getAccentColor = (val: number) => {
    if (val < 50) return Colors.status.excellent;
    if (val <= 150) return Colors.status.good;
    if (val <= 250) return Colors.status.moderate;
    if (val <= 300) return Colors.status.poor;
    return Colors.status.unsafe;
  };

  const bgColor = getTdsColor(tds);
  const accentColor = getAccentColor(tds);

  if (isLoading) {
    return (
      <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Card.Content>
          <SkeletonLoader width={120} height={20} borderRadius={4} />
          <View style={styles.content}>
            <SkeletonLoader width={100} height={40} borderRadius={8} />
          </View>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={[styles.card, { backgroundColor: bgColor }]}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Current TDS</Text>
          <MaterialCommunityIcons name="water" size={24} color={accentColor} />
        </View>
        <View style={styles.content}>
          <Text variant="displayLarge" style={{ fontWeight: 'bold', color: accentColor }}>
            {Math.round(tds * 100) / 100}
          </Text>
          <Text variant="titleMedium" style={{ marginLeft: 8, marginTop: 16, color: theme.colors.onSurface }}>
            ppm
          </Text>
        </View>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}>
          Last updated: {getRelativeTime(timestamp)}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
});
