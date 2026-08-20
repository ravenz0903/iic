import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface GradientCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  borderColor?: string;
}

export const GradientCard: React.FC<GradientCardProps> = ({ 
  children, 
  style, 
  borderColor = colors.accent.emerald 
}) => {
  return (
    <View style={[styles.container, { borderLeftColor: borderColor }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg.card,
    borderRadius: 16,
    borderLeftWidth: 4,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});
