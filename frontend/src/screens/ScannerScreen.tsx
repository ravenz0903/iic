import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { ScoreRing } from '../components/ui/ScoreRing';
import apiClient from '../api/client';
import { QualityReport } from '../types';

export const ScannerScreen = ({ navigation }: any) => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<QualityReport | null>(null);

  const handleScan = async () => {
    setIsScanning(true);
    setResult(null);

    // Mock payload
    const payload = {
      farmer_id: 1,
      produce_type: 'wheat',
      quantity_quintals: 10,
    };

    try {
      // Small artificial delay for effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      const response = await apiClient.post('/scan', payload);
      setResult(response.data);
    } catch (error) {
      console.log('Scan error, using mock data', error);
      // Fallback mock data
      setResult({
        batch_id: 'BATCH#WH-2026-0820-0042',
        produce_type: 'wheat',
        quality_score: 88.5,
        grade: 'A',
        detected_defects: [
          { type: 'bruising', area_pixels: 450, severity: 'minor', percentage: 3.2 },
          { type: 'discoloration', area_pixels: 280, severity: 'minor', percentage: 2.0 },
        ],
        defect_percentage: 5.2,
        total_surface_area: 14200,
        size_analysis: { small_pct: 15, medium_pct: 60, large_pct: 25 },
        color_uniformity: 0.91,
        recommended_handling: 'Standard handling - suitable for direct market sale',
        confidence_score: 0.89,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AGRI VISION</Text>
        <Text style={styles.subtitle}>AI Produce Intelligence</Text>
      </View>

      <View style={styles.content}>
        {!result && !isScanning && (
          <TouchableOpacity style={styles.scanZone} onPress={handleScan} activeOpacity={0.8}>
            <Text style={styles.scanIcon}>📸</Text>
            <Text style={styles.scanText}>Tap to Scan Produce</Text>
          </TouchableOpacity>
        )}

        {isScanning && (
          <View style={styles.loadingZone}>
            <ActivityIndicator size="large" color={colors.accent.emerald} />
            <Text style={styles.loadingText}>Analyzing Quality...</Text>
          </View>
        )}

        {result && !isScanning && (
          <View style={styles.resultZone}>
            <ScoreRing score={result.quality_score} grade={result.grade} size={200} />
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => navigation.navigate('QualityReport', { report: result })}
              >
                <Text style={styles.buttonText}>View Full Report</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('MarketMap', { qualityScore: result.quality_score })}
              >
                <Text style={styles.secondaryButtonText}>Find Markets</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.recentTitle}>Recent Scans</Text>
        <View style={styles.recentGrid}>
          {/* Mock recent scans */}
          {[
            { id: 1, score: 92, grade: 'A' },
            { id: 2, score: 78, grade: 'B' },
            { id: 3, score: 85, grade: 'A' },
          ].map(item => (
            <View key={item.id} style={styles.recentItem}>
              <Text style={styles.recentItemScore}>{item.score}</Text>
              <Text style={[
                styles.recentItemGrade, 
                { color: item.grade === 'A' ? colors.grade.A : colors.grade.B }
              ]}>{item.grade}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text.primary,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: colors.accent.cyan,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  scanZone: {
    borderWidth: 2,
    borderColor: colors.accent.emerald,
    borderStyle: 'dashed',
    borderRadius: 30,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.accent.emerald}10`,
  },
  scanIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  scanText: {
    fontSize: 18,
    color: colors.text.primary,
    fontWeight: '600',
  },
  loadingZone: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: colors.text.secondary,
    fontSize: 16,
  },
  resultZone: {
    alignItems: 'center',
  },
  actionButtons: {
    width: '100%',
    marginTop: 32,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.accent.emerald,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent.emerald,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.accent.emerald,
    fontSize: 16,
    fontWeight: 'bold',
  },
  recentSection: {
    padding: 24,
  },
  recentTitle: {
    color: colors.text.secondary,
    fontSize: 14,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  recentGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  recentItem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.bg.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.bg.elevated,
  },
  recentItemScore: {
    color: colors.text.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  recentItemGrade: {
    fontSize: 10,
    fontWeight: '800',
  },
});
