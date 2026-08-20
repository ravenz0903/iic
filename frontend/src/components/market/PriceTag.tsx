import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';

interface PriceTagProps {
  amount: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PriceTag: React.FC<PriceTagProps> = ({ amount, label, size = 'md' }) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'lg': return { fontSize: 24, fontWeight: '800' as const };
      case 'sm': return { fontSize: 14, fontWeight: '600' as const };
      case 'md':
      default: return { fontSize: 18, fontWeight: '700' as const };
    }
  };

  const textStyle = getSizeStyles();

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Text style={[styles.amount, textStyle]}>₹{amount.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  amount: {
    color: colors.text.primary,
  },
});
