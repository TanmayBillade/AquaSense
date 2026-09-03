import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../../theme';

interface TDSLineChartProps {
  data: Array<{timestamp: string, tds: number}>;
  title?: string;
  height?: number;
}

const screenWidth = Dimensions.get('window').width;

export const TDSLineChart: React.FC<TDSLineChartProps> = ({ data, title, height = 220 }) => {
  const theme = useAppTheme();

  if (!data || data.length === 0) {
    return (
      <View style={[styles.emptyContainer, { height }]}>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>No data available for this range</Text>
      </View>
    );
  }

  const chartData = {
    labels: data.map(d => {
      const date = new Date(d.timestamp);
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }),
    datasets: [
      {
        data: data.map(d => d.tds),
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`, // primary blue
        strokeWidth: 2
      }
    ],
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => theme.colors.onSurface,
    labelColor: (opacity = 1) => theme.colors.onSurfaceVariant,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: theme.colors.primary
    },
    propsForBackgroundLines: {
      stroke: theme.colors.outlineVariant,
    }
  };

  // calculate dynamic width for horizontal scroll if lots of points
  const chartWidth = Math.max(screenWidth - 32, data.length * 40);

  return (
    <View style={styles.container}>
      {title && (
        <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
          {title}
        </Text>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={height}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={false}
          withHorizontalLines={true}
          withDots={true}
          withShadow={true}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
    paddingHorizontal: 16,
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    paddingLeft: 16,
  }
});
