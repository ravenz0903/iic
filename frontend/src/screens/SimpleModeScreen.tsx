import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export const SimpleModeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <TouchableOpacity 
          style={[styles.bigBtn, { backgroundColor: `${colors.accent.emerald}22`, borderColor: colors.accent.emerald }]}
          onPress={() => navigation.navigate('Scanner')}
        >
          <Text style={styles.emoji}>📸</Text>
          <Text style={[styles.label, { color: colors.accent.emerald }]}>SCAN</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.bigBtn, { backgroundColor: `${colors.accent.cyan}22`, borderColor: colors.accent.cyan }]}
          onPress={() => navigation.navigate('QualityReport', { report: { batch_id: 'BATCH#WH-2026-0820-0042', quality_score: 88.5, grade: 'A', produce_type: 'wheat', confidence_score: 0.89, timestamp: new Date().toISOString(), size_analysis: { small_pct: 15, medium_pct: 60, large_pct: 25 }, total_surface_area: 14200, defect_percentage: 5.2, detected_defects: [], color_uniformity: 0.91, recommended_handling: 'Standard' } })}
        >
          <Text style={styles.emoji}>🔍</Text>
          <Text style={[styles.label, { color: colors.accent.cyan }]}>ANALYZE</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.bigBtn, { backgroundColor: `${colors.accent.amber}22`, borderColor: colors.accent.amber }]}
          onPress={() => navigation.navigate('PriceEstimator')}
        >
          <Text style={styles.emoji}>💰</Text>
          <Text style={[styles.label, { color: colors.accent.amber }]}>FIND PRICE</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.bigBtn, { backgroundColor: `${colors.accent.rose}22`, borderColor: colors.accent.rose }]}
          onPress={() => navigation.navigate('BuyerMarketplace')}
        >
          <Text style={styles.emoji}>🛒</Text>
          <Text style={[styles.label, { color: colors.accent.rose }]}>SELL</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.footerText}>🌾 AI Produce Intelligence</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '80%',
    gap: 20,
    justifyContent: 'center',
    alignContent: 'center',
  },
  bigBtn: {
    width: '45%',
    aspectRatio: 1,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  label: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  footerText: {
    position: 'absolute',
    bottom: 40,
    color: colors.text.muted,
    fontSize: 16,
    fontWeight: '600',
  },
});
