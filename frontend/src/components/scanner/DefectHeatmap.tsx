import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DefectDetail } from '../../types';
import { colors } from '../../theme/colors';

interface DefectHeatmapProps {
  defects: DefectDetail[];
  totalArea: number;
}

export const DefectHeatmap: React.FC<DefectHeatmapProps> = ({ defects, totalArea }) => {
  const defectPercentage = defects.reduce((acc, d) => acc + d.percentage, 0);
  const healthyPercentage = Math.max(0, 100 - defectPercentage);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'minor': return colors.status.warning;
      case 'moderate': return colors.accent.amber;
      case 'severe': return colors.status.error;
      default: return colors.status.info;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        {/* Healthy Segment */}
        <View style={[styles.segment, { width: `${healthyPercentage}%`, backgroundColor: colors.status.success }]} />
        
        {/* Defect Segments */}
        {defects.map((defect, index) => (
          <View
            key={index}
            style={[
              styles.segment,
              { 
                width: `${defect.percentage}%`, 
                backgroundColor: getSeverityColor(defect.severity) 
              }
            ]}
          />
        ))}
      </View>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.status.success }]} />
          <Text style={styles.legendText}>Healthy ({healthyPercentage.toFixed(1)}%)</Text>
        </View>
        
        {defects.map((defect, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: getSeverityColor(defect.severity) }]} />
            <Text style={styles.legendText}>
              {defect.type} ({defect.percentage.toFixed(1)}%)
            </Text>
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
    overflow: 'hidden',
    backgroundColor: colors.bg.elevated,
    marginBottom: 12,
  },
  segment: {
    height: '100%',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
});
