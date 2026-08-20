import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface ConfidenceMeterProps {
  confidence: number; // 0 to 1
  size?: 'sm' | 'md' | 'lg';
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ confidence, size = 'md' }) => {
  const getColor = () => {
    if (confidence < 0.5) return colors.accent.rose;
    if (confidence < 0.75) return colors.accent.amber;
    return colors.accent.emerald;
  };

  const color = getColor();

  const height = size === 'sm' ? 4 : size === 'lg' ? 12 : 8;

  return (
    <View style={styles.container}>
      <View style={[styles.barBg, { height }]}>
        <View style={[styles.barFill, { width: `${confidence * 100}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.label, { color }]}>{(confidence * 100).toFixed(0)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  barBg: {
    flex: 1,
    backgroundColor: colors.bg.elevated,
    borderRadius: 6,
    marginRight: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 32,
    textAlign: 'right',
  },
});
