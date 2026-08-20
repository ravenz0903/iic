import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface SparkLineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export const SparkLine: React.FC<SparkLineProps> = ({ 
  data, 
  color = colors.accent.emerald, 
  width = 100, 
  height = 40 
}) => {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const barWidth = Math.max(2, (width / data.length) - 1);

  return (
    <View style={[styles.container, { width, height }]}>
      {data.map((val, index) => {
        const normalizedHeight = ((val - min) / range) * height;
        const barHeight = Math.max(4, normalizedHeight);
        const isLast = index === data.length - 1;
        
        return (
          <View
            key={index}
            style={[
              styles.bar,
              {
                width: barWidth,
                height: barHeight,
                backgroundColor: isLast ? color : `${color}88`,
                bottom: 0,
                left: index * (barWidth + 1),
                shadowColor: isLast ? color : 'transparent',
                shadowOpacity: isLast ? 0.8 : 0,
                shadowRadius: isLast ? 4 : 0,
                elevation: isLast ? 4 : 0,
              }
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  bar: {
    position: 'absolute',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
});
