import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { GradientCard } from '../components/ui/GradientCard';
import apiClient from '../api/client';

export const OffersScreen = () => {
  const [tab, setTab] = useState<'Received'|'Sent'>('Received');
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, [tab]);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/offers?role=${tab === 'Received' ? 'farmer' : 'buyer'}`);
      setOffers(res.data);
    } catch (e) {
      console.log('Mocking offers');
      setTimeout(() => {
        if (tab === 'Received') {
          setOffers([
            { id: 1, buyer: 'Vikram Singh', offered: 2480, asking: 2520, qty: 10, status: 'pending', msg: 'Can pick up tomorrow morning.' },
            { id: 2, buyer: 'Fresh Foods Ltd', offered: 2550, asking: 2520, qty: 10, status: 'pending', msg: 'Premium price for Grade A guarantee.' },
            { id: 3, buyer: 'Local Mill', offered: 2200, asking: 2520, qty: 10, status: 'rejected', msg: 'Lowest price I can do.' }
          ]);
        } else {
          setOffers([
            { id: 4, buyer: 'Ramesh Farm', offered: 2100, asking: 2150, qty: 50, status: 'countered', counter: 2125, msg: 'Please accept for bulk.' }
          ]);
        }
        setLoading(false);
      }, 600);
    }
  };

  const getStatusStyle = (s: string) => {
    switch(s) {
      case 'pending': return { color: colors.accent.amber, label: 'Pending' };
      case 'accepted': return { color: colors.accent.emerald, label: 'Accepted' };
      case 'rejected': return { color: colors.accent.rose, label: 'Rejected' };
      case 'countered': return { color: colors.accent.cyan, label: 'Countered' };
      default: return { color: colors.text.muted, label: s };
    }
  };

  const renderItem = ({ item }: any) => {
    const statusStyle = getStatusStyle(item.status);
    const pctDiff = ((item.offered - item.asking) / item.asking) * 100;
    const isAbove = item.offered > item.asking;

    return (
      <GradientCard borderColor={statusStyle.color} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.buyerName}>{item.buyer}</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${statusStyle.color}33` }]}>
            <Text style={[styles.statusText, { color: statusStyle.color }]}>{statusStyle.label}</Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <View style={styles.priceCol}>
            <Text style={styles.priceLbl}>Offered</Text>
            <Text style={[styles.priceVal, { color: colors.text.primary }]}>₹{item.offered}</Text>
          </View>
          <View style={styles.priceCol}>
            <Text style={styles.priceLbl}>Asking</Text>
            <Text style={styles.priceVal}>₹{item.asking}</Text>
          </View>
          <View style={styles.priceCol}>
            <Text style={styles.priceLbl}>Diff</Text>
            <Text style={[styles.priceVal, { color: isAbove ? colors.accent.emerald : colors.accent.amber }]}>
              {pctDiff > 0 ? '+' : ''}{pctDiff.toFixed(1)}%
            </Text>
          </View>
        </View>
        
        {isAbove && <Text style={styles.aboveText}>Above asking! 🎉</Text>}
        
        <View style={styles.detailsBox}>
          <Text style={styles.detailLbl}>Quantity: <Text style={styles.detailVal}>{item.qty} qtl</Text></Text>
          <Text style={styles.detailLbl}>Message: <Text style={styles.detailVal}>{item.msg}</Text></Text>
        </View>

        {item.status === 'pending' && tab === 'Received' && (
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.accent.emerald }]}><Text style={[styles.actionBtnText, {color:'#000'}]}>Accept ✓</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.accent.cyan }]}><Text style={[styles.actionBtnText, {color:colors.accent.cyan}]}>Counter ↩</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: `${colors.accent.rose}33` }]}><Text style={[styles.actionBtnText, {color:colors.accent.rose}]}>Reject ✗</Text></TouchableOpacity>
          </View>
        )}
      </GradientCard>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💬 Offers</Text>
      </View>
      
      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tab, tab === 'Received' && styles.tabActive]} onPress={() => setTab('Received')}>
          <Text style={[styles.tabText, tab === 'Received' && styles.tabTextActive]}>Received</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'Sent' && styles.tabActive]} onPress={() => setTab('Sent')}>
          <Text style={[styles.tabText, tab === 'Sent' && styles.tabTextActive]}>Sent</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.accent.emerald} style={{marginTop: 40}}/>
      ) : (
        <FlatList
          data={offers}
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
  tabBar: { flexDirection: 'row', backgroundColor: colors.bg.secondary, borderBottomWidth: 1, borderBottomColor: colors.bg.elevated },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.accent.emerald },
  tabText: { color: colors.text.muted, fontWeight: '600' },
  tabTextActive: { color: colors.accent.emerald, fontWeight: 'bold' },
  listContent: { padding: 16, gap: 16, paddingBottom: 40 },
  card: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  buyerName: { color: colors.text.primary, fontSize: 18, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.bg.secondary, padding: 12, borderRadius: 8, marginBottom: 12 },
  priceCol: { alignItems: 'center' },
  priceLbl: { color: colors.text.muted, fontSize: 10, textTransform: 'uppercase', marginBottom: 4 },
  priceVal: { color: colors.text.secondary, fontSize: 16, fontWeight: 'bold' },
  aboveText: { color: colors.accent.emerald, fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  detailsBox: { marginBottom: 16 },
  detailLbl: { color: colors.text.secondary, fontSize: 12, marginBottom: 4 },
  detailVal: { color: colors.text.primary, fontWeight: '500' },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  actionBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  actionBtnText: { fontSize: 12, fontWeight: 'bold' },
});
