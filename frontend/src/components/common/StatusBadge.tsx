import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors } from '../../theme/colors';

interface Props {
  status: string;
  size?: 'small' | 'medium' | 'large';
}

const StatusBadge: React.FC<Props> = ({ status, size = 'small' }) => {
  // Normalize to capitalize first letter for display and matching
  const normalized = typeof status === 'string'
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    : 'Unknown';

  let bgColor, textColor;
  switch (normalized) {
    case 'Excellent': bgColor = Colors.status.excellentBg; textColor = Colors.status.excellent; break;
    case 'Good': bgColor = Colors.status.goodBg; textColor = Colors.status.good; break;
    case 'Moderate': bgColor = Colors.status.moderateBg; textColor = Colors.status.moderate; break;
    case 'Poor': bgColor = Colors.status.poorBg; textColor = Colors.status.poor; break;
    case 'Unsafe': bgColor = Colors.status.unsafeBg; textColor = Colors.status.unsafe; break;
    default: bgColor = '#EEEEEE'; textColor = '#000000';
  }

  const fontSize = size === 'large' ? 16 : size === 'medium' ? 14 : 12;
  const paddingH = size === 'large' ? 16 : size === 'medium' ? 14 : 12;
  const paddingV = size === 'large' ? 8 : size === 'medium' ? 6 : 4;

  return (
    <View style={[styles.badge, { backgroundColor: bgColor, paddingHorizontal: paddingH, paddingVertical: paddingV }]}>
      <Text style={[styles.text, { color: textColor, fontSize }]}>{normalized}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { borderRadius: 16, alignSelf: 'flex-start' },
  text: { fontWeight: 'bold' },
});

export { StatusBadge };
export default StatusBadge;
