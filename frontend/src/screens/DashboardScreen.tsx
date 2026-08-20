import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { GradientCard } from '../components/ui/GradientCard';
import { ScoreRing } from '../components/ui/ScoreRing';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SparkLine } from '../components/charts/SparkLine';

export const DashboardScreen = ({ navigation }: any) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const generateSparkData = () => Array.from({ length: 15 }, () => Math.random() * 100 + 1500);

  const mockBatch = {
    id: 'BATCH#WH-2026-0820-0042',
    score: 88.5,
    grade: 'A',
    produce: 'wheat'
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome, Farmer</Text>
            <Text style={styles.dateText}>{currentDate}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => navigation.navigate('SimpleMode')} style={styles.simpleModeBtn}>
              <Text style={styles.simpleModeText}>Easy Mode</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Alerts')} style={styles.bellIconContainer}>
              <Text style={styles.bellIcon}>🔔</Text>
              <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('QualityReport', { report: { batch_id: mockBatch.id, quality_score: mockBatch.score, grade: mockBatch.grade, produce_type: mockBatch.produce, confidence_score: 0.89, timestamp: new Date().toISOString(), size_analysis: { small_pct: 15, medium_pct: 60, large_pct: 25 }, total_surface_area: 14200, defect_percentage: 5.2, detected_defects: [], color_uniformity: 0.91, recommended_handling: 'Standard' } })}>
          <GradientCard borderColor={colors.accent.cyan} style={styles.batchCard}>
            <View style={styles.batchHeader}>
              <View>
                <Text style={styles.batchLabel}>Active Batch</Text>
                <Text style={styles.batchId}>{mockBatch.id}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Scanned</Text>
              </View>
            </View>
            <View style={styles.batchContent}>
              <ScoreRing score={mockBatch.score} grade={mockBatch.grade} size={80} />
              <View style={styles.batchInfo}>
                <Text style={styles.produceIcon}>🌾</Text>
                <Text style={styles.produceName}>Wheat</Text>
              </View>
            </View>
          </GradientCard>
        </TouchableOpacity>

        <SectionHeader title="Quick Actions" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsScroll}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Scanner')}>
            <Text style={styles.actionIcon}>📸</Text>
            <Text style={styles.actionLabel}>Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('PriceEstimator')}>
            <Text style={styles.actionIcon}>💰</Text>
            <Text style={styles.actionLabel}>Price</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('MarketMap')}>
            <Text style={styles.actionIcon}>🗺️</Text>
            <Text style={styles.actionLabel}>Markets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('BuyerMarketplace')}>
            <Text style={styles.actionIcon}>🛒</Text>
            <Text style={styles.actionLabel}>Market</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('BuyerMatch')}>
            <Text style={styles.actionIcon}>🤝</Text>
            <Text style={styles.actionLabel}>Buyers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Offers')}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionLabel}>Offers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('MarketIntelligence')}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionLabel}>Trends</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Logistics')}>
            <Text style={styles.actionIcon}>🚛</Text>
            <Text style={styles.actionLabel}>Logistics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('ProfitCalculator')}>
            <Text style={styles.actionIcon}>📈</Text>
            <Text style={styles.actionLabel}>Profit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('BatchTimeline', { batch_id: mockBatch.id })}>
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionLabel}>Track</Text>
          </TouchableOpacity>
        </ScrollView>

        <SectionHeader title="Market Pulse" subtitle="Real-time commodity trends" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pulseContainer}>
          {[
            { name: 'Wheat', icon: '🌾', price: 2500, trend: 'up' },
            { name: 'Rice', icon: '🍚', price: 3200, trend: 'up' },
            { name: 'Tomato', icon: '🍅', price: 4000, trend: 'down' },
          ].map((item, i) => (
            <View key={i} style={styles.pulseCard}>
              <View style={styles.pulseHeader}>
                <Text style={styles.pulseIcon}>{item.icon}</Text>
                <Text style={styles.pulseName}>{item.name}</Text>
                <View style={[styles.trendDot, { backgroundColor: item.trend === 'up' ? colors.accent.emerald : colors.accent.rose }]} />
              </View>
              <Text style={styles.pulsePrice}>₹{item.price.toLocaleString()}</Text>
              <View style={styles.sparklineContainer}>
                <SparkLine data={generateSparkData()} color={item.trend === 'up' ? colors.accent.emerald : colors.accent.rose} width={120} height={40} />
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.sectionHeaderRow}>
          <SectionHeader title="Nearby Markets" />
          <TouchableOpacity onPress={() => navigation.navigate('MarketMap')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.marketsContainer}>
          {[
            { name: 'Azadpur Mandi', price: 2520, net: 2320, dist: 15 },
            { name: 'Ghazipur Mandi', price: 2680, net: 2310, dist: 40 },
            { name: 'Okhla Mandi', price: 2450, net: 2340, dist: 8 },
          ].map((m, i) => (
            <View key={i} style={styles.marketRow}>
              <View>
                <Text style={styles.marketName}>{m.name}</Text>
                <Text style={styles.marketDist}>{m.dist} km</Text>
              </View>
              <View style={styles.marketPrices}>
                <Text style={styles.marketPrice}>₹{m.price}</Text>
                <Text style={styles.marketNet}>Net: ₹{m.net}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* FAB for AI Copilot */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('Copilot')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>🤖</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  content: { padding: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: colors.text.primary },
  dateText: { fontSize: 14, color: colors.accent.cyan, marginTop: 4 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  simpleModeBtn: { backgroundColor: `${colors.accent.purple}33`, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: colors.accent.purple },
  simpleModeText: { color: colors.accent.purple, fontSize: 12, fontWeight: 'bold' },
  bellIconContainer: { position: 'relative', padding: 8 },
  bellIcon: { fontSize: 24 },
  badge: { position: 'absolute', top: 4, right: 4, backgroundColor: colors.accent.rose, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  batchCard: { padding: 16 },
  batchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  batchLabel: { fontSize: 12, color: colors.text.secondary, textTransform: 'uppercase' },
  batchId: { fontSize: 16, color: colors.text.primary, fontFamily: 'monospace', fontWeight: 'bold' },
  statusBadge: { backgroundColor: `${colors.accent.emerald}33`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: colors.accent.emerald, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  batchContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  batchInfo: { alignItems: 'center' },
  produceIcon: { fontSize: 40 },
  produceName: { color: colors.text.primary, fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  actionsScroll: { gap: 12, paddingRight: 20, paddingBottom: 8 },
  actionBtn: { width: 70, height: 70, backgroundColor: colors.bg.elevated, borderRadius: 35, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: `${colors.text.muted}44`, marginRight: 12 },
  actionIcon: { fontSize: 24, marginBottom: 4 },
  actionLabel: { fontSize: 10, color: colors.text.secondary, fontWeight: '600' },
  pulseContainer: { gap: 16, paddingRight: 20 },
  pulseCard: { backgroundColor: colors.bg.card, borderRadius: 16, padding: 16, width: 160, marginRight: 16 },
  pulseHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  pulseIcon: { fontSize: 16, marginRight: 8 },
  pulseName: { color: colors.text.secondary, fontSize: 14, flex: 1 },
  trendDot: { width: 8, height: 8, borderRadius: 4 },
  pulsePrice: { color: colors.text.primary, fontSize: 22, fontWeight: 'bold' },
  sparklineContainer: { marginTop: 12, alignItems: 'center' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  viewAll: { color: colors.accent.cyan, fontSize: 14, fontWeight: 'bold' },
  marketsContainer: { gap: 12, marginVertical: 12 },
  marketRow: { backgroundColor: colors.bg.secondary, padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  marketName: { color: colors.text.primary, fontSize: 16, fontWeight: '600' },
  marketDist: { color: colors.text.muted, fontSize: 12, marginTop: 4 },
  marketPrices: { alignItems: 'flex-end' },
  marketPrice: { color: colors.text.primary, fontSize: 16, fontWeight: 'bold' },
  marketNet: { color: colors.accent.emerald, fontSize: 14, fontWeight: 'bold', marginTop: 4 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 64, height: 64, borderRadius: 32, backgroundColor: colors.accent.cyan, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: colors.accent.cyan, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6, shadowRadius: 12 },
  fabIcon: { fontSize: 32 },
});
