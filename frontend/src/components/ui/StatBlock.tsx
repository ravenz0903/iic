import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface StatBlockProps {
  label: string;
  value: string;
  color?: string;
  icon?: string;
}

export const StatBlock: React.FC<StatBlockProps> = ({ 
  label, 
  value, 
  color = colors.text.primary,
  icon 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.valueContainer}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    fontSize: 18,
    marginRight: 6,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
