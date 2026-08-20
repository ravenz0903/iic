import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { GradientCard } from '../components/ui/GradientCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import apiClient from '../api/client';

export const LogisticsScreen = ({ route }: any) => {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // API call placeholder - use Promise.all to fetch both
      const [optRes, comboRes] = await Promise.all([
        apiClient.post('/logistics/options', { distance_km: 15, quantity_quintals: 10 }),
        apiClient.post('/logistics/compare', { farmer_lat: 28.6139, farmer_lon: 77.2090, quantity_quintals: 10, quality_score: 88.5 })
      ]);
      setOptions(optRes.data.options);
      setCombos(comboRes.data.combinations);
    } catch (e) {
      console.log('Error fetching logistics data, using mock data.');
      // Mock Fallback
      setTimeout(() => {
        setOptions([
          { id: 1, type: 'Mini Truck', icon: '🛻', cost: 1200, capacity: '15 qtl', trips: 1, eta: '45 mins', cost_per_qtl: 120, best: false },
          { id: 2, type: 'Large Truck', icon: '🚚', cost: 2500, capacity: '40 qtl', trips: 1, eta: '60 mins', cost_per_qtl: 250, best: false },
          { id: 3, type: 'Shared Transport', icon: '🚐', cost: 800, capacity: 'varies', trips: 1, eta: '120 mins', cost_per_qtl: 80, best: true }
        ]);

        setCombos([
          { id: 1, buyer: 'Azadpur Fresh', vehicle: 'Shared Transport', net_profit: 23200, gross: 25000, transport: 800, fees: 1000, distance: '15 km', eta: '120 mins', best: true },
          { id: 2, buyer: 'Ghazipur Traders', vehicle: 'Mini Truck', net_profit: 22800, gross: 26000, transport: 2000, fees: 1200, distance: '40 km', eta: '60 mins', best: false },
          { id: 3, buyer: 'Okhla Market', vehicle: 'Mini Truck', net_profit: 23000, gross: 24500, transport: 600, fees: 900, distance: '8 km', eta: '30 mins', best: false }
        ]);
        setLoading(false);
      }, 800);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.accent.emerald} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerBox}>
        <Text style={styles.headerLabel}>Distance: 15 km  |  Quantity: 10 qtl</Text>
      </View>

      <SectionHeader title="Transport Options" />
      <View style={styles.optionsContainer}>
        {options.map((opt) => (
          <GradientCard key={opt.id} borderColor={opt.best ? colors.accent.cyan : colors.bg.elevated} style={styles.optCard}>
            {opt.best && <View style={styles.bestBadge}><Text style={styles.bestBadgeText}>Best Value</Text></View>}
            <View style={styles.optHeader}>
              <View style={styles.optTitleRow}>
                <Text style={styles.optIcon}>{opt.icon}</Text>
                <Text style={styles.optType}>{opt.type}</Text>
              </View>
              <Text style={styles.optCost}>₹{opt.cost}</Text>
            </View>
            <View style={styles.optDetails}>
              <View style={styles.optDetailCol}><Text style={styles.optDetailLbl}>Capacity</Text><Text style={styles.optDetailVal}>{opt.capacity}</Text></View>
              <View style={styles.optDetailCol}><Text style={styles.optDetailLbl}>Trips</Text><Text style={styles.optDetailVal}>{opt.trips}</Text></View>
              <View style={styles.optDetailCol}><Text style={styles.optDetailLbl}>ETA</Text><Text style={styles.optDetailVal}>{opt.eta}</Text></View>
            </View>
            <Text style={styles.optCostPer}>₹{opt.cost_per_qtl} / qtl</Text>
          </GradientCard>
        ))}
      </View>

      <SectionHeader title="Best Combinations" subtitle="Buyer × Transport matrix ranked by Net Profit" />
      <View style={styles.combosContainer}>
        {combos.sort((a,b)=>b.net_profit - a.net_profit).map((combo, idx) => (
          <View key={combo.id} style={[styles.comboCard, combo.best && styles.comboCardBest]}>
            {combo.best && <View style={styles.comboBestBadge}><Text style={styles.comboBestText}>🏆 BEST COMBO</Text></View>}
            <View style={styles.comboHeader}>
              <Text style={styles.comboBuyer}>{combo.buyer} + {combo.vehicle}</Text>
              <Text style={[styles.comboNet, combo.best && { color: colors.accent.emerald }]}>₹{combo.net_profit.toLocaleString()}</Text>
            </View>
            <View style={styles.comboBreakdown}>
              <Text style={styles.comboText}>Gross: ₹{combo.gross.toLocaleString()}</Text>
              <Text style={styles.comboText}>Transport: ₹{combo.transport.toLocaleString()}</Text>
              <Text style={styles.comboText}>Fees: ₹{combo.fees.toLocaleString()}</Text>
            </View>
            <View style={styles.comboFooter}>
              <Text style={styles.comboFooterText}>📍 {combo.distance}</Text>
              <Text style={styles.comboFooterText}>⏱️ {combo.eta}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  content: { padding: 16, paddingBottom: 40 },
  loader: { flex: 1, backgroundColor: colors.bg.primary, justifyContent: 'center', alignItems: 'center' },
  headerBox: { backgroundColor: colors.bg.secondary, padding: 12, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
  headerLabel: { color: colors.text.primary, fontWeight: 'bold', fontSize: 14 },
  optionsContainer: { gap: 12, marginBottom: 24 },
  optCard: { padding: 16 },
  bestBadge: { position: 'absolute', top: -10, right: 16, backgroundColor: colors.accent.cyan, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  bestBadgeText: { color: '#000', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  optHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  optTitleRow: { flexDirection: 'row', alignItems: 'center' },
  optIcon: { fontSize: 24, marginRight: 12 },
  optType: { color: colors.text.primary, fontSize: 16, fontWeight: 'bold' },
  optCost: { color: colors.accent.emerald, fontSize: 24, fontWeight: 'bold' },
  optDetails: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.bg.primary, padding: 12, borderRadius: 8, marginBottom: 12 },
  optDetailCol: { alignItems: 'center' },
  optDetailLbl: { color: colors.text.muted, fontSize: 10, textTransform: 'uppercase', marginBottom: 4 },
  optDetailVal: { color: colors.text.primary, fontSize: 14, fontWeight: '600' },
  optCostPer: { color: colors.text.secondary, fontSize: 12, textAlign: 'right' },
  combosContainer: { gap: 16 },
  comboCard: { backgroundColor: colors.bg.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.bg.elevated },
  comboCardBest: { borderColor: colors.accent.emerald, shadowColor: colors.accent.emerald, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
  comboBestBadge: { position: 'absolute', top: -10, left: 16, backgroundColor: colors.accent.emerald, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, zIndex: 1 },
  comboBestText: { color: '#000', fontSize: 10, fontWeight: 'bold' },
  comboHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 4 },
  comboBuyer: { color: colors.text.primary, fontSize: 14, fontWeight: 'bold', flex: 1 },
  comboNet: { color: colors.text.primary, fontSize: 20, fontWeight: '900' },
  comboBreakdown: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.bg.elevated, paddingBottom: 12, marginBottom: 12 },
  comboText: { color: colors.text.secondary, fontSize: 12 },
  comboFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  comboFooterText: { color: colors.text.muted, fontSize: 12, fontWeight: 'bold' },
});
