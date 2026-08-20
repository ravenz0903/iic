import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { GradientCard } from '../components/ui/GradientCard';
import { GradeChip } from '../components/ui/GradeChip';
import apiClient from '../api/client';

export const BuyerMarketplaceScreen = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [produceFilter, setProduceFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [minQty, setMinQty] = useState('');

  const produces = ['All', 'Wheat', 'Rice', 'Tomato', 'Onion', 'Potato'];
  const grades = ['All', 'A', 'B', 'C'];

  useEffect(() => {
    fetchListings();
  }, [produceFilter, gradeFilter, minQty]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/listings?produce_type=${produceFilter === 'All' ? '' : produceFilter.toLowerCase()}&min_grade=${gradeFilter === 'All' ? '' : gradeFilter}&min_quantity=${minQty || 0}`);
      setListings(res.data);
    } catch (e) {
      console.log('Mocking marketplace listings');
      setTimeout(() => {
        setListings([
          { id: 1, type: 'Wheat', icon: '🌾', grade: 'A', quantity: 50, price: 2180, farmer: 'Ramesh Singh', location: 'Punjab', rating: 4.2, distance: 60 },
          { id: 2, type: 'Rice', icon: '🍚', grade: 'A', quantity: 15, price: 3100, farmer: 'Kisan Traders', location: 'Haryana', rating: 4.8, distance: 110 },
          { id: 3, type: 'Wheat', icon: '🌾', grade: 'B', quantity: 30, price: 2050, farmer: 'Ali Farms', location: 'UP', rating: 3.9, distance: 45 },
          { id: 4, type: 'Tomato', icon: '🍅', grade: 'C', quantity: 5, price: 3800, farmer: 'Verma Ji', location: 'Delhi', rating: 4.5, distance: 15 },
          { id: 5, type: 'Onion', icon: '🧅', grade: 'A', quantity: 25, price: 1800, farmer: 'Reddy Group', location: 'Nashik', rating: 4.9, distance: 1200 }
        ]);
        setLoading(false);
      }, 600);
    }
  };

  const getGradeColor = (g: string) => {
    if (g === 'A') return colors.accent.emerald;
    if (g === 'B') return colors.accent.amber;
    return colors.accent.rose;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛒 Marketplace</Text>
      </View>

      <View style={styles.filtersSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {produces.map(p => (
            <TouchableOpacity key={p} style={[styles.filterPill, produceFilter === p && styles.filterPillActive]} onPress={() => setProduceFilter(p)}>
              <Text style={[styles.filterText, produceFilter === p && styles.filterTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.filterScroll, { marginTop: 8 }]}>
          <Text style={styles.filterLabel}>Grade:</Text>
          {grades.map(g => (
            <TouchableOpacity key={g} style={[styles.filterPill, gradeFilter === g && styles.filterPillActive]} onPress={() => setGradeFilter(g)}>
              <Text style={[styles.filterText, gradeFilter === g && styles.filterTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
          <TextInput 
            style={styles.minQtyInput} 
            placeholder="Min qty (qtl)" 
            placeholderTextColor={colors.text.muted}
            value={minQty}
            onChangeText={setMinQty}
            keyboardType="numeric"
          />
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.accent.emerald} style={{marginTop: 40}} />
      ) : (
        <FlatList
          data={listings}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({item}) => (
            <GradientCard borderColor={getGradeColor(item.grade)} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.typeRow}>
                  <Text style={styles.typeIcon}>{item.icon}</Text>
                  <Text style={styles.typeText}>{item.type}</Text>
                  <GradeChip grade={item.grade} />
                </View>
                {item.quantity >= 20 && (
                  <View style={styles.bulkBadge}><Text style={styles.bulkText}>BULK</Text></View>
                )}
              </View>
              
              <View style={styles.midRow}>
                <View>
                  <Text style={styles.qtyText}>{item.quantity} quintals</Text>
                  <Text style={styles.farmerText}>{item.farmer} • {item.location}</Text>
                </View>
                <Text style={styles.priceText}>₹{item.price.toLocaleString()}<Text style={styles.priceSub}>/qtl</Text></Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.ratingText}>⭐ {item.rating}/5</Text>
                <Text style={styles.distText}>{item.distance} km away</Text>
              </View>

              <TouchableOpacity style={styles.offerBtn}>
                <Text style={styles.offerBtnText}>Make Offer</Text>
              </TouchableOpacity>
            </GradientCard>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  header: { padding: 20, paddingTop: 60, backgroundColor: colors.bg.secondary, borderBottomWidth: 1, borderBottomColor: colors.bg.elevated },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text.primary },
  filtersSection: { padding: 12, borderBottomWidth: 1, borderBottomColor: colors.bg.elevated, backgroundColor: colors.bg.primary },
  filterScroll: { gap: 8, alignItems: 'center' },
  filterLabel: { color: colors.text.muted, fontSize: 12, marginRight: 4 },
  filterPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: colors.bg.elevated },
  filterPillActive: { backgroundColor: colors.accent.emerald },
  filterText: { color: colors.text.secondary, fontSize: 12, fontWeight: 'bold' },
  filterTextActive: { color: '#000' },
  minQtyInput: { backgroundColor: colors.bg.elevated, height: 28, borderRadius: 14, paddingHorizontal: 12, color: colors.text.primary, fontSize: 12, marginLeft: 8, width: 90 },
  listContent: { padding: 16, gap: 16, paddingBottom: 40 },
  card: { padding: 16 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typeIcon: { fontSize: 20 },
  typeText: { color: colors.text.primary, fontSize: 18, fontWeight: 'bold' },
  bulkBadge: { backgroundColor: `${colors.accent.amber}33`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  bulkText: { color: colors.accent.amber, fontSize: 10, fontWeight: 'bold' },
  midRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  qtyText: { color: colors.text.primary, fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  farmerText: { color: colors.text.muted, fontSize: 12 },
  priceText: { color: colors.accent.emerald, fontSize: 24, fontWeight: '900' },
  priceSub: { fontSize: 12, fontWeight: 'normal' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  ratingText: { color: colors.accent.amber, fontSize: 12, fontWeight: 'bold' },
  distText: { color: colors.accent.amber, fontSize: 12, fontWeight: 'bold' },
  offerBtn: { borderWidth: 1, borderColor: colors.accent.emerald, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  offerBtnText: { color: colors.accent.emerald, fontSize: 14, fontWeight: 'bold' },
});
