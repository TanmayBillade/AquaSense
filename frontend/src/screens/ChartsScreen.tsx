import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { TimeRangeSelector } from '../components/charts/TimeRangeSelector';
import { TDSLineChart } from '../components/charts/TDSLineChart';
import { getHistory } from '../services/readingsService';

export const ChartsScreen = () => {
  const theme = useAppTheme();
  const [selectedRange, setSelectedRange] = useState('24h');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Here we'd map '24h' to real query params, simplified for this example
        const historyData = await getHistory({ limit: 50 });
        setData(historyData?.readings || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedRange]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onBackground }}>
            Analytics
          </Text>
        </View>

        <TimeRangeSelector
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
        />

        {isLoading ? (
          <View style={[styles.loadingContainer, { height: 300 }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <View style={styles.chartsContainer}>
            <TDSLineChart
              data={data}
              title="TDS Trend (ppm)"
              height={260}
            />
            {/* Using TDSLineChart for quality score as well just mapping data */}
            <TDSLineChart
              data={data.map(d => ({ ...d, tds: d.qualityScore || Math.max(0, 100 - d.tds/10) }))}
              title="Quality Score Trend"
              height={180}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 8,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartsContainer: {
    paddingBottom: 32,
  },
});
