import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { GradientCard } from '../components/ui/GradientCard';
import apiClient from '../api/client';

export const BuyerMatchScreen = ({ route }: any) => {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await apiClient.get('/match/buyers/BATCH%23WH-2026-0820-0042?produce_type=wheat&grade=A&quality_score=88.5&quantity_quintals=10&farmer_lat=28.6139&farmer_lon=77.2090');
      setBuyers(res.data);
    } catch (e) {
      console.log('Mocking buyer matches');
      setTimeout(() => {
        setBuyers([
          { id: 1, name: 'Sunil Kumar', business: 'Azadpur Fresh Foods', match_pct: 94, exp_price: 2410, distance: 82, net_earning: 2270, rating: 4.8 },
          { id: 2, name: 'Vikram Singh', business: 'Global Agri Traders', match_pct: 88, exp_price: 2350, distance: 45, net_earning: 2220, rating: 4.2 },
          { id: 3, name: 'Anil Traders', business: 'Local Mills', match_pct: 85, exp_price: 2300, distance: 15, net_earning: 2250, rating: 3.9 },
          { id: 4, name: 'Kisan Organics', business: 'Premium Buyers', match_pct: 79, exp_price: 2600, distance: 210, net_earning: 2100, rating: 4.9 },
          { id: 5, name: 'Gupta & Sons', business: 'Wholesale Hub', match_pct: 72, exp_price: 2200, distance: 60, net_earning: 2050, rating: 4.0 },
        ]);
        setLoading(false);
      }, 800);
    }
  };

  const renderItem = ({ item, index }: any) => {
    const isBest = index === 0;
    
    return (
      <GradientCard borderColor={isBest ? colors.accent.emerald : colors.bg.elevated} style={[styles.card, isBest && styles.cardBest]}>
        {isBest && <View style={styles.bestBadge}><Text style={styles.bestBadgeText}>🏆 BEST MATCH</Text></View>}
        
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleArea}>
            <Text style={styles.buyerName}>{item.name}</Text>
            <Text style={styles.buyerBusiness}>{item.business}</Text>
            <Text style={styles.ratingText}>⭐ {item.rating}/5</Text>
          </View>
          
          <View style={styles.matchCircle}>
            <Text style={styles.matchPct}>{item.match_pct}%</Text>
            <Text style={styles.matchLbl}>Match</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <Text style={styles.statLbl}>Expected Price</Text>
            <Text style={styles.statVal}>₹{item.exp_price}</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statLbl}>Distance</Text>
            <Text style={styles.statVal}>{item.distance} km</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statLbl}>Net Earning</Text>
            <Text style={[styles.statVal, { color: colors.accent.emerald }]}>₹{item.net_earning}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.btnContact}>
            <Text style={styles.btnContactText}>Contact Buyer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOffer}>
            <Text style={styles.btnOfferText}>Send Offer</Text>
          </TouchableOpacity>
        </View>
      </GradientCard>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤝 AI Buyer Matching</Text>
      </View>
      
      <View style={styles.contextCard}>
        <Text style={styles.contextText}>Matching buyers for BATCH#WH-2026-0820-0042</Text>
        <Text style={styles.contextSub}>(Wheat, Grade A, 10 qtl)</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.accent.emerald} style={{marginTop: 40}} />
      ) : (
        <FlatList
          data={buyers}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  header: { padding: 20, paddingTop: 60, backgroundColor: colors.bg.secondary },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text.primary },
  contextCard: { backgroundColor: colors.bg.elevated, padding: 12, marginHorizontal: 16, marginTop: 16, borderRadius: 8 },
  contextText: { color: colors.text.primary, fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
  contextSub: { color: colors.text.secondary, fontSize: 12, textAlign: 'center', marginTop: 2 },
  listContent: { padding: 16, gap: 16, paddingBottom: 40 },
  card: { padding: 16 },
  cardBest: { shadowColor: colors.accent.emerald, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  bestBadge: { position: 'absolute', top: -10, left: 16, backgroundColor: colors.accent.emerald, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, zIndex: 1 },
  bestBadgeText: { color: '#000', fontSize: 10, fontWeight: 'bold' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 4 },
  cardTitleArea: { flex: 1 },
  buyerName: { color: colors.text.primary, fontSize: 20, fontWeight: 'bold' },
  buyerBusiness: { color: colors.text.secondary, fontSize: 14, marginBottom: 4 },
  ratingText: { color: colors.accent.amber, fontSize: 12, fontWeight: 'bold' },
  matchCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 3, borderColor: colors.accent.cyan, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg.secondary },
  matchPct: { color: colors.text.primary, fontSize: 16, fontWeight: 'bold' },
  matchLbl: { color: colors.accent.cyan, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.bg.elevated, paddingVertical: 12, marginBottom: 16 },
  statCol: { alignItems: 'center' },
  statLbl: { color: colors.text.muted, fontSize: 10, textTransform: 'uppercase', marginBottom: 4 },
  statVal: { color: colors.text.primary, fontSize: 14, fontWeight: 'bold' },
  actionsRow: { flexDirection: 'row', gap: 12 },
  btnContact: { flex: 1, borderWidth: 1, borderColor: colors.accent.cyan, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  btnContactText: { color: colors.accent.cyan, fontSize: 14, fontWeight: 'bold' },
  btnOffer: { flex: 1, backgroundColor: colors.accent.emerald, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  btnOfferText: { color: '#000', fontSize: 14, fontWeight: 'bold' },
});
