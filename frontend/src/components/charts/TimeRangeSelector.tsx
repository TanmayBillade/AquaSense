import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { useAppTheme } from '../../theme';

interface TimeRangeSelectorProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
  onCustomRange?: (start: Date, end: Date) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedRange,
  onRangeChange,
}) => {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={selectedRange}
        onValueChange={onRangeChange}
        buttons={[
          { value: '24h', label: '24h' },
          { value: '7d', label: '7d' },
          { value: '30d', label: '30d' },
          { value: 'custom', label: 'Custom' },
        ]}
        style={styles.buttons}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  buttons: {
    flex: 1,
  },
});
