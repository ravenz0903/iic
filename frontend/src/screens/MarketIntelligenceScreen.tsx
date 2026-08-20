import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { GradientCard } from '../components/ui/GradientCard';
import { PriceHistoryChart } from '../components/charts/PriceHistoryChart';
import { StatBlock } from '../components/ui/StatBlock';

type Tab = 'prices' | 'trends' | 'compare';

export const MarketIntelligenceScreen = () => {
  const [activeTab, setActiveTab] = useState<Tab>('trends');
  const [loading, setLoading] = useState(false);
  const [produce, setProduce] = useState('wheat');
  
  const produces = [
    { id: 'wheat', label: 'Wheat' },
    { id: 'rice', label: 'Rice' },
    { id: 'tomato', label: 'Tomato' },
  ];

  // Mock data states
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any>(null);
  const [compareData, setCompareData] = useState<any[]>([]);

  useEffect(() => {
    loadMockData();
  }, [produce, activeTab]);

  const loadMockData = () => {
    setLoading(true);
    setTimeout(() => {
      // History
      const hist = Array.from({ length: 90 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (90 - i));
        return {
          date: date.toISOString(),
          price: 2500 + Math.sin(i / 10) * 150 + (Math.random() * 50 - 25),
        };
      });
      setHistoryData(hist);

      // Trend
      setTrendData({
        moving_avg_7d: 2480,
        trend_direction: 'rising',
        volatility: 0.042,
        price_change_7d_pct: 5.2,
      });

      // Compare
      setCompareData([
        { name: "Azadpur Mandi", distance_km: 15, current_price: 2520, transport_cost: 120, net_earnings: 2320, demand_level: "high", trend_direction: "rising" },
        { name: "Ghazipur Mandi", distance_km: 40, current_price: 2680, transport_cost: 280, net_earnings: 2310, demand_level: "medium", trend_direction: "stable" },
        { name: "Okhla Mandi", distance_km: 8, current_price: 2450, transport_cost: 70, net_earnings: 2340, demand_level: "high", trend_direction: "rising" }
      ].sort((a, b) => b.net_earnings - a.net_earnings));

      setLoading(false);
    }, 800);
  };

  const getDemandColor = (d: string) => d === 'high' ? colors.accent.emerald : d === 'medium' ? colors.accent.amber : colors.accent.rose;

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tab, activeTab === 'prices' && styles.tabActive]} onPress={() => setActiveTab('prices')}>
          <Text style={[styles.tabText, activeTab === 'prices' && styles.tabTextActive]}>📈 Prices</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'trends' && styles.tabActive]} onPress={() => setActiveTab('trends')}>
          <Text style={[styles.tabText, activeTab === 'trends' && styles.tabTextActive]}>📊 Trends</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'compare' && styles.tabActive]} onPress={() => setActiveTab('compare')}>
          <Text style={[styles.tabText, activeTab === 'compare' && styles.tabTextActive]}>⚖️ Compare</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.produceSelector}>
          {produces.map(p => (
            <TouchableOpacity 
              key={p.id}
              style={[styles.producePill, produce === p.id && styles.producePillActive]}
              onPress={() => setProduce(p.id)}
            >
              <Text style={[styles.producePillText, produce === p.id && styles.producePillTextActive]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.loader}><ActivityIndicator size="large" color={colors.accent.emerald} /></View>
        ) : (
          <>
            {activeTab === 'prices' && (
              <View style={styles.pricesTab}>
                {compareData.map((m, i) => (
                  <GradientCard key={i} borderColor={getDemandColor(m.demand_level)}>
                    <View style={styles.priceRowHeader}>
                      <Text style={styles.priceRowName}>{m.name}</Text>
                      <View style={[styles.demandBadge, { backgroundColor: `${getDemandColor(m.demand_level)}33` }]}>
                        <Text style={[styles.demandText, { color: getDemandColor(m.demand_level) }]}>{m.demand_level.toUpperCase()} DEMAND</Text>
                      </View>
                    </View>
                    <Text style={styles.priceRowValue}>₹{m.current_price}</Text>
                  </GradientCard>
                ))}
              </View>
            )}

            {activeTab === 'trends' && trendData && (
              <View style={styles.trendsTab}>
                <View style={[styles.trendBadge, { backgroundColor: trendData.trend_direction === 'rising' ? colors.accent.emerald : colors.accent.rose }]}>
                  <Text style={styles.trendBadgeText}>{trendData.trend_direction.toUpperCase()}</Text>
                </View>
                
                <PriceHistoryChart data={historyData} color={trendData.trend_direction === 'rising' ? colors.accent.emerald : colors.accent.rose} />
                
                <View style={styles.statsRow}>
                  <StatBlock label="7-Day Avg" value={`₹${trendData.moving_avg_7d}`} />
                  <StatBlock label="Volatility" value={`${(trendData.volatility * 100).toFixed(1)}%`} color={colors.accent.amber} />
                  <StatBlock label="7D Change" value={`+${trendData.price_change_7d_pct}%`} color={colors.accent.emerald} />
                </View>
                
                <View style={styles.insightBox}>
                  <Text style={styles.insightBoxText}>Price changed +{trendData.price_change_7d_pct}% in 7 days, showing strong upward momentum.</Text>
                </View>
              </View>
            )}

            {activeTab === 'compare' && (
              <View style={styles.compareTab}>
                {compareData.map((m, i) => (
                  <View key={i} style={[styles.compareCard, i === 0 && styles.compareCardBest]}>
                    {i === 0 && (
                      <View style={styles.bestBadge}>
                        <Text style={styles.bestBadgeText}>Best Net Realization</Text>
                      </View>
                    )}
                    <Text style={styles.compareName}>{m.name}</Text>
                    <View style={styles.compareDetails}>
                      <View style={styles.compareCol}>
                        <Text style={styles.compareLabel}>Price</Text>
                        <Text style={styles.compareVal}>₹{m.current_price}</Text>
                      </View>
                      <View style={styles.compareCol}>
                        <Text style={styles.compareLabel}>Distance</Text>
                        <Text style={styles.compareVal}>{m.distance_km} km</Text>
                      </View>
                      <View style={styles.compareCol}>
                        <Text style={styles.compareLabel}>Transport</Text>
                        <Text style={styles.compareVal}>₹{m.transport_cost}</Text>
                      </View>
                    </View>
                    <View style={styles.compareNetRow}>
                      <Text style={styles.compareNetLabel}>Net Earnings:</Text>
                      <Text style={[styles.compareNetVal, i === 0 && { color: colors.accent.emerald }]}>₹{m.net_earnings}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  tabBar: { flexDirection: 'row', backgroundColor: colors.bg.secondary, borderBottomWidth: 1, borderBottomColor: colors.bg.elevated },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.accent.emerald },
  tabText: { color: colors.text.muted, fontWeight: '600' },
  tabTextActive: { color: colors.accent.emerald, fontWeight: 'bold' },
  content: { padding: 16, paddingBottom: 40 },
  produceSelector: { flexDirection: 'row', marginBottom: 20 },
  producePill: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.bg.elevated, marginRight: 12 },
  producePillActive: { backgroundColor: colors.accent.emerald },
  producePillText: { color: colors.text.secondary, fontWeight: '600' },
  producePillTextActive: { color: '#000', fontWeight: 'bold' },
  loader: { marginTop: 40 },
  pricesTab: { gap: 12 },
  priceRowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  priceRowName: { color: colors.text.primary, fontSize: 18, fontWeight: 'bold' },
  demandBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  demandText: { fontSize: 10, fontWeight: 'bold' },
  priceRowValue: { color: colors.text.primary, fontSize: 28, fontWeight: '900' },
  trendsTab: { alignItems: 'center' },
  trendBadge: { paddingHorizontal: 24, paddingVertical: 8, borderRadius: 8, marginBottom: 20 },
  trendBadgeText: { color: '#000', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginVertical: 24, backgroundColor: colors.bg.secondary, padding: 16, borderRadius: 12 },
  insightBox: { backgroundColor: `${colors.accent.cyan}22`, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.accent.cyan, width: '100%' },
  insightBoxText: { color: colors.accent.cyan, fontSize: 14, fontWeight: '500', textAlign: 'center' },
  compareTab: { gap: 16 },
  compareCard: { backgroundColor: colors.bg.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.bg.elevated },
  compareCardBest: { borderColor: colors.accent.emerald, shadowColor: colors.accent.emerald, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  bestBadge: { position: 'absolute', top: -10, alignSelf: 'center', backgroundColor: colors.accent.emerald, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, zIndex: 1 },
  bestBadgeText: { color: '#000', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  compareName: { color: colors.text.primary, fontSize: 18, fontWeight: 'bold', marginBottom: 16, marginTop: 4 },
  compareDetails: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.bg.elevated },
  compareCol: { alignItems: 'center' },
  compareLabel: { color: colors.text.muted, fontSize: 12, marginBottom: 4 },
  compareVal: { color: colors.text.primary, fontSize: 16, fontWeight: '600' },
  compareNetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  compareNetLabel: { color: colors.text.secondary, fontSize: 16, fontWeight: 'bold' },
  compareNetVal: { color: colors.text.primary, fontSize: 24, fontWeight: '900' },
});
