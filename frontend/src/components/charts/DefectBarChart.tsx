import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface DefectData {
  type: string;
  percentage: number;
  severity: string;
}

interface DefectBarChartProps {
  defects: DefectData[];
}

export const DefectBarChart: React.FC<DefectBarChartProps> = ({ defects }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'minor': return colors.accent.emerald;
      case 'moderate': return colors.accent.amber;
      case 'severe': return colors.accent.rose;
      default: return colors.accent.cyan;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        {defects.map((d, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              {
                width: `${d.percentage}%`,
                backgroundColor: getSeverityColor(d.severity),
                borderTopLeftRadius: i === 0 ? 8 : 0,
                borderBottomLeftRadius: i === 0 ? 8 : 0,
                borderTopRightRadius: i === defects.length - 1 ? 8 : 0,
                borderBottomRightRadius: i === defects.length - 1 ? 8 : 0,
              }
            ]}
          />
        ))}
      </View>
      <View style={styles.labelsContainer}>
        {defects.map((d, i) => (
          <View key={i} style={styles.labelItem}>
            <View style={[styles.dot, { backgroundColor: getSeverityColor(d.severity) }]} />
            <Text style={styles.labelText}>{d.type} ({d.percentage}%)</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  barContainer: {
    flexDirection: 'row',
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.bg.elevated,
    overflow: 'hidden',
  },
  segment: {
    height: '100%',
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 12,
  },
  labelItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  labelText: {
    color: colors.text.secondary,
    fontSize: 12,
  },
});
