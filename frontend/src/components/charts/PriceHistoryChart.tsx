import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';

interface PriceHistoryEntry {
  date: string;
  price: number;
}

interface PriceHistoryChartProps {
  data: PriceHistoryEntry[];
  color?: string;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ 
  data, 
  color = colors.accent.emerald 
}) => {
  if (!data || data.length === 0) return null;

  const minPrice = Math.min(...data.map(d => d.price));
  const maxPrice = Math.max(...data.map(d => d.price));
  const range = maxPrice - minPrice || 1;
  const chartHeight = 150;
  const barWidth = 8;
  const barSpacing = 4;

  return (
    <View style={styles.container}>
      <View style={styles.yAxis}>
        <Text style={styles.yAxisLabel}>₹{maxPrice.toFixed(0)}</Text>
        <Text style={styles.yAxisLabel}>₹{((maxPrice + minPrice) / 2).toFixed(0)}</Text>
        <Text style={styles.yAxisLabel}>₹{minPrice.toFixed(0)}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chartArea}>
        {data.map((d, i) => {
          const barHeight = Math.max(10, ((d.price - minPrice) / range) * chartHeight);
          const isLast = i === data.length - 1;
          const showDate = i % 7 === 0;
          
          return (
            <View key={i} style={styles.barContainer}>
              <View style={[styles.barSpace, { height: chartHeight }]}>
                <View 
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      width: barWidth,
                      backgroundColor: isLast ? color : `${color}66`,
                    }
                  ]}
                />
              </View>
              <Text style={styles.xLabel}>
                {showDate ? new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 200,
    marginVertical: 16,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: colors.bg.elevated,
  },
  yAxisLabel: {
    color: colors.text.muted,
    fontSize: 10,
  },
  chartArea: {
    alignItems: 'flex-end',
    paddingLeft: 8,
  },
  barContainer: {
    width: 12,
    alignItems: 'center',
    marginRight: 4,
  },
  barSpace: {
    justifyContent: 'flex-end',
  },
  bar: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  xLabel: {
    marginTop: 8,
    color: colors.text.muted,
    fontSize: 10,
    width: 40,
    textAlign: 'center',
    transform: [{ rotate: '-45deg' }],
  },
});
