import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface PredictionBadgeProps {
  direction: 'rising' | 'falling' | 'stable';
  change_pct: number;
}

export const PredictionBadge: React.FC<PredictionBadgeProps> = ({ direction, change_pct }) => {
  const getStyle = () => {
    switch (direction) {
      case 'rising': return { color: colors.accent.emerald, icon: '↑' };
      case 'falling': return { color: colors.accent.rose, icon: '↓' };
      case 'stable': return { color: colors.accent.amber, icon: '→' };
      default: return { color: colors.text.muted, icon: '?' };
    }
  };

  const { color, icon } = getStyle();

  return (
    <View style={[styles.container, { backgroundColor: `${color}22`, borderColor: color }]}>
      <Text style={[styles.icon, { color }]}>{icon}</Text>
      <Text style={[styles.text, { color }]}>{change_pct}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
