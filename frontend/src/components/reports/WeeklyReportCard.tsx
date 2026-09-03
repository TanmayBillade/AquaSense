import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, Icon } from 'react-native-paper';
import { ReportType } from '../../hooks/useReports';
import { formatDate } from '../../utils/formatters';
import { useAppTheme } from '../../theme';
import { Colors } from '../../theme/colors';
import StatusBadge from '../common/StatusBadge';

interface WeeklyReportCardProps {
  report: ReportType;
  onExport?: () => void;
}

const safeNum = (val: any, fallback = 0): number => {
  const num = typeof val === 'number' ? val : parseFloat(val);
  return isNaN(num) ? fallback : num;
};

const WeeklyReportCard: React.FC<WeeklyReportCardProps> = ({ report, onExport }) => {
  const theme = useAppTheme();

  const getTrendIcon = (trend: string) => {
    const trendStr = typeof trend === 'string' ? trend.toLowerCase() : '';
    switch (trendStr) {
      case 'improving':
        return 'trending-down';
      case 'degrading':
        return 'trending-up';
      default:
        return 'trending-neutral';
    }
  };

  const getTrendColor = (trend: string) => {
    const trendStr = typeof trend === 'string' ? trend.toLowerCase() : '';
    switch (trendStr) {
      case 'improving':
        return Colors.status.excellent;
      case 'degrading':
        return Colors.status.poor;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  const getQualityStatus = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Moderate';
    if (score >= 40) return 'Poor';
    return 'Unsafe';
  };

  const avgTDS = safeNum(report.avgTDS ?? report.avgTds);
  const maxTDS = safeNum(report.maxTDS ?? report.maxTds);
  const minTDS = safeNum(report.minTDS ?? report.minTds);
  const medianTDS = safeNum(report.medianTDS ?? report.medianTds);
  const qualityScore = safeNum(report.qualityScore);
  const readingCount = safeNum(report.readingCount);
  const startDateStr = report.weekStart || report.startDate || new Date().toISOString();
  const endDateStr = report.weekEnd || report.endDate || new Date().toISOString();

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={2}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            {formatDate(startDateStr)} - {formatDate(endDateStr)}
          </Text>
          <View style={[styles.badgeContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {readingCount} readings
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>Average TDS</Text>
            <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
              {Math.round(avgTDS)}
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}> ppm</Text>
            </Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>Highest TDS</Text>
            <Text variant="headlineSmall" style={{ color: maxTDS > 300 ? Colors.status.poor : theme.colors.onSurface, fontWeight: '600' }}>
              {Math.round(maxTDS)}
            </Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>Lowest TDS</Text>
            <Text variant="headlineSmall" style={{ color: Colors.status.excellent, fontWeight: '600' }}>
              {Math.round(minTDS)}
            </Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>Median TDS</Text>
            <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
              {Math.round(medianTDS)}
            </Text>
          </View>
        </View>

        <View style={styles.qualitySection}>
          <View style={styles.qualityRow}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>Quality Score:</Text>
            <StatusBadge status={getQualityStatus(qualityScore)} />
          </View>
          <View style={styles.qualityRow}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>Trend:</Text>
            <View style={styles.trendContainer}>
              <Icon source={getTrendIcon(report.trend)} size={20} color={getTrendColor(report.trend)} />
              <Text variant="bodyMedium" style={{ color: getTrendColor(report.trend), marginLeft: 4, textTransform: 'capitalize' }}>
                {report.trend || 'stable'}
              </Text>
            </View>
          </View>
        </View>

        {report.recommendation ? (
          <View style={[styles.recommendationBox, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Icon source="information" size={20} color={theme.colors.onSecondaryContainer} />
            <Text variant="bodySmall" style={{ color: theme.colors.onSecondaryContainer, marginLeft: 8, flex: 1 }}>
              {report.recommendation}
            </Text>
          </View>
        ) : null}
      </Card.Content>
      <Card.Actions>
        <Button mode="outlined" onPress={onExport} icon="file-pdf-box" compact>
          Export PDF
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  qualitySection: {
    marginBottom: 16,
  },
  qualityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
    marginTop: 8,
  }
});

export default WeeklyReportCard;
