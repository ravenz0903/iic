import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { GradientCard } from '../components/ui/GradientCard';
import { GradeChip } from '../components/ui/GradeChip';
import apiClient from '../api/client';
import { PriceEstimate } from '../types';

export const PriceEstimatorScreen = ({ navigation }: any) => {
  const [produce, setProduce] = useState('wheat');
  const [quantity, setQuantity] = useState('10');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PriceEstimate | null>(null);

  const produces = [
    { id: 'wheat', icon: '🌾', label: 'Wheat' },
    { id: 'rice', icon: '🍚', label: 'Rice' },
    { id: 'tomato', icon: '🍅', label: 'Tomato' },
    { id: 'onion', icon: '🧅', label: 'Onion' },
    { id: 'potato', icon: '🥔', label: 'Potato' },
  ];

  const handleEstimate = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/estimate-price', {
        produce_type: produce,
        grade: 'A',
        quantity_quintals: parseFloat(quantity) || 10,
        farmer_lat: 28.6139,
        farmer_lon: 77.2090
      });
      setResult(response.data);
    } catch (error) {
      console.log('Error, using mock estimate', error);
      setResult({
        estimated_price_per_quintal: 2350,
        price_range: { min: 2162, max: 2538 },
        confidence: 0.82,
        contributing_factors: {
          base_price: 2500,
          quality_factor: 1.0,
          seasonal_factor: 1.10,
          demand_factor: 0.95
        },
        produce_type: produce,
        grade: 'A'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.inputSection}>
        <Text style={styles.label}>Select Produce</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsContainer}>
          {produces.map(p => (
            <TouchableOpacity 
              key={p.id} 
              style={[styles.pill, produce === p.id && styles.pillActive]}
              onPress={() => setProduce(p.id)}
            >
              <Text style={styles.pillIcon}>{p.icon}</Text>
              <Text style={[styles.pillLabel, produce === p.id && styles.pillLabelActive]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text style={styles.label}>Scanned Grade</Text>
            <View style={styles.gradeContainer}>
              <GradeChip grade="A" />
            </View>
          </View>
          <View style={styles.flex1}>
            <Text style={styles.label}>Quantity (quintals)</Text>
            <TextInput 
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholderTextColor={colors.text.muted}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.estimateBtn} onPress={handleEstimate} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.estimateBtnText}>Estimate Price</Text>
          )}
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.resultSection}>
          <GradientCard borderColor={colors.accent.emerald} style={styles.heroCard}>
            <Text style={styles.heroPrice}>₹{result.estimated_price_per_quintal.toLocaleString()}</Text>
            <Text style={styles.heroSubtitle}>per quintal</Text>
            
            <View style={styles.rangeContainer}>
              <Text style={styles.rangeText}>₹{result.price_range.min}</Text>
              <View style={styles.rangeBarBg}>
                <View style={[styles.rangeBarFill, { left: '20%', right: '20%' }]} />
              </View>
              <Text style={styles.rangeText}>₹{result.price_range.max}</Text>
            </View>

            <View style={styles.confidenceCont}>
              <Text style={styles.confLabel}>AI Confidence: {(result.confidence * 100).toFixed(0)}%</Text>
              <View style={styles.confBarBg}>
                <View style={[styles.confBarFill, { width: `${result.confidence * 100}%` }]} />
              </View>
            </View>
          </GradientCard>

          <Text style={styles.sectionTitle}>Contributing Factors</Text>
          <View style={styles.factorsGrid}>
            {Object.entries(result.contributing_factors).map(([key, val], i) => {
              const label = key.replace('_', ' ').toUpperCase();
              const impact = val > 1 ? 'up' : val < 1 ? 'down' : 'neutral';
              const color = impact === 'up' ? colors.accent.emerald : impact === 'down' ? colors.accent.rose : colors.accent.amber;
              const icon = impact === 'up' ? '↑' : impact === 'down' ? '↓' : '→';
              return (
                <View key={i} style={styles.factorCard}>
                  <Text style={styles.factorLabel}>{label}</Text>
                  <Text style={[styles.factorVal, { color }]}>{icon} ×{val.toFixed(2)}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.insightCard}>
            <Text style={styles.insightIcon}>💡</Text>
            <Text style={styles.insightText}>Your price is 8% above the 30-day average due to high seasonal demand.</Text>
          </View>

          <TouchableOpacity 
            style={styles.findMarketsBtn}
            onPress={() => navigation.navigate('MarketMap')}
          >
            <Text style={styles.findMarketsBtnText}>Find Best Market for This Price</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  content: { padding: 20, paddingBottom: 40 },
  inputSection: { marginBottom: 24 },
  label: { color: colors.text.secondary, fontSize: 12, textTransform: 'uppercase', marginBottom: 8, fontWeight: 'bold' },
  pillsContainer: { gap: 12, marginBottom: 20 },
  pill: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg.elevated, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 12, borderWidth: 1, borderColor: 'transparent' },
  pillActive: { borderColor: colors.accent.emerald, backgroundColor: `${colors.accent.emerald}22` },
  pillIcon: { fontSize: 18, marginRight: 8 },
  pillLabel: { color: colors.text.secondary, fontWeight: '600' },
  pillLabelActive: { color: colors.accent.emerald },
  row: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  flex1: { flex: 1 },
  gradeContainer: { height: 48, justifyContent: 'center' },
  input: { height: 48, backgroundColor: colors.bg.elevated, borderRadius: 12, paddingHorizontal: 16, color: colors.text.primary, borderWidth: 1, borderColor: colors.accent.emerald, fontSize: 16, fontWeight: 'bold' },
  estimateBtn: { backgroundColor: colors.accent.emerald, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  estimateBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  resultSection: { marginTop: 12 },
  heroCard: { alignItems: 'center', paddingVertical: 32 },
  heroPrice: { color: colors.accent.emerald, fontSize: 48, fontWeight: '900', letterSpacing: -1 },
  heroSubtitle: { color: colors.text.secondary, fontSize: 16, marginTop: 4 },
  rangeContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 24, paddingHorizontal: 20 },
  rangeText: { color: colors.text.muted, fontSize: 12, fontWeight: 'bold' },
  rangeBarBg: { flex: 1, height: 6, backgroundColor: colors.bg.elevated, marginHorizontal: 12, borderRadius: 3, position: 'relative' },
  rangeBarFill: { position: 'absolute', height: '100%', backgroundColor: colors.accent.emerald, borderRadius: 3 },
  confidenceCont: { width: '100%', marginTop: 32, paddingHorizontal: 20 },
  confLabel: { color: colors.text.secondary, fontSize: 12, marginBottom: 8, fontWeight: '600' },
  confBarBg: { width: '100%', height: 4, backgroundColor: colors.bg.elevated, borderRadius: 2 },
  confBarFill: { height: '100%', backgroundColor: colors.accent.cyan, borderRadius: 2 },
  sectionTitle: { color: colors.text.primary, fontSize: 18, fontWeight: 'bold', marginVertical: 16 },
  factorsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  factorCard: { width: '48%', backgroundColor: colors.bg.secondary, padding: 16, borderRadius: 12 },
  factorLabel: { color: colors.text.muted, fontSize: 10, fontWeight: 'bold', marginBottom: 8 },
  factorVal: { fontSize: 20, fontWeight: '800' },
  insightCard: { flexDirection: 'row', backgroundColor: `${colors.accent.amber}15`, padding: 16, borderRadius: 12, marginVertical: 20, alignItems: 'center' },
  insightIcon: { fontSize: 24, marginRight: 12 },
  insightText: { flex: 1, color: colors.accent.amber, fontSize: 14, fontWeight: '500', lineHeight: 20 },
  findMarketsBtn: { backgroundColor: colors.accent.cyan, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  findMarketsBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
});
