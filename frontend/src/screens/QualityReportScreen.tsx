import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { QualityReport } from '../types';
import { colors } from '../theme/colors';
import { ScoreRing } from '../components/ui/ScoreRing';
import { GradeChip } from '../components/ui/GradeChip';
import { GradientCard } from '../components/ui/GradientCard';
import { DefectHeatmap } from '../components/scanner/DefectHeatmap';
import { StatBlock } from '../components/ui/StatBlock';
import { SectionHeader } from '../components/ui/SectionHeader';

export const QualityReportScreen = ({ route, navigation }: any) => {
  const report: QualityReport = route.params.report;

  const getProduceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'wheat': return '🌾';
      case 'rice': return '🍚';
      case 'tomato': return '🍅';
      case 'onion': return '🧅';
      case 'potato': return '🥔';
      default: return '📦';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'minor': return colors.status.success;
      case 'moderate': return colors.status.warning;
      case 'severe': return colors.status.error;
      default: return colors.text.muted;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.batchId}>{report.batch_id}</Text>
        <Text style={styles.timestamp}>
          {new Date(report.timestamp).toLocaleString()}
        </Text>
      </View>

      <View style={styles.heroSection}>
        <ScoreRing score={report.quality_score} grade={report.grade} size={220} />
        <View style={styles.chipContainer}>
          <GradeChip grade={report.grade} />
        </View>
      </View>

      <View style={styles.confidenceContainer}>
        <Text style={styles.confidenceLabel}>AI Confidence</Text>
        <View style={styles.confidenceBarBg}>
          <View 
            style={[
              styles.confidenceBarFill, 
              { width: `${report.confidence_score * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.confidenceValue}>
          {(report.confidence_score * 100).toFixed(0)}%
        </Text>
      </View>

      <GradientCard borderColor={colors.accent.cyan} style={styles.produceCard}>
        <View style={styles.produceHeader}>
          <Text style={styles.produceIcon}>{getProduceIcon(report.produce_type)}</Text>
          <View>
            <Text style={styles.produceType}>{report.produce_type.toUpperCase()}</Text>
            <Text style={styles.produceSub}>Analyzed Produce</Text>
          </View>
        </View>
      </GradientCard>

      <SectionHeader title="Defect Analysis" subtitle="Visual detection and severity" />
      <GradientCard borderColor={colors.accent.amber}>
        <DefectHeatmap 
          defects={report.detected_defects} 
          totalArea={report.total_surface_area} 
        />
        
        <View style={styles.defectList}>
          {report.detected_defects.map((defect, i) => (
            <View key={i} style={styles.defectItem}>
              <Text style={styles.defectType}>{defect.type}</Text>
              <View style={styles.defectStats}>
                <View style={[styles.severityBadge, { backgroundColor: `${getSeverityColor(defect.severity)}33` }]}>
                  <Text style={[styles.severityText, { color: getSeverityColor(defect.severity) }]}>
                    {defect.severity}
                  </Text>
                </View>
                <Text style={styles.defectPercentage}>{defect.percentage.toFixed(1)}%</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.totalDefectRow}>
          <Text style={styles.totalDefectLabel}>Total Defected Area:</Text>
          <Text style={styles.totalDefectValue}>{report.defect_percentage.toFixed(1)}%</Text>
        </View>
      </GradientCard>

      <SectionHeader title="Size Distribution" subtitle="Estimated classification" />
      <GradientCard borderColor={colors.accent.purple}>
        <View style={styles.sizeGrid}>
          <StatBlock 
            label="Small" 
            value={`${report.size_analysis.small_pct}%`} 
            color={colors.text.secondary}
          />
          <StatBlock 
            label="Medium" 
            value={`${report.size_analysis.medium_pct}%`} 
            color={colors.accent.emerald}
          />
          <StatBlock 
            label="Large" 
            value={`${report.size_analysis.large_pct}%`} 
            color={colors.text.primary}
          />
        </View>
      </GradientCard>

      <SectionHeader title="Color Uniformity" />
      <GradientCard borderColor={colors.accent.rose}>
        <View style={styles.uniformityRow}>
          <Text style={styles.uniformityValue}>
            {(report.color_uniformity * 100).toFixed(0)}%
          </Text>
          <View style={styles.uniformityBarBg}>
            <View 
              style={[
                styles.uniformityBarFill, 
                { width: `${report.color_uniformity * 100}%` }
              ]} 
            />
          </View>
        </View>
      </GradientCard>

      <SectionHeader title="Recommendation" />
      <GradientCard borderColor={colors.accent.emerald}>
        <View style={styles.recommendationRow}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.recommendationText}>{report.recommended_handling}</Text>
        </View>
      </GradientCard>

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.findMarketsBtn}
          onPress={() => navigation.navigate('MarketMap', { qualityScore: report.quality_score })}
        >
          <Text style={styles.findMarketsText}>Find Markets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn}>
          <Text style={styles.shareText}>Share Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  batchId: {
    fontSize: 16,
    color: colors.text.primary,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  timestamp: {
    fontSize: 12,
    color: colors.text.muted,
    marginTop: 4,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  chipContainer: {
    marginTop: -20,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  confidenceLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    marginRight: 12,
  },
  confidenceBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: colors.bg.elevated,
    borderRadius: 3,
    marginRight: 12,
  },
  confidenceBarFill: {
    height: '100%',
    backgroundColor: colors.accent.cyan,
    borderRadius: 3,
  },
  confidenceValue: {
    color: colors.text.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  produceCard: {
    marginBottom: 24,
  },
  produceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  produceIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  produceType: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  produceSub: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  defectList: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.bg.elevated,
    paddingTop: 16,
  },
  defectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  defectType: {
    color: colors.text.primary,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  defectStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 12,
  },
  severityText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  defectPercentage: {
    color: colors.text.secondary,
    fontSize: 14,
    width: 40,
    textAlign: 'right',
  },
  totalDefectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.bg.elevated,
  },
  totalDefectLabel: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  totalDefectValue: {
    color: colors.status.error,
    fontWeight: 'bold',
    fontSize: 16,
  },
  sizeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  uniformityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uniformityValue: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 16,
    width: 50,
  },
  uniformityBarBg: {
    flex: 1,
    height: 12,
    backgroundColor: colors.bg.elevated,
    borderRadius: 6,
  },
  uniformityBarFill: {
    height: '100%',
    backgroundColor: colors.accent.rose,
    borderRadius: 6,
  },
  recommendationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  recommendationText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 14,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
  },
  findMarketsBtn: {
    flex: 2,
    backgroundColor: colors.accent.emerald,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  findMarketsText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  shareBtn: {
    flex: 1,
    backgroundColor: `${colors.accent.cyan}22`,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent.cyan,
  },
  shareText: {
    color: colors.accent.cyan,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
